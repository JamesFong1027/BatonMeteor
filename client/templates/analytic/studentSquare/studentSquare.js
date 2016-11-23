Template.studentSquare.onCreated(function(){
	if(!!!this.data.chartName) this.data.chartName = TAPi18n.__("participation_student_list_title");
});

Template.studentSquare.onRendered(function(){
});


Template.studentSquare.helpers({
	"userRecords": function () {
		console.log(Template.instance().data.studentList.length);
		return Template.instance().data.studentList;
	},
	"isTalkTicket":function(ticketInfo){
		return !!ticketInfo && ticketInfo.ticketType === Schemas.ticketType.talkTicket;
	},
	"chartName": function() {
		return Template.instance().data.chartName;
	}
});

Template.studentSquare.events({
	"click .ticketSquare":function(event,template){
		// IonModal.close();
		console.log(this._id, template.data.classroomId);
		IonModal.open("studentParticipationRecord",{studentId:this._id, classroomId: template.data.classroomId});
	}
});