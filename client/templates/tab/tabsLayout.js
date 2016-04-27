Template.tabsLayout.rendered = function () {
  Session.set('currentTab', 'tabs.one');
  console.log("on rendered");
  // if(!Blaze._globalHelpers.isIOS()){
  // 	this.$(".content").addClass("has-tabs-top");
  // }
};

Template.tabsLayout.helpers({
  isTeacher: function () {
    return isTeacherAccount(Meteor.userId());
  }
});
