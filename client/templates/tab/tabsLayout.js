Template.tabsLayout.rendered = function () {
  Session.set('currentTab', 'tabs.one');
  console.log("on rendered");
};

Template.tabsLayout.helpers({
  isTeacher: function () {
    return isTeacherAccount(Meteor.userId());
  }
});
