Template.mainLayout.onRendered(function () {
});

Template.mainLayout.events({
  "click #editClass":function(){
    console.log("editClass");
    IonModal.open("editClassroom",Template.instance().data);
  }
});
