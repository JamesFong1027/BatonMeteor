SchoolsInfo = new Mongo.Collection('schoolsInfo'); 

Schemas.SchoolsInfo = new SimpleSchema({
	location:{
		type: Object,
		label: "geo location",
		optional: true,
		blackbox:true
	},
	address:{
		type: String,
		label: "address of School",
		optional: true
	},
	name:{
		type: String,
		label: "the name of school",
		optional: true
	},
	description:{
		type: String,
		label: "the description of this school",
		optional: true
	},
	logo:{
		type: String,
		label: "the logo url",
		optional: true
	},
});
SchoolsInfo.attachSchema(Schemas.SchoolsInfo);

SchoolsInfo.allow({
	// only the admin user can insert and update schools info
	// TODO need add a role access control feature in the future
	insert: function(userId, document){
		return isAdminAccount(userId);
	},
	update: function(userId, document){
		return isAdminAccount(userId);
	}
});
