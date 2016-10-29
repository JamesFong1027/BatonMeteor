Template.createClassroom.onRendered(function(){
  this.$(".errorMsg").hide();
  $("#createClassroom").prop("disabled", true);
});


Template.createClassroom.events({
  "submit .new_classroom": function (event) {
    console.log("createClassroom");
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    var classroomName = event.target.classroomName.value;

    var curClassroom = ClassroomKicker.getCurrentHostingClassroom();
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
  "keyup [name=classroomName]":function(event){
    console.log(event.target.value);
    if(event.target.value.trim()===""){
      $("#createClassroom").prop("disabled", true);
      $(".errorMsg").hide();
      return;
    }
    
    var classroomName = "^" + event.target.value.trim() + "$";
    if(ClassroomsInfo.find({name:{$regex: classroomName,$options: "i"},sid:"1"}).count()===0){
      $("#createClassroom").prop("disabled", false);
      $(".errorMsg").hide();
    } else {
      $("#createClassroom").prop("disabled", true);
      $(".errorMsg").show();
    }
  }
});

function createClassroom(classroomName){
  // Insert a classroom into the collection
  var classroomId = ClassroomKicker.createClassroom(classroomName,"");

  if(classroomId){
    Router.go("teacherTalk");
  }
}