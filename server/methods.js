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
  checkClassroomPasscode:function(classroomId, passCode){
    console.log(classroomId);
    console.log(passCode);
    return !!ClassroomsInfo.findOne({_id:classroomId, "passcode.passcode":passCode});
  },
  getClassroomPasscode:function(classroomId){
    if(isClassroomBlongTo(Meteor.userId(),classroomId)){
      return ClassroomsInfo.findOne({_id:classroomId}).passcode.passcode;
    } else {
      return "";
    }
  }
});