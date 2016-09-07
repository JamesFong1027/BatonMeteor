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
  }
});