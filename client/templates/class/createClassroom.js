Template.createClassroom.events({
  "submit .new_classroom": function (event) {
    console.log("createClassroom");
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    var classroomName = event.target.classroomName.value;
    var passcode = event.target.passcode.value;
    console.log(passcode);
    // Insert a classroom into the collection
    var classroomId = ClassroomKicker.createClassroom(classroomName,"",passcode);

    if(classroomId){
      Session.set("curMode",Schemas.ticketType.talkTicket);
      Session.set("curClassroomId",classroomId);
      Router.go("teacherTalk");
    }

  },
});