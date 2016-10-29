// a classroom helper on the client side
ClassroomKicker={
	//for teacher create classroom
	createClassroom: function(classroomName,description){
		// the classroom name is unique within the school
		// and teacher can only have one open classroom at a time
		if(ClassroomsInfo.find({name:classroomName,sid:"1"}).count()===0
			&&!!!ClassroomKicker.getCurrentHostingClassroom())
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

			// start the first session
			ClassroomKicker.startClassSession(curId, Schemas.sessionType.hosting);
			
			return curId;
		}

		analytics.track("Create Classroom", {
			category: 'Teacher',
			label: '',
			value: 1
		});
		
		return false;

	},
	updateClassroom: function(classroomInfo){
		if(ClassroomsInfo.find({name:classroomInfo.name}).count()===0){
			// only update name for now
			ClassroomsInfo.update({_id: classroomInfo._id}, {
				$set: {
					name: classroomInfo.name
				}
			});
			return true;
		}

		return false;
	},
	getUserProfile:function(userId){
		var userObj = Meteor.users.findOne({_id:userId});
		if(!!userObj){
			return userObj.profile;
		} else {
			return null;
		}
	},
	getClassroomInfo:function (classroomId) {
		return ClassroomsInfo.findOne({_id:classroomId});
	},
	// for teacher get their classroom history list
	getClassroomHistoryList:function(searchStr){
		if(!!!searchStr) return ClassroomsInfo.find({tid:Meteor.userId(),status:Schemas.classroomStatus.close});

		searchStr = searchStr ? searchStr:"";
		// escape the search string
		searchStr = searchStr.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
		// default to match all the string
		searchStr = searchStr+".*";
		// case insensitive
		return ClassroomsInfo.find({tid:Meteor.userId(),status:Schemas.classroomStatus.close,"name":{$regex:searchStr, $options: "i"}});
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
		console.log("reset classroom:" + type + classroomId);
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
		ClassroomKicker.resetClassroom(Schemas.ticketType.talkTicket, classroomId);
		ClassroomKicker.resetClassroom(Schemas.ticketType.workTicket, classroomId);

		ClassroomsInfo.update({_id:classroomId},{$set:{status:Schemas.classroomStatus.close}});
		// close the current session and all the student session of this classroom
		ClassroomKicker.endAllClassSession(classroomId);
	},
	restartClassroom:function(classroomId){
		analytics.track("Restart Classroom", {
			category: "Teacher",
			label:"",
			value: 1
		});

		ClassroomsInfo.update({_id:classroomId},{$set:{status:Schemas.classroomStatus.open}});

		// start a new session
		ClassroomKicker.startClassSession(classroomId, Schemas.sessionType.hosting);
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
							ClassroomKicker.attendClass(classroom._id);
							Router.go("home");
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
	startClassSession: function(classroomId,sessionType) {
		if(!!ClassroomKicker.getCurrentClassSession(classroomId)) return;

		ClassSession.insert({
			uid: Meteor.userId(),
			cid: classroomId,
			sessionType: sessionType
		});

		if(sessionType === Schemas.sessionType.attending){
			// add default achievment (total sent ticket) for this classroom
			// AnalyticSpider.addClassAchievement(classroomId, 0);

			analytics.track("Attending class", {
				category: 'Student',
				label: 'start session',
				value: 1
			});
		} else {
			analytics.track("Hosting class", {
				category: 'Teacher',
				label: 'start session',
				value: 1
			});
		}
	},
	// [Work around] for historical data cleaning
	// end sessions if the class already closed or more than two session created
	cleanSessionByType:function(userId, sessionType){
		
		var attendedClassIdList = DBUtil.distinct(ClassSession, "cid", {
			uid: Meteor.userId(),
			sessionType: sessionType,
			status: Schemas.classSessionStatus.within
		}, {
			sessionStart: -1
		});
		for (var i = attendedClassIdList.length - 1; i >= 0; i--) {
			var classInfo = ClassroomKicker.getClassroomInfo(attendedClassIdList[i]);
			if(classInfo.status === Schemas.classroomStatus.close){
				ClassroomKicker.endClassSession(classInfo._id);
			} else {
				// remove redudent ones
				var sessionArray = ClassSession.find({
					uid: userId,
					cid: classInfo._id,
					sessionType: sessionType,
					status: Schemas.classSessionStatus.within
				}, {
					sessionStart: -1
				}).fetch();
				for (var j = sessionArray.length - 1; j > 0; j--) {
					ClassSession.update({_id:sessionArray[j]._id},{$set:{status:Schemas.classSessionStatus.end}});
				}
			}
		}
	},
	checkCurrentClassBySessionType:function(userId, sessionType){
		var curSession = ClassroomKicker.getCurrentClassSessionByType(sessionType);
		if(!!curSession){
			var curClassroom = ClassroomKicker.getClassroomInfo(curSession.cid);
			if(!!curClassroom){
				if(curClassroom.status === Schemas.classroomStatus.open){
					return curClassroom;
				} else {
					// if classroom already closed, end current session
					ClassroomKicker.endClassSession(curSession._id);
				}
			}
		}
		return null;
	},
	// for teacher to get their current teaching classroom
	getCurrentHostingClassroom:function(){
		var curSession = ClassroomKicker.getCurrentClassSessionByType(Schemas.sessionType.hosting);
		if(!!curSession){
			return ClassroomKicker.getClassroomInfo(curSession.cid);
		}
		return null;
	},
	// for student to get their current attending classroom
	getCurrentAttendingClassroom:function(){
		var curSession = ClassroomKicker.getCurrentClassSessionByType(Schemas.sessionType.attending);
		if(!!curSession){
			return ClassroomKicker.getClassroomInfo(curSession.cid);
		}
		return null;
	},
	// get current valid within session, end those session related class, which is closed
	getCurrentClassSessionByType:function(sessionType){
		return ClassSession.findOne({
			uid: Meteor.userId(),
			sessionType: sessionType,
			status: Schemas.classSessionStatus.within
		});
	},
	getCurrentClassSession:function(classroomId){
		return ClassSession.findOne({
			uid: Meteor.userId(),
			cid: classroomId,
			status: Schemas.classSessionStatus.within
		});	
	},
	// for teacher to end all the classroom related session
	endAllClassSession:function(classroomId){
		var sessionArray = ClassSession.find({cid:classroomId,status:Schemas.classSessionStatus.within}).fetch();
		for (var i = sessionArray.length - 1; i >= 0; i--) {
			ClassSession.update({_id:sessionArray[i]._id},{$set:{status:Schemas.classSessionStatus.end}});
		}
	},
	// for user to end their own session
	endClassSession:function(classroomId){
		var sessionArray = ClassSession.find({
			uid: Meteor.userId(),
			cid: classroomId,
			status: Schemas.classSessionStatus.within
		}).fetch();
		for (var i = sessionArray.length - 1; i >= 0; i--) {
			ClassSession.update({_id:sessionArray[i]._id},{$set:{status:Schemas.classSessionStatus.end}});
		}
	},
	getClassroomSessionList:function(classroomId, sessionType){
		return ClassSession.find({cid:classroomId,sessionType:sessionType});
	},
	getHostingSessionList:function(classroomId){
		return ClassroomKicker.getClassroomSessionList(classroomId,Schemas.sessionType.hosting);
	},
	getAttendingSessionList:function(classroomId){
		return ClassroomKicker.getClassroomSessionList(classroomId,Schemas.sessionType.attending);
	},
	getAttendedClassroomInfoList:function(classroomStatus, excludeClassroomIdList){
		var attendedClassIdList = DBUtil.distinct(ClassSession,"cid",{uid:Meteor.userId(),sessionType:Schemas.sessionType.attending},{sessionStart:-1});
		if(!!excludeClassroomIdList) {
			attendedClassIdList = _.difference(attendedClassIdList, excludeClassroomIdList);
		}
		if(!!classroomStatus){
			return ClassroomsInfo.find({_id:{$in:attendedClassIdList},status:classroomStatus});	
		} else {
			return ClassroomsInfo.find({_id:{$in:attendedClassIdList}},{sort:{status:-1}});
		}
	},
	// for student setup current attendant class id
	attendClass:function(classroomId){
		ClassroomKicker.startClassSession(classroomId, Schemas.sessionType.attending);
	},
	leaveClass:function(classroomId){
		// cancel all the ticket before leave the classroom
		var curTalkTicket = TicketShutter.getCurrentTicket(Schemas.ticketType.talkTicket, classroomId);
		if(!!curTalkTicket) TicketShutter.cancelTicket(curTalkTicket._id);
		var curWorkTicket = TicketShutter.getCurrentTicket(Schemas.ticketType.workTicket, classroomId);
		if(!!curWorkTicket) TicketShutter.cancelTicket(curWorkTicket._id);
		// end the current session
		ClassroomKicker.endClassSession(classroomId);
	},
	switchRole:function(switch2Type){
		if (switch2Type === Schemas.userType.student) {
			var curClassroom = ClassroomKicker.getCurrentHostingClassroom();
			if(!!curClassroom)
				ClassroomKicker.closeClassroom(curClassroom._id);
		} else {
			var curClassroom = ClassroomKicker.getCurrentAttendingClassroom();
			if (!!curClassroom) {
				ClassroomKicker.leaveClass(curClassroom._id);
			}
		}
		Meteor.call("switchRole", switch2Type);
	}
}