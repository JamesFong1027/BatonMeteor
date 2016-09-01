Template.classroomCode.onRendered(function(){
	Meteor.call("getClassroomShortcode", Session.get("curClassroomId"), function(err,res){
		var template = this;
		if(!err && res){
			console.log(res);
			template.$('#shortcode').text("Shortcode: " + res.toUpperCase());
		}
	});
	
});

Template.classroomCode.helpers({
  classroomsInfo:function(){
    return ClassroomKicker.getClassroomInfo(Session.get("curClassroomId"));
  },
  isShowShortcode:function(isProtected){
  	return isProtected && isTeacherAccount(Meteor.userId());
  }
});