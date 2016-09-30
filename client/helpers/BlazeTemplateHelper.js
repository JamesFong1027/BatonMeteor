BlazeTemplateHelper = {
	fireWhenReady:function(fn, template, selector, interval){
	    var interval = interval || 1000,
	    targetExist = true;

	    BlazeTemplateHelper.runWhenViewReady(function(){
	    	(function p() {
		        targetNotExist = template.$(selector).length === 0;
		        if (targetNotExist)  { // ensures the function exucutes
		            setTimeout(p, interval);
		        } else{
		          fn(template);
		        }
		    })();	
	    },template);
	    
	},

	runWhenViewReady: function(fn, template){
		if(template.view.isRendered){
			fn();
		} else{
			template.view.onViewReady(function(){
				fn();
			});  
		}
	}

}