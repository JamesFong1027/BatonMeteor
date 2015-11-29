Template.teacherMenu.helpers({
  
});

Template.teacherMenu.events({
	"click #close_class": function(event){
		ClassroomKicker.closeClassroom(Session.get("curClassroomId"));
		Session.set("curClassroomId",undefined);
		// back to home page, create another classroom
		Router.go("home");
		event.target.parentNode.remove();
	},
	"click #reset_class":function(event){
		ClassroomKicker.resetClassroom(Session.get("curMode"),Session.get("curClassroomId"));
		event.target.parentNode.remove();
	}
});