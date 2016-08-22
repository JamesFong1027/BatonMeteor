Template.classroomCode.onRendered(function(){
	Meteor.call("getClassroomPasscode", Session.get("curClassroomId"), function(err,res){
		var template = this;
		if(!err && res){
			console.log(res);
			template.$('#passcode').text("Passcode:" + res);
		}
	});
	
});

Template.classroomCode.helpers({
  classroomsInfo:function(){
    return ClassroomKicker.getClassroomInfo(Session.get("curClassroomId"));
  },
  isShowPasscode:function(isProtected){
  	return isProtected && isTeacherAccount(Meteor.userId());
  }
});