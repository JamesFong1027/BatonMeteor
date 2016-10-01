// might be used in the future, for save student attendance records
Schemas = {};
Achievement = new Mongo.Collection('achievement');

Schemas.achievementStatus={
	unset:   "Unset",
	inProgress: "In Progress",
	Completed: "Completed"
}
Schemas.achievementType={
	totalSentTicket: 	"Total Sent Ticekt",
	acceptedTicket: 	"Accepted Ticekt"
}

Schemas.Achievement = new SimpleSchema({
	uid:{
		type: String,
		label: "user id"
	},
	cid:{
		type: String,
		label: "class id"
	},
	target:{
		type: SimpleSchema.Integer,
		label: "achievement target number",
		min: 0
	},
	achievementType:{
		type: String,
		label: "achievement type",
		autoValue: function(){
    		// console.log(this.field("lastUpdate").value);
    		if(this.isInsert&&null==this.value)
    		{
    			return Schemas.achievementType.totalSentTicket;
    		}
    		else if(null!=this.value)
    			return this.value;
    		else
    			this.unset();
    	}
	},
	createDate:{
		type: Date,
		label: "the create time of this achievement",
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
		label: "the time this achievement updated",
		autoValue: function(){
    		// console.log(this.field("lastUpdate").value);
    		if(this.isInsert&&null==this.value)
    		{
    			return new Date();
    		}
    		else if(this.isUpdate&&null==this.value)
    			return new Date();
    		else if(null!=this.value)
    			return this.value;
    		else
    			this.unset();
    	}
	}
});
Achievement.attachSchema(Schemas.Achievement);

Achievement.allow({
	// can only insert ticket on your behavour
	insert: function(userId, document){return userId===document.uid;},
	// only the ticket owner or teacher can update the ticket
	update: function(userId, document,fields, modifier)
	{
		return userId===document.uid||isClassroomBlongTo(userId,document.cid);
	},
	// can only remove your own documents
	remove: function (userId, doc) {
		return doc.uid === userId;
	}
});

Achievement.deny({  
  update: function (userId, docs, fields, modifier) {
    // can't change owners
    return _.contains(fields, 'uid');
  }
});
