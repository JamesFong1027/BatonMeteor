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
    
    var curClassroom = ClassroomKicker.getCurrentHostingClassroom();
    var warnStr = TAPi18n.__("start_class_popup_header");
    var warnCurClass = TAPi18n.__("start_class_popup_alert_cur_class", {context: String(!!curClassroom)});
   
    console.log("click classroomItem");
    IonPopup.show({
      title: warnStr,
      template: warnCurClass,
      buttons: [
      {
        text: TAPi18n.__("popup_cancel_button"),
        type: 'button-default',
        onTap: function (event, template) {
          return true;
        }
      },
      {
        text: TAPi18n.__("popup_confirm_button"),
        type: 'button-positive',
        onTap: function (event, template) {
          console.log('Confirmed');
          var curClassroom = ClassroomKicker.getCurrentHostingClassroom();
          if (!!curClassroom)
            ClassroomKicker.closeClassroom(curClassroom._id);
          ClassroomKicker.restartClassroom(classroomId);
          Router.go("teacherTalk");
        }
      }]
    });
  },
})

Template.classroomDetail.onDestroyed(function(){
	// console.log("onDestroyed");
	// console.log(Template.instance());
	// Template.instance().qrScanner.stopCapture();
});



