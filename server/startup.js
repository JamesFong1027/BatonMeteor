
Meteor.startup(function () {
	// scheduleReminder(new Date(Date.now()+1*60*1000));
	// BrowserPolicy.content.allowOriginForAll("http://meteor.local");
	WebApp.connectHandlers.use(function(req, res, next) {
	  res.setHeader("Access-Control-Allow-Origin", "*");
	  return next();
	});
});
