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
			title: TAPi18n.__("set_goal_popup_title"),
			template: TAPi18n.__("set_goal_popup_content"),
			okText: TAPi18n.__("popup_submit_button"),
			cancelText:TAPi18n.__("popup_cancel_button"),
			inputType: 'number',
			inputPlaceholder: TAPi18n.__("set_goal_popup_placeholder"),
			onOk: function(event, value) {
				AnalyticSpider.editClassAchievement(achievementId, value);
			}
		});
	},
	"click #view_history":function(event){
		var classroomId = Template.instance().data.cid;
		Router.go("classParticipationHistoryChart", {_id: classroomId});
	},
	"click #remove_target": function(event) {
		var achievementId = Template.instance().data._id;
		IonPopup.confirm({
			title: TAPi18n.__("delete_achievement_popup_title"),
			template: TAPi18n.__("delete_achievement_popup_content"),
			okText: TAPi18n.__("popup_confirm_button"),
			cancelText: TAPi18n.__("popup_cancel_button"),
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