Template.classroomHistoryList.helpers({
  classrooms: function () {
    return ClassroomKicker.getClassroomHistoryList();
  }
});

Template.classroomHistoryList.events({
	"click .classroomItem":function(event, template){
	},
});