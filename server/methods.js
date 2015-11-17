// Meteor Method at server sides
S3.config = {
	    key: 'AKIAIAOQ5OMKYX3GI2RA',
	    secret: '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',
	    bucket: 'swiftpad.padimg',
	    region : 'us-west-2'
	};
Meteor.methods({
	// get patient's profile
	// only pharmacy able to access
  getPatientProfile: function (uid) {
    if (!isPharmacyAccount(Meteor.userId())) {
      throw new Meteor.Error("not-authorized, only pharmacy can access patient profile");
    }
    console.log(Meteor.users.findOne({_id:uid}));
 	// return Meteor.users.findOne({_id:uid},{fields:{"profile.address":1, "profile.firstName": 1, "profile.lastName": 1}});
 	return Meteor.users.findOne({_id:uid});
  },
  acceptOrder:function(orderId){
  	if (!isOrderBelongToPha(Meteor.userId(),orderId)) {
      throw new Meteor.Error("not-authorized, only the owner pharmacy can accept order");
    }
    
    // update the orderinfo, change the status, and a probabaly pickup date, 15 minutes later
    OrdersInfo.update({_id:orderId},{
    	$set :{status:Schemas.orderStatus.progress,readyDate:new Date(Date.now()+15*60000)}
    });
    // Then send a notification to the patient, notify the order accepted
    PushHelper.sendNotification("Your order has been accepted","Order Accept",OrdersInfo.uid);
  },
  confirmPickup:function(orderId){
  	if (!isOrderBelongToPha(Meteor.userId(),orderId)) {
      throw new Meteor.Error("not-authorized, only the owner pharmacy can confirm pickup");
    }
    console.log(Schemas.orderStatus.ready);
    OrdersInfo.update({_id:orderId},{
    	$set :{status:Schemas.orderStatus.ready, readyDate: new Date()}
    });
    // Then send a notification to the patient, notify the order ready to pickup
    PushHelper.sendNotification("Your order is ready to pickup","Ready Pickup",OrdersInfo.uid);
  },
  setUserAsTeacher:function(userId){
    if(isAdminAccount(Meteor.userId()))
    {
      Meteor.users.update({_id:userId},{$set:{userType:Schemas.userType.teacher}})
    }
  }
});