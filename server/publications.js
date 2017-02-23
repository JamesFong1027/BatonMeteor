Meteor.publishComposite('classroomsInfo',function(){
	return {
		find:function(){
			// if(isTeacherAccount(this.userId)){
			// 	return ClassroomsInfo.find({sid:"1"});
			// } else {
			// 	return ClassroomsInfo.find({sid:"1"},{fields: {'shortcode.shortcode':0}});	
			// }
			return ClassroomsInfo.find({sid:"1"},{fields: {'shortcode.shortcode':0}});
		},
		children:[
			{
				find:function(classroomsInfo){
					// return teacher profile
					return Meteor.users.find({_id:classroomsInfo.tid},{fields:{'profile': 1}});
				}
			},
			{
				// publicate all the related class session
				find:function(classroomsInfo){
					// if this classroom belongs to the user(teacher), will return all the related classSession
					if(isClassroomBlongTo(this.userId,classroomsInfo._id)){
						return ClassSession.find({cid:classroomsInfo._id});
					}
				},
				children:[
					{
						// given this class belongs to user(teacher), will return all the attending student profile
						find:function(classSession){
							return Meteor.users.find({_id:classSession.uid},{fields:{'profile': 1}});
						},
						children: [
							{
								// also publicate all the achievement goals related to that student
								find:function(userProfile){
									return Achievement.find({uid:userProfile._id});
								}
							}
						]
					}
				]
			},
			{
				// publicate student participation history ticket to the owner of this classroom
				find:function(classroomsInfo){
					// if this classroom belongs to the user(teacher), will return all the related participation tickets
					if(isClassroomBlongTo(this.userId,classroomsInfo._id)){
						return TicketsInfo.find({cid:classroomsInfo._id});
					}
				}
			},
		]	
	}
});

Meteor.publish("classSession",function(){
	return ClassSession.find({uid:this.userId});
});

Meteor.publish("achievement",function(classroomId){
	return Achievement.find({uid:this.userId});
});

Meteor.publish("ticketsInfo",function(){
	return TicketsInfo.find({uid:this.userId});
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
			// console.log("ticketsInfoDetail:",classroomId);
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

Meteor.publish( 'channel', function( isDirect, channel ) {
  if(!!!isDirect || !!!channel) return;
  check( isDirect, Boolean );
  check( channel, String );

  if ( isDirect ) {
    var toUserId = channel;
    return Message.find({
      $or: [ { owner: this.userId, to: toUserId }, { owner: toUserId, to: this.userId } ]
    });
  } else {
    var selectedChannel = Channels.findOne( { name: channel } );
    return Message.find( { channel: selectedChannel._id } );
  }
});

Meteor.publishComposite('msgListing', function() {
	return {
		find:function(){
			return Message.find({ $or: [{ owner: this.userId }, { to: this.userId }] });
		},
		children:[
			{
				find:function(message){
					return Meteor.users.find({_id: message.owner}, {fields: {'profile': 1}});
				}
			}
		]

	}
});

Meteor.publishComposite('feedbackAdminListing', function() {
	if(isSysAdminAccount(this.userId)){
		return {
			find:function(){
				return Message.find({ $or: [{ owner: GlobalVar.feedbackAdminID }, { to: GlobalVar.feedbackAdminID }] });
			},
			children:[
				{
					find: function(message){
						return Meteor.users.find({_id: message.owner}, {fields: {'profile': 1, 'emails':1}});
					}
				}
			]
		}
	}
});

Meteor.publish('issue', function() {
	if(isSysAdminAccount(this.userId)) {
		return Issue.find();
	}
});


