Template.classroomHistoryList.helpers({
  classrooms: function () {
    return ClassroomKicker.getClassroomHistoryList();
  }
});

Template.classroomHistoryList.events({
	"click .classroomItem":function(event, template){
		var warnStr = "Restart a new session of this classrooom?";
		var warnCurClass = "There are one classroom opened already, do you want to <strong>close</strong> it?"
		var curClassroom = ClassroomKicker.getCurrentTeachingClassroom();
		if(!curClassroom)
		{
			warnCurClass = "Press OK to restart this classroom";	
		}
		console.log("click classroomItem");
		IonPopup.confirm({
	      title: warnStr,
	      template: warnCurClass,
	      onOk: function() {
	        console.log('Confirmed');
	        var curClassroom = ClassroomKicker.getCurrentTeachingClassroom();
	        if(curClassroom!==undefined)
	        	ClassroomKicker.closeClassroom(curClassroom._id);
	        ClassroomKicker.restartClassroom(event.currentTarget.id);
			Session.set("curClassroomId",event.currentTarget.id);
			Session.set("curMode",Schemas.ticketType.talkTicket);
			Router.go("teacherTalk");
			// Router.go("teacherTalkWithParam", {_id: event.currentTarget.id}, {});
	      },
	      onCancel: function() {
	        console.log('Cancelled');
	        
	      }
	    });
	},
});