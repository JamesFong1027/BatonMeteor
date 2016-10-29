Template.teacherMenu.onCreated(function(){
	
});


Template.teacherMenu.helpers({
  
});

Template.teacherMenu.events({
	"click #close_class": function(event){
		ClassroomKicker.closeClassroom(Template.instance().data.classroomId);
		// back to home page, create another classroom
		Router.go("home");
	},
	"click #reset_class":function(event){
		ClassroomKicker.resetClassroom(Template.instance().data.classMode,Template.instance().data.classroomId);
	},
	"click #class_info":function(){
		IonModal.open("classroomCode", {classroomId: Template.instance().data.classroomId});
	},
	"click #class_record":function(){
		IonModal.open("classRecord", {classroomId: Template.instance().data.classroomId});
	},
	"click #teacher_guides":function(event){
		IonModal.open("teacherGuides");
	},
	"click .popover-item":function(event){
		// remove the popover when click on each item
		IonPopover.hide();
	}
});