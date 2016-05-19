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
    Session.set("curClassroomId",Template.instance().data);
    Router.go('studentTalk');
  },
})

Template.scanResult.onDestroyed(function(){
	// console.log("onDestroyed");
	// console.log(Template.instance());
	// Template.instance().qrScanner.stopCapture();
});



