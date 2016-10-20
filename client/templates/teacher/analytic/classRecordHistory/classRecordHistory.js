Template.classRecordHistory.onCreated(function() {

});

Template.classRecordHistory.onRendered(function() {
});

Template.classRecordHistory.helpers({
	"chartArg": function(chartName){
		var classroomId = Template.instance().data;

		var chartArg = {
			classroomId: classroomId,
			chartName: chartName
		}
		return chartArg;
	},
	"className" :function(){
		return ClassroomKicker.getClassroomInfo(Template.instance().data).name;
	},
	"squareArg" :function(){
		var classroomId = Template.instance().data;
		return {
			classroomId: classroomId,
			studentList: TicketShutter.getCurClassroomStudentList(classroomId, null)
		};
	}
});

Template.classRecordHistory.events({
});

Template.classRecordHistory.onDestroyed(function() {

});