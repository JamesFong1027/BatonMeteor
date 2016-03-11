// check if user is adminAccount user, only be used at server sides
isAdminAccount = function(userId) {
	// hard code the admin account for now
	// need to implement access control and system role
	// console.log(Meteor.userId()=="cm76QqBRjHf3woNny");
	return Meteor.userId()=="cm76QqBRjHf3woNny";
}

isTeacherAccount = function(userId){
	var userObj = Meteor.users.findOne({_id:userId});
	if(typeof userObj !== 'undefined')
		return userObj.profile.userType === "Teacher";
	else
		return false;
}

isStudentAccount = function(userId){
	var userObj = Meteor.users.findOne({_id:userId});
	if(typeof userObj !== 'undefined')
		return userObj.profile.userType === "Student";
	else
		return false;
}

// get user's school id
getSchoolId = function(userId){
	return Meteor.users.findOne({_id:userId}).profile.sid;
}

// if the class belongs to the teacher
isClassroomBlongTo = function(userId,classroomId){
	if(isTeacherAccount(userId))
		return ClassroomsInfo.findOne({_id:classroomId}).tid===userId;
}

// To check if the current student account own this ticket
isTicketBelongTo = function(userId,ticketId){
	var uid = TicketsInfo.findOne({_id:ticketId}).uid;

	return userId === uid;
}

// Push.allow({
//     send: function(userId, notification) {
//       // Allow all users to send to everybody - For test only!
//       return true;
//     }
//   });