
Meteor.startup(function () {
	// BrowserPolicy.content.allowOriginForAll("http://meteor.local");
	// WebApp.connectHandlers.use(function(req, res, next) {
	// 	console.log("in connectHandlers");
	//   res.setHeader("Access-Control-Allow-Origin", "*");
	//   return next();
	// });
	// on client sides startup code
	GoogleMaps.load({ v: '3', key: 'AIzaSyAuyEhHtZbrxCuAOEkIw-R25914sOPbpqs', libraries: 'geometry,places' });
	// GoogleMaps.load();
	AutoForm.setDefaultTemplate('ionic');
	
	Meteor.subscribe('classroomsInfo');
	Meteor.subscribe('schoolsInfo');
	Tracker.autorun(function () {
		if(Session.get("curClassroomId")&&Session.get("curMode")){
			console.log("start subscribe ticketsInfoDetail");
			Meteor.subscribe("ticketsInfoDetail", Session.get("curClassroomId"),Session.get("curMode"));		
			Meteor.subscribe('userProfile');
		}
	});
	// Meteor.subscribe("ticketsInfoDetail", Session.get("curClassroom"),Session.get("CurMode"));		
	// Meteor.subscribe('userProfile');
	//push notification setup
	Push.addListener('message', function(notification) {
		// Called on every message
		// console.log(JSON.stringify(notification))

		LocalNotifHelper.fireAlert();
		
	});
	// Push.addListener('token', function(token) {
	// 	console.log("save token to device");
 //      if (token.apn) {
 //        var tokenObj = Object.create(null);
 //        tokenObj.token = token.apn;
 //        tokenObj.tokenType = "apn";
 //        Meteor.call("someMethod", tokenObj);
 //      }
 //      else if (token.gcm) {
 //        var tokenObj = Object.create(null);
 //        tokenObj.token = token.gcm;
 //        tokenObj.tokenType = "gcm";
 //        Meteor.call("someMethod", tokenObj);
 //      }
 //    });

	//start schedule pickup reminder
	// initialReminder();

	
	Template.registerHelper('formatDate', function(date) {
	  if(undefined===date)
	    return "Not Ready";
	  return moment(date).format('hh:mm MMM-DD');
	});
});


