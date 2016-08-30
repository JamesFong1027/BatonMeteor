// a classroom helper on the client side
ClassroomKicker={
	//for teacher create classroom
	createClassroom: function(classroomName,description){
		// the classroom name is unique within the school
		// and teacher can only have one open classroom at a time
		if(ClassroomsInfo.find({name:classroomName}).count()===0
			&&ClassroomKicker.getCurrentTeachingClassroom()===undefined)
		{
			// generate shortcode
			var shortcode = "";
			while(shortcode.length!=5){
				shortcode = (Math.random()+1).toString(36).substr(2, 5);	
			}
			// TODO check the shortcode redudancy

			//add a classroom record to db
			var shortcodeObj = {"shortcode":shortcode,"isProtected":!!shortcode&&shortcode!==""};
			console.log(shortcodeObj);
			var curId = ClassroomsInfo.insert({
				tid:Meteor.userId(),
				sid:"1",
				name:classroomName,
				description:description,
				shortcode:shortcodeObj
			});	
			return curId;

			// start the first session
			this.startClassSession(curId);
		}

		analytics.track("Create Classroom", {
			category: 'Teacher',
			label: '',
			value: 1
		});
		
		return false;

	},
	// for teacher to get their current teaching classroom
	getCurrentTeachingClassroom:function(){
		return ClassroomsInfo.findOne({
			tid:Meteor.userId(),
			sid:"1",
			status:Schemas.classroomStatus.open
		});
	},
	getCurrentAttendingClassroom:function(){
		if(!!Meteor.user().profile && !!Meteor.user().profile.curClassId){
			return this.getClassroomInfo(Meteor.user().profile.curClassId);
		}
		
		return null;
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

		// start the first session
		this.endClassSession(classroomId);
	},
	restartClassroom:function(classroomId){
		analytics.track("Restart Classroom", {
			category: "Teacher",
			label:"",
			value: 1
		});

		ClassroomsInfo.update({_id:classroomId},{$set:{status:Schemas.classroomStatus.open}});

		// start a new session
		this.startClassSession(classroomId);
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
					// using pollfunc to prevent previous modal not closed
					(function(modalName) {
							TicketShutter.pollFunc(function() {
									console.log(IonModal.views.length);
									if (IonModal.views.length == 0) {
										IonModal.open(modalName);
										return true;
									}
							}, 5 * 1000, 1000);
					})(guideTemplateName);
				}
			});
		}
	},
	requestClassroomShortcode:function(){
		IonPopup.show({
	        title: 'Enter ShortCode',
	        subTitle: "Ignore upper or lower case",
	        template: '<input type="text" placeholder="ShortCode" name="shortcode" maxlength="5" >',
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
	            var input = $(template.firstNode).find('[name=shortcode]');
	            var shortcode = input.val();

				Meteor.call("checkClassroomShortcode", shortcode.toLowerCase(), function(err, classroom) {
					var errMsg = "";
					if (classroom) {
						// if shortcode match, close both Modal and Popup
						if (classroom.status !== Schemas.classroomStatus.open) {
							errMsg = "Classroom is closed";
						} else {
							// go to classroom
							IonPopup.close();
							TicketShutter.attendClass(classroom._id);
							Router.go("studentTalkWithParam", {_id: classroom._id});
							return;	
						}
						
					} else {
						console.log("don't match");
						errMsg = "Shortcode not exist, try again";
					}

					// show error message
					if (!input.hasClass()) {
						input.addClass("circle self");
					}
					input.val("");
					input.attr("placeholder", errMsg);
				});
	          }
	        }]
	    });
	},
	startClassSession: function(classroomId) {
		ClassSession.insert({
			uid: Meteor.userId(),
			cid: classroomId
		});

		analytics.track("Start Session", {
			category: 'Teacher',
			label: '',
			value: 1
		});
	},
	getCurrentClassSession:function(classroomId){
		return ClassSession.findOne({
			uid: Meteor.userId(),
			cid: classroomId,
			status: Schemas.classSessionStatus.within
		});	
	},
	endClassSession:function(classroomId){
		var curSession = this.getCurrentClassSession(classroomId);
		if(!!curSession){
			ClassSession.update({_id:curSession._id},{$set:{status:Schemas.classSessionStatus.end}});
		}
	}
}