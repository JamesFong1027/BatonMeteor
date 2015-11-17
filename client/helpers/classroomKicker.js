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
	// for student get their current waiting ticket
	getCurrentClassroom:function(){
		return ClassroomsInfo.findOne({
			tid:Meteor.userId(),
			sid:"1",
			status:Schemas.classroomStatus.open
		});
	},
	// for student get their classroom buddy
	getClassroomHistoryList:function(){
		return ClassroomsInfo.find({tid:Meteor.userId(),status:Schemas.classroomStatus.close});
	},
	getClassroomList:function(){
		return ClassroomsInfo.find({tid:Meteor.userId()});
	},
	//for student to get all the opening classroom list
	getOpenClassroom:function(){
		return ClassroomsInfo.find({sid:"1",status:Schemas.classroomStatus.open});
	},

}