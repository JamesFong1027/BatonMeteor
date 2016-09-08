Template.classroomDetail.onCreated(function(){
});

Template.classroomDetail.helpers({
  classroomInfo: function () {
    return ClassroomKicker.getClassroomInfo(Template.instance().data);
  },
  getTeacherName:function(tid){
    var teacherProfile = Meteor.users.findOne({_id:tid});
    return teacherProfile.profile.lastName +", "+ teacherProfile.profile.firstName;
  },
  getImage:function(logoUrl){
    return logoUrl===""?"/logo.png":logoUrl;
  },
  classroomSession:function(){
    return ClassroomKicker.getHostingSessionList(Template.instance().data);
  },
  sessionNumber:function(index){
    return index+1;
  },
  totalNumber:function(){
    return ClassroomKicker.getHostingSessionList(Template.instance().data).fetch().length;
  }
});

Template.classroomDetail.events({
  "click #selectClassroom":function(){
    event.preventDefault();
    var classroomId = Template.instance().data;
    
    var warnStr = "Restart a new session of this classrooom?";
    var warnCurClass = "There are one classroom opened already, do you want to <strong>close</strong> it?"
    var curClassroom = ClassroomKicker.getCurrentTeachingClassroom();
    if (!curClassroom) {
      warnCurClass = "Press OK to restart this classroom";
    }
    console.log("click classroomItem");
    IonPopup.confirm({
      title: warnStr,
      template: warnCurClass,
      onOk: function() {
        console.log('Confirmed');
        var curClassroom = ClassroomKicker.getCurrentTeachingClassroom();
        if (curClassroom !== undefined)
          ClassroomKicker.closeClassroom(curClassroom._id);
        ClassroomKicker.restartClassroom(classroomId);
        Session.set("curClassroomId", classroomId);
        Session.set("curMode", Schemas.ticketType.talkTicket);
        Router.go("teacherTalk");
      },
      onCancel: function() {
        console.log('Cancelled');
      }
    });
  },
})

Template.classroomDetail.onDestroyed(function(){
	// console.log("onDestroyed");
	// console.log(Template.instance());
	// Template.instance().qrScanner.stopCapture();
});



