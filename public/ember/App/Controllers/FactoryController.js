var BreadcrumbsCollection = Ember.ArrayProxy.create({
    content: []
});

var FactoryController = Em.ArrayController.create({
    controllerPath : "/ember/App/Controllers/",
    viewPath : "/ember/App/Views/",
    templatePath : "/ember/App/Templates/",
    currentAppView : null,
    currentAppTemplate : null,
    lastAppView : null,
    currentServiceView : null,
    currentServiceTemplate : null,
    lastServiceView : null,
    lastServiceTemplate : null,
    currentEditView : null,
    currentEditTemplate : null,
    lastServiceData : null,
    stackCount : null,
    loadSectionTimes : 0,
    previousViews : [],
 
    setController : function(controller, controllerName, callback){
        if(controller != null)
            return;
        FactoryController.loadController(controllerName, callback);
    },
 
    loadController : function(controllerName, callback){
        var url = FactoryController.get("controllerPath") + controllerName + ".js";
        FactoryController.loadViaAjax(url);
    },

    loadViaAjax: function(url, callback){
        $.getScript(url, function() {
            callback();
        });
    },
 
    setView : function(view, viewName){
        if(view != null)
            return;
        FactoryController.loadView(viewName);
    },
 
    loadView : function(viewName){
        var url = FactoryController.get("viewPath") + viewName + ".js";
        FactoryController.loadViaAjax(url);
    }, 
 
    loadServiceView : function(templateName, callback){
        if(templateName == null || templateName == "")
            return;
        var currentServiceTemplate = FactoryController.get("currentServiceTemplate");
        var view = FactoryController.loadTemplate(templateName, callback);
        if(view == null)
            return;
        if(view.get("state") == "inDOM")
            return; 
        var stackCount = FactoryController.get("stackCount");
        stackCount++;
        if($('#serviceDetail').length == 0){
            if( stackCount == 10){
                stackCount = 0;
                FactoryController.set("stackCount", stackCount);
                return;
            }
            window.setTimeout(FactoryController.loadServiceView, 50, templateName, callback);
            return;
        }
        stackCount = 0;
        FactoryController.set("stackCount", stackCount);
        var serviceView = FactoryController.get("currentServiceView");
        if(serviceView != null){
            FactoryController.set("lastServiceView", serviceView);
            FactoryController.set("lastServiceTemplate", currentServiceTemplate);
        }
 
        var containerView = Em.View.views['serviceDetail'];
        var temp = containerView.toArray(); 
        if(temp.length > 0) containerView.removeAllChildren();
        containerView.addObject(view);
        FactoryController.set("currentServiceTemplate", templateName);
        FactoryController.set("currentServiceView", view);
    },
 
    loadSection : function(container, templateName, callback){
        if(templateName == null || templateName == "")
            return;
        var view = FactoryController.loadTemplate(templateName, callback);
        var containerView = Em.View.views[container];
        if(containerView == null){
            var loadSectionTimes = FactoryController.get("loadSectionTimes") + 1;
            window.setTimeout(FactoryController.loadSection, 50, container, templateName, callback);
            FactoryController.set("loadSectionTimes", loadSectionTimes);
            return;
        }
        var temp = containerView.toArray(); 
        if(temp.length > 0){
            if(!view.get("isDestroyed"))
                containerView.removeAllChildren();
        }
 
        containerView.addObject(view);
 
        RepositoryController.updateSectionView(container, templateName, view);
        Ember.run.sync();
    },
 
    loadAppView : function(templateName, callback){
        if(templateName == null || templateName == "")
            return;
        var currentAppTemplate = FactoryController.get("currentAppTemplate");
        if(currentAppTemplate == templateName)
            return;
        var view = FactoryController.loadTemplate(templateName, callback);
        if(view == null)
            return;
        if(view.get("state") == "inDOM" && view.get("isInserted"))
            return;
 
        var serviceView = FactoryController.get("currentServiceView");
        var currentServiceTemplate = FactoryController.get("currentServiceTemplate");
        if(serviceView != null){ 
            FactoryController.set("lastServiceView", serviceView);
            FactoryController.set("lastServiceTemplate", currentServiceTemplate);
        }
 
        var appView = FactoryController.get("currentAppView");
        var appTemplateName = FactoryController.get("currentAppTemplate");
        if(appView != null){
            var element = $("#" + appTemplateName);
            if(element.length > 0 && element.hasClass("active"))
                element.removeClass("active"); 
                
            FactoryController.removeView(appView, appTemplateName);
            FactoryController.set("lastAppView", appView);
        }
        FactoryController.set("currentAppTemplate", templateName);
        
        var previousViews=FactoryController.get("previousViews");
        if(templateName == "index")
            previousViews = [];
        
        previousViews.push(createCurrentView(templateName, "section"));
        FactoryController.set("previousViews",previousViews);
 
        var containerView = Em.View.views['appContainerView']; 
        if(containerView == undefined)
            return;
        var temp = containerView.toArray(); 
        if(temp.length > 0)
            containerView.unshiftObject();
        containerView.addObject(view);
        FactoryController.set("currentAppView", view);
        element = $("#" + templateName);
        if(element.length > 0 && !element.hasClass("active"))
            element.addClass("active");
 
        if(templateName == "service"){
            Ember.run.next(this, function(){
                view.reopen({
                    didInsertElement: function() {
                        window.setTimeout(setAccordions, 100);
                    }
                }); 
            });
        } 
        Ember.run.sync();
    },
 
    loadEditView : function(templateName, callback){
        if(templateName == null || templateName == "")
            return;
        var view = FactoryController.loadTemplate(templateName, callback);
        if(view == null)
            return;
 
        var containerView = Em.View.views['modalContainerView']; 
        if(containerView == undefined)
            return;
        var temp = containerView.toArray(); 
        if(temp.length > 0)
            containerView.removeAllChildren();
        containerView.addObject(view);
 
        FactoryController.set("currentEditView", view);
        FactoryController.set("currentEditTemplate", templateName);
    }, 
 
    removeView : function(view, viewName){
        if(view != null){
            var sections = RepositoryController.getSectionViewsByParentView(viewName);
            if(sections != null){
                for(var i = 0; i < sections.length; i++){
                    sections[i].removeFromParent();
                    sections[i].destroyElement();
                    sections.set("isInserted", false);
                }
            } 
            view.removeFromParent();
            view.destroyElement();
            view.set("isInserted", false);
            view.set("parentElement", null);
        }
    }, 
 
    loadTemplate : function(templateName, callback){
        try{
            if(!templateName)
                return null;
            templateName = capitaliseFirstLetter(templateName);
            if( RepositoryController !== undefined ){
                var template = RepositoryController.getTemplate(templateName);
                if(template != null && !template.get("isDestroyed") && ! template.get("isDestroying"))
                    return template;
            } 
            template = Ember.View.create({
                isInserted : false,
                isLoaded : false,
                parentElement : null,
                wasCalled : false,
                willInsertElement : function(){
                    var isLoaded = this.isLoaded;
                    if(!isLoaded){
                        getTemplate(FactoryController.get("templatePath") + templateName + ".handlebars", this);
                        this.set("isLoaded", true);
                    }
                }, 
                didInsertElement : function(){
                    var isInserted = this.isInserted;
                    Ember.run.later(function () {
                        Ember.run.sync();
                    }, 100); 
 
                    if(isInserted)
                        return;
                    if(callback == null){
                        this.set("isInserted", true);
                        return;
                    }
                    callback();
 
                },
                willDestroyElement : function(){
                    this.set("isInserted", false);
                }
            });
            if( RepositoryController !== undefined )
                RepositoryController.updateTemplate(templateName, template);
 
            return template;
        } catch(e){
        //tratamento de erro
        }
    },
 
    preloadTemplate : function(templateName){
        if(templateName == null)
            return;
        templateName = capitaliseFirstLetter(templateName);
        var template = RepositoryController.getTemplate(templateName);
        if(template != null)
            return;
        getTemplate(FactoryController.get("templatePath") + templateName + ".handlebars", null, templateName);
    },
 
    preLoadServiceView : function(){
        var template = Ember.View.create({
            templateName : 'service',
            isInserted : false,
            didInsertElement : function(){ 
                this.set("isInserted", true);
            }
        });
        RepositoryController.updateTemplate('service', template);
    },

    addNewBreadcrumbs : function(templateName, name){
        var breadcrumbItem = Ember.Object.create();
        breadcrumbItem.set("templateName", templateName);
        breadcrumbItem.set("name", name);
        BreadcrumbsCollection.pushObject(breadcrumbItem);
    },
 
    removeBreadcrumb : function(templateName){
        var items = BreadcrumbsCollection.get("content");
        if(items == null)
            return;
        var newBreadCrumbCollection = [];
        for(var i = 0; i < items.length; i++){
            if(items[i].get("templateName") == templateName)
                break;
            newBreadCrumbCollection.push(items[i]);
        }
        BreadcrumbsCollection.set("content", newBreadCrumbCollection);
    },
 
    removeAllBreadcrumbs : function(){
        BreadcrumbsCollection.set("content", []);
    },
    
    goToPreviusView:function(){
        var previousViews=FactoryController.get("previousViews");
        if(previousViews==null||previousViews.length==0){
            FactoryController.loadAppView("index");
            return;
        }
        if(previousViews.length-1==0){
            previousViews.pop();
            FactoryController.loadAppView("index");
            FactoryController.set("previousViews",previousViews);
            return;
        }
        previousViews.pop();
        var previousView = previousViews[previousViews.length-1];
        if(previousView.template == "index"){
            previousViews = [];
            FactoryController.loadAppView("index");
            FactoryController.set("previousViews",previousViews);
        }
        switch(previousView.type){
            case "dialog":
                FactoryController.loadEditView(previousView.template);
                break;
            case "home":
                FactoryController.loadAppView("index");
                break;
            case "section":
                previousViews.pop();
                FactoryController.loadAppView(previousView.template);
                break;
        }
        FactoryController.set("previousViews",previousViews);
    }
});