Template.teacherMenu.onCreated(function(){
	console.log("in onCreated");
});


Template.teacherMenu.helpers({
  
});

Template.teacherMenu.events({
	"click #close_class": function(event){
		ClassroomKicker.closeClassroom(Session.get("curClassroomId"));
		Session.set("curClassroomId",undefined);
		// back to home page, create another classroom
		Router.go("home");
	},
	"click #reset_class":function(event){
		ClassroomKicker.resetClassroom(Session.get("curMode"),Session.get("curClassroomId"));
	},
	"click #class_info":function(){
		IonModal.open("classroomCode");
	},
	"click #class_record":function(){
		IonModal.open("classRecord");
	},
	"click #teacher_guides":function(event){
		IonModal.open("teacherGuides");
	},
	"click .popover-item":function(event){
		// remove the popover when click on each item
		IonPopover.hide();
	}
});