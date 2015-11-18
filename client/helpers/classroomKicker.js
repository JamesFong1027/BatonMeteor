// a classroom helper on the client side
ClassroomKicker={
	//for teacher create classroom
	createClassroom: function(classroomName){
		// the classroom name is unique within the school
		// and teacher can only have one open classroom at a time
		if(ClassroomsInfo.find({name:classroomName}).count()===0
			&&ClassroomKicker.getCurrentClassroom()===undefined)
		{
			//add a tickt to db
			var curId = ClassroomsInfo.insert({
				tid:Meteor.userId(),
				sid:"1",
				name:classroomName,
			});	
			return curId;
		}
		
		return false;

	},
	// for teacher to get their current teaching classroom
	getCurrentClassroom:function(){
		return ClassroomsInfo.findOne({
			tid:Meteor.userId(),
			sid:"1",
			status:Schemas.classroomStatus.open
		});
	},
	getClassroomInfo:function (classroomId) {
		return ClassroomsInfo.findOne({_id:classroomId});
	},
	// for teacher get their classroom history list
	getClassroomHistoryList:function(){
		return ClassroomsInfo.find({tid:Meteor.userId(),status:Schemas.classroomStatus.close});
	},
	// for teacher to get all the classroom they have created
	getClassroomList:function(){
		return ClassroomsInfo.find({tid:Meteor.userId()});
	},
	//for student to get all the opening classroom list
	getOpenClassroom:function(){
		return ClassroomsInfo.find({sid:"1",status:Schemas.classroomStatus.open});
	},
	// for teacher to reset the classrooom
	// put all waiting tickets into dismissed
	resetClassroom:function(classroomId){
		Meteor.call("resetClassroom",classroomId);
	},
	// for teacher to close the classroom
	// will set classroom status as close
	// and reset the classroom at the same time
	clossClassroom:function(classroomId){
		ClassroomsInfo.update({_id:classroomId},{$set:{status:Schemas.classroomStatus.close}});
		ClassroomKicker.resetClassroom(classroomId);
	},
	restartClassroom:function(classroomId){
		ClassroomsInfo.update({_id:classroomId},{$set:{status:Schemas.classroomStatus.open}});
	}

}