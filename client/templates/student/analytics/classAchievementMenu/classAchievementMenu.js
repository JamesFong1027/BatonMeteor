Template.classAchievementMenu.onCreated(function(){
	console.log("in onCreated");
});


Template.classAchievementMenu.helpers({

});

Template.classAchievementMenu.events({
	"click #change_goal": function(event){
		console.log(Template.instance().data);
		var achievementId = Template.instance().data._id;
	    IonPopup.prompt({
	      title: 'Edit goal',
	      template: 'Please enter your goal',
	      okText: 'Submit',
	      inputType: 'number',
	      inputPlaceholder: 'Your goal in number',
	      onOk: function(event, value){
	        AnalyticSpider.editClassAchievement(achievementId,value);
	      }
	    });
	},
	"click #view_history":function(event){
		var classroomId = Template.instance().data.cid;
		Router.go("classParticipationHistoryChart", {_id: classroomId});
	},
	"click #remove_target":function(event){
		var achievementId = Template.instance().data._id;
	    IonPopup.confirm({
	      title: "Delete achievement",
	      template: 'Are you sure to remove this achievement?',
	      okText: 'Confirm',
	      onOk: function() {
	      	console.log();
	        AnalyticSpider.removeClassAchievement(achievementId);
	      }
	    });
	},
	"click .popover-item":function(event){
		// remove the popover when click on each item
		IonPopover.hide();
	}
});