Template.classroomCode.onRendered(function(){
	Meteor.call("getClassroomShortcode", this.data.classroomId, function(err,res){
		var template = this;
		if(!err && res){
			console.log(res);
			template.$('#shortcode').text("Shortcode: " + res.toUpperCase());
		}
	});
	
});

Template.classroomCode.helpers({
  classroomsInfo:function(){
    return ClassroomKicker.getClassroomInfo(Template.instance().data.classroomId);
  },
  isShowShortcode:function(isProtected){
  	return isProtected && isTeacherAccount(Meteor.userId());
  }
});