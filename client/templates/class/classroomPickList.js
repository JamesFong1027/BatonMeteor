Template.classroomPickList.onCreated(function(){
	console.log("in onCreated");
});

Template.classroomPickList.helpers({
  classrooms: function () {
    return ClassroomKicker.getOpenClassroom();
  },
  getTeacherName:function(tid){
  	var teacherProfile = Meteor.users.findOne({_id:tid});
  	return teacherProfile.profile.lastName +", "+ teacherProfile.profile.firstName;
  },
  getImage:function(logoUrl){
  	return logoUrl===""?"/logo.png":logoUrl;
  }

});

Template.classroomPickList.events({
	"click .classroomItem":function(event){
		console.log(event);
	}
});

