Template.studentTab.onRendered(function () {
  console.log("on rendered");
});

Template.studentTab.helpers({
	studentTalkPath:function(){
		return "studentTalk";
	},
	studentWorkPath:function(){
		return "studentWork";
	}
});

Template.studentTab.events({

});