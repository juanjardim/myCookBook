/* Controllers */


/* Views */
MessagingView = null;

var RepositoryController = Em.ArrayController.create({
	currentItem : null,
	createdEditViews : [],
	createdAppView : [],
	createdServiceView : [],
	createdSectionView : [],
	sectionView : [],
	templates : [],

	setSelectedItem : function(itemId){
		var currentItem = RepositoryController.get("currentItem");
		if(currentItem == itemId){
			RepositoryController.updateSelectedItem();
			return;
		}
		Ember.run.next(this, function(){
			if(currentItem != null)
				$('li[elementId='+ currentItem +']').removeClass("active");
			$('li[elementId='+ itemId +']').addClass("active");
			RepositoryController.set("currentItem", itemId);
		}
		);
	},

	updateSelectedItem : function(){
		Ember.run.next(this, function(){
			var currentItem = RepositoryController.get("currentItem"); 
			if(currentItem == null)
				return;
			var element = $('li[elementId='+ currentItem +']');
			if(element == null)
				return;
			element.addClass("active");
			element.parent().parent().stop().scrollTo(element);
		});
	},


	entries : [],
	getEntry : function(context, id){
		var entries = RepositoryController.get("entries");
		for(var i = 0; i < entries.length; i++){
			if(entries[i].get("id") == id && entries[i].get("context") == context)
				return entries[i].get("entry"); 
		}
		return null;
	},

	updateEntry : function(context, id, entry){
		if(context == null || id == null)
			return;
		var entries = RepositoryController.get("entries");
		for(var i = 0; i < entries.length; i++){
			if(entries[i].get("id") == id && entries[i].get("context") == context){
				entries[i].set("entry", entry);
				return;
			} 
		}
		var hasEntry = RepositoryController.getEntry(context, id);
		if(hasEntry != null)
			return;
		entries.pushObject(Ember.Object.create({
			id : id,
			context : context,
			entry : entry
		}));
	},

	getCreatedView : function(fileName, storage){
		var entries = RepositoryController.get(storage);
		if(entries == null)
			return null;
		for(var i = 0; i < entries.length; i++){
			if(entries[i].get("fileName") == fileName)
				return entries[i].get("entry"); 
		}
		return null;
	},

	updateCreatedView : function(fileName, view, storage){
		if(fileName == null || view == null)
			return;
		var entries = RepositoryController.get(storage);
		if(entries == null)
			return;
		for(var i = 0; i < entries.length; i++){
			if(entries[i].get("fileName") == fileName){
				entries[i].set("entry", view);
				return;
			} 
		}
		var hasEntry = RepositoryController.getCreatedView(fileName, storage);
		if(hasEntry != null)
			return;
		entries.pushObject(Ember.Object.create({
			fileName : fileName,
			entry : view
		}));
	},

	getSectionViewsByParentView : function(parentViewName){
		var entries = RepositoryController.get("sectionView");
		if(entries == null)
			return null;
		var views = [];
		for(var i = 0; i < entries.length; i++){
			if(entries[i].get("parentViewName") == parentViewName)
				views.push(entries[i].get("entry")); 
		}
		return views;
	},

	getSectionView : function(parentViewName, sectionViewName){
		var entries = RepositoryController.get("sectionView");
		if(entries == null)
			return null;
		for(var i = 0; i < entries.length; i++){
			if(entries[i].get("parentViewName") == parentViewName && entries[i].get("sectionViewName") == sectionViewName)
				return entries[i].get("entry"); 
		}
		return null;
	},

	updateSectionView : function(parentViewName, sectionViewName, view){
		if(parentViewName == null || sectionViewName == null || view == null)
			return;
		var entries = RepositoryController.get("sectionView");

		for(var i = 0; i < entries.length; i++){
			if(entries[i].get("parentViewName") == parentViewName && entries[i].get("sectionViewName") == sectionViewName){
				entries[i].set("entry", view);
				return;
			} 
		}
		var hasEntry = RepositoryController.getSectionView(parentViewName, sectionViewName);
		if(hasEntry != null)
			return;
		entries.pushObject(Ember.Object.create({
			parentViewName : parentViewName,
			sectionViewName : sectionViewName,
			entry : view
		}));
	},

	getTemplate : function(templateName){
		var entries = RepositoryController.get("templates");
		if(entries == null)
			return null;
		for(var i = 0; i < entries.length; i++){
			if(entries[i].get("templateName") == templateName)
				return entries[i].get("entry"); 
		}
		return null;
	},

	updateTemplate : function(templateName, template){
		if(templateName == null || template == null)
			return;
		var entries = RepositoryController.get("templates");
		for(var i = 0; i < entries.length; i++){
			if(entries[i].get("templateName") == templateName){
				entries[i].set("entry", template);
				return;
			} 
		}
		var hasEntry = RepositoryController.getTemplate(templateName);
		if(hasEntry != null)
			return;
		entries.pushObject(Ember.Object.create({
			templateName : templateName,
			entry : template
		}));
	}

});



