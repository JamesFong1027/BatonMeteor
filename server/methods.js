// Meteor Method at server sides
S3.config = {
	    key: 'AKIAIAOQ5OMKYX3GI2RA',
	    secret: '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',
	    bucket: 'swiftpad.padimg',
	    region : 'us-west-2'
	};
Meteor.methods({
  setUserAsTeacher:function(userId){
    if(isAdminAccount(Meteor.userId()))
    {
      Meteor.users.update({_id:userId},{$set:{userType:Schemas.userType.teacher}})
    }
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
  }
});