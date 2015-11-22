Template.teacherMenu.helpers({
  
});

Template.teacherMenu.events({
	"click #close_class": function(){
		ClassroomKicker.closeClassroom(Session.get("curClassroomId"));
		Session.set("curClassroomId",undefined);
		// back to home page, create another classroom
		Router.go("home");
	},
	// "click #class_info": function(event, template) {
	// 	IonPopup.show({
	// 		title: 'Classroom Info',
	// 		template: Template.classroomCode,
	// 		buttons: [{
	// 			text: 'Close me',
	// 			type: 'button-positive',
	// 			onTap: function() {
	// 				IonPopup.close();
	// 			}
	// 		}]
	// 	});
	// },
});