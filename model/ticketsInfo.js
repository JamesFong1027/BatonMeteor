TicketsInfo = new Mongo.Collection('ticketsInfo'); 

Schemas.talkTicketValue={
    newIdea:     "New Idea",
    challenge:   "Challenge",
    buildOn:     "Build On",
    question:    "Question",
    general:     "General"
},
Schemas.workTicketValue={
    one:     	"1",
    two: 		"2",
    three:     	"3",
    four:    	"4",
    five:     	"5",
    six:    	"6",
    seven:    	"7",
    eight:    	"8",
    nine:    	"9",
    ten: 		"10"
},
Schemas.ticketStatus={
	pending:   "Pending",
	waiting:   "Waiting",
	selected:  "Selected",
	dismissed: "Dismissed"
}
Schemas.ticketType={
	talkTicket:"Talk Ticket",
	workTicket:"Work Ticket"
}
Schemas.TicketsInfo = new SimpleSchema({
	uid:{
		type: String,
		label: "User id"
	},
	cid:{
		type: String,
		label: "class id"
	},
	ticketType:{
		type: String,
	},
	ticketContent:{
		type: String,
		autoValue: function(){
    		// console.log(this.field("lastUpdate").value);
    		if(this.isInsert&&null==this.value)
    		{
    			return Schemas.talkTicketValue.newIdea;
    		}
    		else if(null!=this.value)
    			return this.value;
    		else
    			this.unset();
    	}
	},
	status:{
		type: String,
		label: "the ticket status",
		autoValue: function(){
    		// console.log(this.field("lastUpdate").value);
    		if(this.isInsert&&null==this.value)
    		{
    			return Schemas.ticketStatus.waiting;
    		}
    		else if(null!=this.value)
    			return this.value;
    		else
    			this.unset();
    	}
	},
	createDate:{
		type: Date,
		label: "the create time of this order",
		autoValue: function(){
    		// console.log(this.field("lastUpdate").value);
    		if(this.isInsert&&null==this.value)
    		{
    			return new Date();
    		}
    		else if(null!=this.value)
    			return this.value;
    		else
    			this.unset();
    	}
	},
	updateDate:{
		type: Date,
		label: "the time this ticket updated",
		autoValue: function(){
    		// console.log(this.field("lastUpdate").value);
    		if(this.isInsert&&null==this.value)
    		{
    			return new Date();
    		}
    		else if(null!=this.value)
    			return this.value;
    		else
    			this.unset();
    	}
	},
	user:{
		type: Schemas.User,
		label: "User object for display",
		optional: true,
		blackbox:true
	}
});
TicketsInfo.attachSchema(Schemas.TicketsInfo);

TicketsInfo.allow({
	// can only insert ticket on your behavour
	insert: function(userId, document){return userId===document.uid;},
	// only the ticket owner or teacher can update the ticket
	update: function(userId, document,fields, modifier)
	{
		return userId===document.uid||isClassroomBlongTo(userId,document.cid);
	},
	// can only remove your own documents
	remove: function (userId, doc) {
		return doc.userId === userId;
	}
});

TicketsInfo.deny({  
  update: function (userId, docs, fields, modifier) {
    // can't change owners
    return _.contains(fields, 'uid');
  }
});

