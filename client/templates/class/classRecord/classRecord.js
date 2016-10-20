Template.classRecord.onCreated(function(){
  	var template = this;
	template.SessionMode = new ReactiveVar(true);
});

Template.classRecord.onRendered(function(){
});


Template.classRecord.helpers({
	"modalTitle":function(){
		return Template.instance().SessionMode ? "Current session" : "Whole class";
	},
	"args": function () {
		return {
			chartName: "Student List",
			classroomId: Session.get("curClassroomId"),
			studentList: TicketShutter.getCurClassroomStudentList(Session.get("curClassroomId"), Template.instance().SessionMode.get() ? ClassroomKicker.getCurrentClassSession(Session.get("curClassroomId")) : null)
		};
	},
});

Template.classRecord.events({
	"click .viewToggle":function(event){
		Template.instance().SessionMode.set(!event.target.checked);
	}
})