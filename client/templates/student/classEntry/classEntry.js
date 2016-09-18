Template.classEntry.onCreated(function(){
	var template = this;
	template.ListMode = new ReactiveVar(true);
});

Template.classEntry.events({
	"submit .shortCodeForm":function(event){
		event.preventDefault();
		console.log(event);
		var input = $(event.target.shortCode);
		var shortcode = input.val();

		Meteor.call("checkClassroomShortcode", shortcode.toLowerCase(), function(err, classroom) {
			var errMsg = "";
			if (classroom) {
				// if shortcode match, close both Modal and Popup
				if (classroom.status !== Schemas.classroomStatus.open) {
					errMsg = "Classroom is closed";
				} else {
					// go to classroom
					ClassroomKicker.attendClass(classroom._id);
					Router.go("home");
					return;	
				}
			} else {
				console.log("don't match");
				errMsg = "Shortcode not exist, try again";
			}

			// show error message
			$("#shortCodeInputWrapper").addClass("circle self");
			input.val("");
			input.attr("placeholder", errMsg);
		});
	},
	"click .classroomItem":function(event){
	    if(this.classStatus === Schemas.classroomStatus.open){
	      IonModal.close();
	      ClassroomKicker.attendClass(this.id);
	      Router.go("home");
	    } else {
	      IonPopup.alert({
	        title: 'Classroom is closed',
	        template: 'Please wait until the classroom is re-opened.',
	        okText: 'Got It'
	      });
	    }
    
	},
	"click .listToggle":function(event){
		Template.instance().ListMode.set(!event.target.checked);
	}
});

Template.classEntry.helpers({
  attendedClasses: function () {
		return ClassroomKicker.getAttendedClassroomInfoList(Template.instance().ListMode.get() ? Schemas.classroomStatus.open : null);
  },
  getTeacherName:function(tid){
    var teacherProfile = Meteor.users.findOne({_id:tid});
    return teacherProfile.profile.lastName +", "+ teacherProfile.profile.firstName;
  },
  getImage:function(logoUrl){
    return logoUrl===""?"/logo.png":logoUrl;
  },
});
