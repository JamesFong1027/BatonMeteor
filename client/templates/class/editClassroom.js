Template.editClassroom.onRendered(function(){
  this.$(".errorMsg").hide();
});

Template.editClassroom.events({
  "submit .edit_classroom": function (event) {
    console.log("editClassroom");
    // Prevent default browser form submit
    event.preventDefault();

    // update classroom
    var classroomInfo = ClassroomKicker.getClassroomInfo(Template.instance().data);
    classroomInfo.name = event.target.classroomName.value;
    if(ClassroomKicker.updateClassroom(classroomInfo)){
      IonModal.close();
    } else {
      Template.instance().$(".errorMsg").show();
    }
  },
});

Template.editClassroom.helpers({
  "classroomInfo":function(){
    return ClassroomKicker.getClassroomInfo(Template.instance().data);
  }
});
