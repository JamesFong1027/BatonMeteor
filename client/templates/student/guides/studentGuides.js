Template.studentGuides.onCreated(function(){
	// track the times user open guides
	analytics.track("Open Guides", {
		category:Schemas.userType.student,
		label: "",
		value: 1
	});
});

Template.studentGuides.onRendered(function(){
	this.$('.ion-slide').css("padding-top","0px");
});

Template.studentGuides.events({
	"onSlideChanged":function(event,template){
		if(event.index === 2){
			template.$("#dismiss_button").text("Done");
			template.$("#dismiss_button").css("color","#4FFF33");
		} else {
			template.$("#dismiss_button").text("Skip");
			template.$("#dismiss_button").css("color","#db5a3c");
		}
	}
});
