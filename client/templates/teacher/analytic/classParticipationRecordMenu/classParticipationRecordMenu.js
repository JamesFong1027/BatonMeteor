Template.classParticipationRecordMenu.onCreated(function(){
	console.log("in onCreated");
});


Template.classParticipationRecordMenu.helpers({

});

Template.classParticipationRecordMenu.events({
	"click #view_history":function(event){
		var classroomId = Template.instance().data._id;
		Router.go("classRecordHistory", {_id: classroomId});
	},
	// "click #remove_target":function(event){
	// 	var achievementId = Template.instance().data._id;
	//     IonPopup.confirm({
	//       title: "Untrack this class",
	//       template: 'Are you sure to stop tracking this class?',
	//       okText: 'Confirm',
	//       onOk: function() {
	//       	// console.log();
	//         // AnalyticSpider.removeClassAchievement(achievementId);
	//       }
	//     });
	// },
	"click .popover-item":function(event){
		// remove the popover when click on each item
		IonPopover.hide();
	}
});