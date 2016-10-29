ClassSession = new Mongo.Collection('classSession');

Schemas.classSessionStatus={
	pending:   	"Pending",
	within: 	"Within",
	end: 		"End"
}

Schemas.sessionType={
	hosting:   		"Hosting",
	attending : 	"Attending"
}

Schemas.ClassSession = new SimpleSchema({
	uid:{
		type: String,
		label: "user id"
	},
	cid:{
		type: String,
		label: "class id"
	},
	sessionType:{
		type: String,
		label: "Hosting or attending"
	},
	status: {
		type: String,
		label: "the session status",
		autoValue: function() {
			// console.log(this.field("lastUpdate").value);
			if (this.isInsert) {
				if(null == this.value)
					return Schemas.classSessionStatus.within;
				else
					return this.value;	
			}
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
		label: "the time this session updated",
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
	},
});
ClassSession.attachSchema(Schemas.ClassSession);

ClassSession.allow({
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

ClassSession.deny({  
  update: function (userId, docs, fields, modifier) {
    // can't change owner id, classroom id and session type
    return _.intersection(fields, ['uid','cid','sessionType']).length !== 0;
  },
  insert: function(userId, document){
  	// should not insert a new "within" session when there already have one in the same classroom and same type
  	// also prevent create session which is "end"
  	return !!ClassSession.findOne({
  		uid:userId,
  		sessionType:document.sessionType,
  		cid: document.cid,
  		status: document.status
  	});
  }
});
