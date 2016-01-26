Meteor.publish('classroomsInfo',function(){
	return ClassroomsInfo.find({sid:"1"});
});

// Meteor.publish('schoolsInfo',function(){
// 	return SchoolsInfo.find();
// });

// Meteor.publish('ticketsInfo',function(){
// 	if(isPharmacyAccount(this.userId))
// 		return OrdersInfo.find({ pid: getPharmacyStoreId(this.userId) });
// 	else
// 		return OrdersInfo.find({ uid: this.userId });
// });

// with extra users profile info
Meteor.publishComposite('ticketsInfoDetail',function(classroomId) { 
	return {

		find:function(){
			//TODO need restrict the publish permission
			console.log(classroomId);
			return TicketsInfo.find({cid:classroomId});
		},
		children:[
			{
				find: function(ticketsInfo){
					return Meteor.users.find({_id: ticketsInfo.uid}, {fields: {'profile': 1}});
					
				}
			}
		]
	}
});

Meteor.publish("userProfile", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId});
  } else {
    this.ready();
  }
});