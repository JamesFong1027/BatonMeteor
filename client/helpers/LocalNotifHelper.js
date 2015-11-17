LocalNotifHelper = {
	
	scheduleReminder : function(readyDate){
		console.log(readyDate);
		// assume all the ready date are at the same month
		var sched = later.parse.recur().on(readyDate.getUTCDate()).dayOfMonth().and().on(readyDate.getHours()).hour().and().on(readyDate.getMinutes()).minute();
		var timer = later.setTimeout(fireAlert, sched);
	},

	initialReminder : function(){
		//get all the ready order
		var ordersInfo = OrdersInfo.find({status:Schemas.orderStatus.ready}).fetch();
		for (var i = ordersInfo.length - 1; i >= 0; i--) {
			var readyDate = ordersInfo[i].readyDate
			// only schedule the reminder when it's after the current time
			if(readyDate>(new Date()))
				scheduleReminder(readyDate);

		};
	},

	fireAlert : function(){
		console.log("blablablablabla");
	}
}