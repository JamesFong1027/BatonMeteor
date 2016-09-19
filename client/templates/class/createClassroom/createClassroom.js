Template.createClassroom.events({
  "submit .new_classroom": function (event) {
    console.log("createClassroom");
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    var classroomName = event.target.classroomName.value;

    var curClassroom = ClassroomKicker.getCurrentTeachingClassroom();
    if(!!curClassroom){
      var warnStr = "Close Current Classroom?";
      var warnCurClass = "There are one classroom opened already, do you want to <strong>close</strong> it?"
      IonPopup.confirm({
        title: warnStr,
        template: warnCurClass,
        onOk: function() {
          IonModal.close();
          ClassroomKicker.closeClassroom(curClassroom._id);
          createClassroom(classroomName);
        },
        onCancel: function() {
          console.log('Cancelled');
        }
      });
    } else {
      IonModal.close();
      createClassroom(classroomName);
    }
  },
});

function createClassroom(classroomName){
  // Insert a classroom into the collection
  var classroomId = ClassroomKicker.createClassroom(classroomName,"");

  if(classroomId){
    Session.set("curMode",Schemas.ticketType.talkTicket);
    Session.set("curClassroomId",classroomId);
    Router.go("teacherTalk");
  }
}