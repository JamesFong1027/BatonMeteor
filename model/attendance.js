Schemas = {};
Attendance = new Mongo.Collection('attendance');

Schemas.attendanceStatus={
	pending:   "Pending",
	attending: "Attending",
	dismissed: "Dismissed"
}

Schemas.Attendance = new SimpleSchema({
	uid:{
		type: String,
		label: "student id"
	},
	cid:{
		type: String,
		label: "class id"
	},
	status:{
		type: String,
		label: "the ticket status",
		autoValue: function(){
    		// console.log(this.field("lastUpdate").value);
    		if(this.isInsert&&null==this.value)
    		{
    			return Schemas.attendanceStatus.attending;
    		}
    		else if(null!=this.value)
    			return this.value;
    		else
    			this.unset();
    	}
	},
	sessionStart:{
		type: Date,
		label: "the create time of this session",
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
	}
});
Attendance.attachSchema(Schemas.Attendance);

Attendance.allow({
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

Attendance.deny({  
  update: function (userId, docs, fields, modifier) {
    // can't change owners
    return _.contains(fields, 'uid');
  }
});
