Template.scanResult.onCreated(function(){
});

Template.scanResult.helpers({
  classroomInfo: function () {
    return ClassroomKicker.getClassroomInfo(Template.instance().data);
  },
  getTeacherName:function(tid){
    var teacherProfile = Meteor.users.findOne({_id:tid});
    return teacherProfile.profile.lastName +", "+ teacherProfile.profile.firstName;
  },
  getImage:function(logoUrl){
    return logoUrl===""?"/logo.png":logoUrl;
  }
});

Template.scanResult.events({
  "click #selectClassroom":function(){
    event.preventDefault();
    IonModal.close("scanResult");
    var classroomId = Template.instance().data;
    TicketShutter.attendClass(classroomId);
    Session.set("curClassroomId",classroomId);
    Router.go('studentTalk');

    // for now we keep it simple, if user have qr code, then no shortcode required
    // ClassroomKicker.requestClassroomShortcode(Template.instance().data);
  },
})

Template.scanResult.onDestroyed(function(){
	// console.log("onDestroyed");
	// console.log(Template.instance());
	// Template.instance().qrScanner.stopCapture();
});



