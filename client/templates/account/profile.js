Template.profile.onRendered(function() {
  console.log("in profile onRendered");
  Session.set('ionTab.current', "profile");
});

Template.profile.helpers({
  userProfile:function(){
    return !!Meteor.user() ? Meteor.user().profile : null;
  },
  historyClassroomCount:function(){
  	return ClassroomKicker.getClassroomHistoryList().fetch().length;
  },
  isTeacher: function () {
    return isTeacherAccount(Meteor.userId());
  }
});

Template.profile.events({
	"click #logout":function(event){
		console.log("logout");
		AccountsTemplates.logout();
	},
});