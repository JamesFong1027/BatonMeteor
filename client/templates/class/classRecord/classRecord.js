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
			chartName: "Participated Student List",
			classroomId: Template.instance().data.classroomId,
			studentList: TicketShutter.getCurClassroomStudentList(Template.instance().data.classroomId, Template.instance().SessionMode.get() ? ClassroomKicker.getCurrentClassSession(Template.instance().data.classroomId) : null)
		};
	},
});

Template.classRecord.events({
	"click .viewToggle":function(event){
		Template.instance().SessionMode.set(!event.target.checked);
	}
})