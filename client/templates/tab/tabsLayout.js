Template.tabsLayout.onRendered(function () {
  console.log("on rendered");
  // if(!Blaze._globalHelpers.isIOS()){
  // 	this.$(".content").addClass("has-tabs-top");
  // }
  
});

Template.tabsLayout.helpers({
  isTeacher: function () {
    return isTeacherAccount(Meteor.userId());
  }
});
