// a ticket send helper on the client side
TicketShutter={
	//for student sent their ticket
	sendTicket: function(type,purpose,classroomId){
		//every student only have one waiting ticket at a time
		//TODO need make the currentTicket as a reactvar and keep within the class
		var currentTicket = TicketShutter.getCurrentTicket(type,classroomId);
		console.log(classroomId);
		if( currentTicket === undefined)
		{
			//add a tickt to db
			var curId = TicketsInfo.insert({
				uid:Meteor.userId(),
				cid:classroomId,
				ticketType:type,
				ticketContent:purpose,
			});	
			currentTicket = TicketsInfo.findOne({_id:curId});
			console.log("insert a ticket");
		}
		else
		{
			// update the current ticket
			console.log(purpose);
			TicketsInfo.update({_id:currentTicket._id},{$set:{ticketContent:purpose}});
			console.log("update a ticket");
		}
		return currentTicket;
	},
	//Simple version by using session var
	sendTicketAuto:function(purpose){
		return TicketShutter.sendTicket(Session.get("curMode"),purpose,Session.get("curClassroomId"));
	},
	// for student get their current waiting ticket
	getCurrentTicket:function(type,classroomId){
		return TicketsInfo.findOne({
			uid:Meteor.userId(),
			ticketType:type,
			cid:classroomId,
			status:Schemas.ticketStatus.waiting
		});
	},
	// for student get their classroom buddy
	getClassroomBuddyList:function(type,classroomId){
		return TicketsInfo.find({cid:classroomId,ticketType:type,status:Schemas.ticketStatus.waiting});
	},
	// for teacher get their classroom ticketlist
	getClassroomTicketList:function(type,classroomId){
		var ticketArray = TicketsInfo.find({cid:classroomId,ticketType:type,status:Schemas.ticketStatus.waiting}).fetch();
		
    	console.log(ticketArray);
    	for (var i = ticketArray.length - 1; i >= 0; i--) {
    		//put user profile into ticket info
			ticketArray[i].user = Meteor.users.findOne({_id:ticketArray[i].uid});
			//put student participation info into user
			var attendTimes = TicketsInfo.find({cid:classroomId,ticketType:type,uid:ticketArray[i].uid}).count();
			var selectedTimes = TicketsInfo.find({cid:classroomId,ticketType:type,uid:ticketArray[i].uid,ticketStatus:Schemas.ticketStatus.selected}).count();
			ticketArray[i].user.participation = new Object();
			ticketArray[i].user.participation.attendTimes = attendTimes;
			ticketArray[i].user.participation.selectedTimes = selectedTimes;
		}

		return ticketArray;
	},


}