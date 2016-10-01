Template.classAchievementMenu.onCreated(function(){
	console.log("in onCreated");
});


Template.classAchievementMenu.helpers({

});

Template.classAchievementMenu.events({
	"click #change_goal": function(event){
		console.log(Template.instance().data);
		var achievementId = Template.instance().data;
	    IonPopup.prompt({
	      title: 'Edit goal',
	      template: 'Please enter your goal',
	      okText: 'Submit',
	      inputType: 'number',
	      inputPlaceholder: 'Your goal in number',
	      onOk: function(event, value){
	        ClassroomKicker.editClassAchievement(achievementId,value);
	      }
	    });
	},
	"click #view_history":function(event){

	},
	"click #remove_target":function(event){
		var achievementId = Template.instance().data;
	    IonPopup.confirm({
	      title: "Delete achievement",
	      template: 'Are you sure to remove this achievement?',
	      okText: 'Confirm',
	      onOk: function() {
	      	console.log();
	        ClassroomKicker.removeClassAchievement(achievementId);
	      }
	    });
	},
	"click .popover-item":function(event){
		// remove the popover when click on each item
		IonPopover.hide();
	}
});