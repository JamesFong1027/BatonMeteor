Template.studentWork.onCreated(function() {
	var template = this;
	template.sender = new ReactiveVar(new TicketSenderPanel(template));
	template.curClassroomInfo = new ReactiveVar(null);
});

Template.studentWork.onRendered(function() {
	Session.set('ionTab.current', "studentWork");
	var template = this;
	template.curClassroomInfo.set(ClassroomKicker.checkCurrentClassBySessionType(Meteor.userId,Schemas.sessionType.attending));
	if(!!template.curClassroomInfo.get())
		Meteor.subscribe('ticketsInfoDetail', template.curClassroomInfo.get()._id);
});

Template.studentWork.helpers({
	"hasCurClassroom": function() {
		return !!Template.instance().curClassroomInfo.get();
	},
	classroom: function() {
		return Template.instance().curClassroomInfo.get();
	},
	"panelArg":function(){
		var template = Template.instance();
		return {
			classroomInfo: template.curClassroomInfo.get(),
			classMode: Schemas.ticketType.workTicket
		};
	}
});