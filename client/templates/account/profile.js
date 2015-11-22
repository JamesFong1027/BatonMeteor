Template.profile.rendered = function() {
    var profile = this.data;
    
    Session.set("userProfile",profile);
};


Template.profile.helpers({
  userProfile:function(){
    return Session.get("userProfile");
  },
  historyClassroomCount:function(){
  	return ClassroomKicker.getClassroomHistoryList().length;
  },
});

Template.profile.events({
	"click #logout":function(event){
		console.log("logout");
		AccountsTemplates.logout();
	},
});