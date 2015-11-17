Template.createClassroom.events({
  "submit .new-classroom": function (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    var classroomName = event.target.classroomName.value;

    // Insert a classroom into the collection
    var classroomId = ClassroomKicker.createClassroom(classroomName);

    if(classroomId){
      Session.set("curMode",Schemas.ticketType.talkTicket);
      Session.set("curClassroomId",classroomId)
      Router.go("teacherTalk");
    }

  },
});