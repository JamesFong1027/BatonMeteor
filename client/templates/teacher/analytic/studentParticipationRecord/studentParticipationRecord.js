Template.studentParticipationRecord.onCreated(function() {

});

Template.studentParticipationRecord.onRendered(function() {
	var studentId = this.data.studentId;
	var classroomId = this.data.classroomId;

	var studentProfile = ClassroomKicker.getUserProfile(studentId);
	var classroomInfo = ClassroomKicker.getClassroomInfo(classroomId);
	// update the title
	this.$(".title").text(
		TAPi18n.__("student_in_class_title",{student:studentProfile.firstName,"class":classroomInfo.name})
	);

});

Template.studentParticipationRecord.helpers({
	"chartArg": function(chartName){
		var studentId = Template.instance().data.studentId;
		var classroomId = Template.instance().data.classroomId;

		var chartArg = {
			studentId: studentId,
			classroomId: classroomId,
			chartName: chartName
		}
		return chartArg;
	},
	"summaryInfo":function(){
		// console.log(AnalyticSpider.fetchSummaryAchievement(Template.instance().data.studentId));
		return AnalyticSpider.fetchSummaryAchievement(Template.instance().data.studentId);
	}
});

Template.studentParticipationRecord.events({
});

Template.studentParticipationRecord.onDestroyed(function() {

});