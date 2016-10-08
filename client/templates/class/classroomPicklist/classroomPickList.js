Template.classroomPickList.onCreated(function(){
	console.log("in onCreated");
  var template = this;
  template.searchStr = new ReactiveVar("");
});

Template.classroomPickList.helpers({
  classrooms: function () {
    return AnalyticSpider.getUntrackedClassroomList();
  },
  getTeacherName:function(tid){
  	var teacherProfile = Meteor.users.findOne({_id:tid});
  	return teacherProfile.profile.lastName +", "+ teacherProfile.profile.firstName;
  },
  getImage:function(logoUrl){
  	return logoUrl===""?"/logo.png":logoUrl;
  }

});

Template.classroomPickList.events({
	"click .classroomItem":function(event){
    var classroomId = this.id;
    IonPopup.prompt({
      title: 'Setup goal',
      template: 'Please enter your weekly goal',
      okText: 'Submit',
      inputType: 'number',
      inputPlaceholder: 'Your goal in number',
      onOk: function(event, value){
        AnalyticSpider.addClassAchievement(classroomId,value);
        IonModal.close();
      }
    });
	},
  // "input #classSearch":function(event,template){
  //   console.log(event.target.value);
  //   var searchStr = event.target.value;
  //   template.searchStr.set(searchStr);
  // }
});