Schemas = {};
ClassroomsInfo = new Mongo.Collection('classroomsInfo'); 
Schemas.classroomStatus={
	open: "Open",
	close:"Close"
}
// Future TODO, include course conception, it contains multi classroom
// The course own and manage by school, and could assign to teacher
// teacher running classroom under certain course
Schemas.ClassroomsInfo = new SimpleSchema({
	name:{
		type: String,
		label: "the unique name of classroom",
		optional: true
	},
	passcode:{
		type: Object,
		label: "the passcode object",
		optional: true,
		blackbox: true
	},
	'passcode.passcode': {
		type: String,
		optional: true
	},
	'passcode.isProtected': {
		type: Boolean,
		optional: true
	},
	description:{
		type: String,
		label: "the description of this classroom",
		optional: true
	},
	logo:{
		type: String,
		label: "the logo url",
		optional: true,
		autoValue: function(){
    		// console.log(this.field("lastUpdate").value);
    		if(this.isInsert&&null==this.value)
    		{
    			return "/classDefaultLogo.png";
    		}
    		else if(null!=this.value)
    			return this.value;
    		else
    			this.unset();
    	}
	},
	status:{
		type:String,
		label:"the status of classroom",
		optional:true,
		autoValue: function(){
    		// console.log(this.field("lastUpdate").value);
    		if(this.isInsert&&null==this.value)
    		{
    			return Schemas.classroomStatus.open;
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
	tid:{
		type:String,
		label:"teacher's id who create this classroom"
	},
	sid:{
		type:String,
		label:"school's id which running this class"
	},
});

ClassroomsInfo.attachSchema(Schemas.ClassroomsInfo);

ClassroomsInfo.allow({
	// only teacher can create classroom
	insert: function(userId, document){
		if(isTeacherAccount(userId))
		{
			// don't have pharmacy info yet
			return true;
		}
		return false;
	},
	// only the class owner teacher can update the class info
	update: function(userId, document){
		return userId === document.tid;
	}
});
