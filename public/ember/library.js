function postObject(url,request,successCallback,context, ignore){
	if(!ignore) ignore = false;
	setLoading(context);
	try{
		$.ajax({
			type:"POST",
			dataType:'json',
			url:url,
			contentType:"application/x-www-form-urlencoded",
			data:request,
			xhrFields:{
				withCredentials:true
			},
			success:function(data){
				cleanLoading(context);
				if(!data||parseInt(data.result.errorId) && !ignore){
					errorInfo(data.result.errorText, context);
					return;
				}
				successCallback(data);
			},
			error:function(data){
				cleanLoading(context);
			}
		});
	}catch(ex){
		cleanLoading(context);
	}
}

function getTemplate(path,view,templateName){
	if(templateName!=null){
		var template=Ember.TEMPLATES[templateName];
		if(template!=null){
			view.set("templateName",templateName);
			view.rerender();
			return;
		}
	}
	$.ajax({
		url:path,
		xhrFields:{
			withCredentials:true
		},
		success:function(data){
			var templateName="";
			$(data).filter('script[type="text/x-handlebars"]').each(function(){
				templateName=$(this).attr('data-template-name');
				Ember.TEMPLATES[templateName]=Ember.Handlebars.compile($(this).html());
			});
			if(view!=null){
				view.set("templateName",templateName);
				view.rerender();
			}
		},
		error:function(data){
			console.log(context);
		}
	});
}

function openEditView(viewName,callback,width){
	if(width)
		$(".modal-dialog").css('width',width);
	else
		$(".modal-dialog").css('width',"");
	FactoryController.loadEditView(viewName,callback);
	$('#editView').modal({
		show:true,
		keyboard:true
	});
}

function closeEditView(){
	$('#editView').modal('hide');
}

function cleanLoading(context){
	Ember.run.next(this,function(){
		if(!context) return;
		context.set("loading","loading-container");
		context.set("loading","loading-container hidden");
	});
}
function setLoading(context){
	Ember.run.next(this,function(){
		if(!context) return;
		context.set("loading","loading-container hidden");
		context.set("loading","loading-container");
	});
}

function errorInfo(errorMessage,controller){
	Ember.run.next(this,function(){
		if(!controller ||!errorMessage) return;
		controller.set("state","has-error");
		controller.set("info",errorMessage);
	});
}
function warningInfo(warningMessage,controller){
	if(!controller || !warningMessage) return;
	controller.set("state","has-warning");
	controller.set("info",warningMessage);
}
function successInfo(message,controller){
	if(!controller || !message) return;
	controller.set("state","has-success");
	controller.set("info",message);
}

function capitaliseFirstLetter(string){
    if(!string) return null;
    return string.charAt(0).toUpperCase()+string.slice(1);
}