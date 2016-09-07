Template.switchRole.onRendered(function(){
	console.log("kkk");
	this.$("#userType-Student").checked = isChecked(Schema.userType.student);
	this.$("#userType-Teacher").checked = isChecked(Schema.userType.teacher);
});

function isChecked(userType){
	return !!Meteor.user().profile && (Meteor.user().profile.userType == userType);
}