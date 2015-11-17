Template.classroomPickList.helpers({
  classrooms: function () {
    return ClassroomKicker.getOpenClassroom();
  }
});

Template.registerHelper('formatDate', function(date) {
  if(undefined===date)
    return "Not Ready";
  return moment(date).format('hh:mm MMM-DD');
});
