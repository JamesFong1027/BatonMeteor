Template.tabsLayout.rendered = function () {
  Session.set('currentTab', 'tabs.one');
};

Template.tabsLayout.helpers({
  isTeacher: function () {
    return isTeacherAccount(Meteor.userId());
  }
});
