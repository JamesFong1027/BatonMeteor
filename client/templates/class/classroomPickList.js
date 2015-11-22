Template.classroomPickList.helpers({
  classrooms: function () {
    return ClassroomKicker.getOpenClassroom();
  },

});

Template.classroomPickList.events({
	"click .classroomItem":function(event){
		console.log(event);
	}
});

