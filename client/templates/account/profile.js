Template.profile.onRendered(function() {
  console.log("in profile onRendered");
  Session.set('ionTab.current', "profile");
});

Template.profile.helpers({
  userProfile:function(){
    return !!Meteor.user() ? Meteor.user().profile : null;
  },
  historyClassroomCount:function(){
  	return ClassroomKicker.getClassroomHistoryList().fetch().length;
  },
  isTeacher: function () {
    return isTeacherAccount(Meteor.userId());
  }
});

Template.profile.events({
	"click #logout":function(event){
		console.log("logout");
		AccountsTemplates.logout();
	},
  "click #switchRole":function(event){
    var teacherMsg = "Are you sure? Will close current open classroom!";
    var studentMsg = "Are you sure? Will exit current attending classroom!";
    var oppositUserType = Meteor.user().profile.userType === Schemas.userType.student ? Schemas.userType.teacher : Schemas.userType.student;
    IonPopup.show({
        title: 'Switch to ' + oppositUserType,
        subTitle: Meteor.user().profile.userType === Schemas.userType.student ? studentMsg : teacherMsg,
        buttons: [
        {
          text: 'Cancel',
          type: 'button-default',
          onTap: function (event, template) {
            return true;
          }
        },
        {
          text: 'Confirm',
          type: 'button-positive',
          onTap: function (event, template) {
            ClassroomKicker.switchRole(oppositUserType);
            return true;
          }
        }]
    });
    // IonPopup.show({
    //     title: 'Switch account role',
    //     // template: '<label class="at-input item item-radio item-text-wrap"><input id="at-field-userType-choice-Student" type="radio" name="at-field-userType" value="Student"><div class="item-content">Student</div><i class="radio-icon ion-checkmark"></i></label><label class="at-input item item-radio item-text-wrap"><input id="at-field-userType-choice-Teacher" type="radio" name="at-field-userType" value="Teacher"><div class="item-content">Teacher</div><i class="radio-icon ion-checkmark"></i></label>',
    //     templateName: 'switchRole',
    //     buttons: [
    //     {
    //       text: 'Cancel',
    //       type: 'button-default',
    //       onTap: function (event, template) {
    //         return true;
    //       }
    //     },
    //     {
    //       text: 'Confirm',
    //       type: 'button-positive',
    //       onTap: function (event, template) {
    //         var userType = $(template.firstNode).find('input[type=radio]:checked').val();
    //         console.log(userType);
    //         if(userType !== Meteor.user().profile.userType){
    //           if(userType === Schema.userType.Student && !!ClassroomKicker.getCurrentAttendingClassroom()){

    //           }
    //         }

    //         // var input = $(template.firstNode).find('[name=shortcode]');
    //       }
    //     }]
    // });
    
  },
});