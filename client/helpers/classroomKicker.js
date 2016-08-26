// a classroom helper on the client side
ClassroomKicker={
	//for teacher create classroom
	createClassroom: function(classroomName,description,passcode){
		// the classroom name is unique within the school
		// and teacher can only have one open classroom at a time
		if(ClassroomsInfo.find({name:classroomName}).count()===0
			&&ClassroomKicker.getCurrentClassroom()===undefined)
		{
			//add a tickt to db
			var passcodeObj = {"passcode":passcode,"isProtected":!!passcode&&passcode!==""};
			console.log(passcodeObj);
			var curId = ClassroomsInfo.insert({
				tid:Meteor.userId(),
				sid:"1",
				name:classroomName,
				description:description,
				passcode:passcodeObj
			});	
			return curId;
		}

		analytics.track("Create Classroom", {
			category: 'Teacher',
			label: '',
			value: 1
		});
		
		return false;

	},
	// for teacher to get their current teaching classroom
	getCurrentClassroom:function(){
		return ClassroomsInfo.findOne({
			tid:Meteor.userId(),
			sid:"1",
			status:Schemas.classroomStatus.open
		});
	},
	getClassroomInfo:function (classroomId) {
		return ClassroomsInfo.findOne({_id:classroomId});
	},
	// for teacher get their classroom history list
	getClassroomHistoryList:function(){
		return ClassroomsInfo.find({tid:Meteor.userId(),status:Schemas.classroomStatus.close});
	},
	// for teacher to get all the classroom they have created
	getClassroomList:function(){
		return ClassroomsInfo.find({tid:Meteor.userId()});
	},
	//for student to get all the opening classroom list
	getOpenClassroom:function(searchStr){
		// var classroomInfoList = ClassroomsInfo.find({sid:"1",status:Schemas.classroomStatus.open}).fetch();
		// for (var i = classroomInfoList.length - 1; i >= 0; i--) {
  //   		//find teacher profile by tid
		// 	ticketArray[i].user = Meteor.users.findOne({_id:classroomInfoList[i].tid});
		// 	//put teacher profile info into classroom info 
		// 	classroomInfoList[i].teacher.participation = new Object();
		// 	ticketArray[i].user.participation.attendTimes = attendTimes;
		// 	ticketArray[i].user.participation.selectedTimes = selectedTimes;
		// }
		searchStr = searchStr ? searchStr:"";
		// escape the search string
		searchStr = searchStr.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
		// default to match all the string
		searchStr = searchStr+".*";
		// case insensitive
		return ClassroomsInfo.find({sid:"1",status:Schemas.classroomStatus.open,"name":{$regex:searchStr, $options: "i"}});
	},
	// for teacher to reset the classrooom
	// put all waiting tickets into dismissed
	resetClassroom:function(type,classroomId){
		// Meteor.call("resetClassroom",classroomId);
		analytics.track("Reset Classroom", {
			category: "Teacher",
			label: type,
			value: 1
		});

		_.each(TicketShutter.getClassroomTicketList(type,classroomId),
			function(element, index, list){
				TicketsInfo.update({_id:element._id},{$set:{status:Schemas.ticketStatus.dismissed}});
			}
		)
	},
	// for teacher to close the classroom
	// will set classroom status as close
	// and reset the classroom at the same time
	closeClassroom:function(classroomId){
		ClassroomsInfo.update({_id:classroomId},{$set:{status:Schemas.classroomStatus.close}});
		ClassroomKicker.resetClassroom(classroomId);
	},
	restartClassroom:function(classroomId){
		analytics.track("Restart Classroom", {
			category: "Teacher",
			label:"",
			value: 1
		});
		ClassroomsInfo.update({_id:classroomId},{$set:{status:Schemas.classroomStatus.open}});
	},
	showFirstTimeGuide:function(){
		// show first time user guide
		if(Meteor.user().profile.firstTimeLogin){
			Meteor.call("removeFistTimeFlag", function(err,result){
				if(!err && result){
					var guideTemplateName = "studentGuides";
					if(isTeacherAccount(Meteor.userId())){	
						guideTemplateName = "teacherGuides";
					}
					IonModal.open(guideTemplateName);
				}
			});
		}
	},
	requestClassroomPasscode:function(classId){
		IonPopup.show({
	        title: 'Passcode Required',
	        subTitle: "Please enter the passcode",
	        template: '<input type="text" placeholder="Passcode" name="passcode" >',
	        buttons: [
	        {
	          text: 'Cancel',
	          type: 'button-default',
	          onTap: function (event, template) {
	            return true;
	          }
	        },
	        {
	          text: 'Enter',
	          type: 'button-positive',
	          onTap: function (event, template) {
	            var input = $(template.firstNode).find('[name=passcode]');
	            var passcode = input.val();

	            Meteor.call("checkClassroomPasscode",classId,passcode, function(err,result){
	              if(result){
	                // if passcode match, close both Modal and Popup
	                IonModal.close();
	                IonPopup.close();
	                Router.go("studentTalkWithParam",{_id:classId});
	              } else {
	                console.log("don't match");
	                if(!input.hasClass()){
	                  input.addClass("circle self");
	                }
	                input.val("");
	                input.attr("placeholder","Passcode incorrect, try again");  
	              }
	            });
	              
	          }
	        }]
	    });
	}
}