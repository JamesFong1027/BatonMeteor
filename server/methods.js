// Meteor Method at server sides
Meteor.methods({
  setUserAsTeacher:function(userId){
    if(isAdminAccount(Meteor.userId()))
    {
      Meteor.users.update({_id:userId},{$set:{userType:Schemas.userType.teacher}})
    }
  },
  removeFistTimeFlag:function(){
    var updateFlagSync = Meteor.wrapAsync(Meteor.users.update, Meteor.users);
    var res = updateFlagSync({_id:Meteor.userId(),"profile.firstTimeLogin":true},{$set:{"profile.firstTimeLogin":false}});
    return res;
  },
  resetClassroom:function(classroomId){
    console.log(classroomId);
    if(isClassroomBlongTo(Meteor.userId(),classroomId))
    {
      console.log("teacher reset");
      TicketsInfo.update({cid:classroomId},{$set:{status:Schemas.ticketStatus.dismissed}});
    }
  },
  isEmailExist:function(email){
    return !!Meteor.users.findOne({"emails.address":email});
  },
  cancelTicket:function(ticketId){
    if(isTicketBelongTo(Meteor.userId(),ticketId)){
      return TicketsInfo.remove({_id:ticketId});  
    }
    return 0;
  },
  checkClassroomShortcode:function(shortCode){
    console.log(shortCode);
    return ClassroomsInfo.findOne({"shortcode.shortcode":shortCode});
  },
  getClassroomShortcode:function(classroomId){
    if(isClassroomBlongTo(Meteor.userId(),classroomId)){
      return ClassroomsInfo.findOne({_id:classroomId}).shortcode.shortcode;
    } else {
      return "";
    }
  },
  switchRole:function(userType){
    if(!_.contains([Schemas.userType.teacher, Schemas.userType.student],userType)) return false;
    Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.userType":userType}});
  },
  removeAchievement:function(achievementId){
    if(Achievement.findOne({_id:achievementId}).uid === Meteor.userId()){
      return Achievement.remove({_id:achievementId});
    }
    return 0;
  },
  updateUserDefaultLangCode:function(langCode){
    if(!!Meteor.user()){
      Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.defaultLangCode":langCode}});
    }
  },
  insertMessage: function(message) {
    message.owner = Meteor.userId();
    // message.timestamp = new Date();
    if (message.destination !== message.owner) {
      if (message.isDirect) {
        message.to = message.destination;
      } else {
        message.channel = message.destination;
      }
      delete message.destination;
      delete message.isDirect;
      Message.insert(message);
    }
  },
  markMsgAsRead:function(message){
    // only receiver can view
    if(message.to === Meteor.userId()){
      Message.update({_id:message._id},{$set:{isRead:true}});
      return true;
    } else {
      return false;
    }
  }
});