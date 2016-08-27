Template.classEntry.events({
	"click #shortCode":function(event){
		event.preventDefault();
		ClassroomKicker.requestClassroomShortcode();
	},
	"click #pickClassroom":function(event){
		event.preventDefault();
		IonModal.open("classroomPickList");
	},
	"click #scanQRCode":function(event){
		event.preventDefault();
		if (Meteor.isCordova) {
			console.log("isCordova use cordova barcodeScanner");
			cordova.plugins.barcodeScanner.scan(
		      function (result) {
		          // alert("We got a barcode\n" +
		          //       "Result: " + result.text + "\n" +
		          //       "Format: " + result.format + "\n" +
		          //       "Cancelled: " + result.cancelled);
		          // Session.set("curClassroomId",result.text);
		          // Router.go('studentTalk');
		          if(result.cancelled==0) {
		          	IonModal.open("scanResult", result.text);
		          }
		      }, 
		      function (error) {
		          alert("Scanning failed: " + error);
		      },
		      {
		          "preferFrontCamera" : false, // iOS and Android 
		          "showFlipCameraButton" : true, // iOS and Android 
		          "prompt" : "Place a barcode inside the scan area", // supported on Android only 
		          "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED 
		          "orientation" : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device 
		      }
		   );
		} else{
			console.log("not Cordova, use qrScanner");
			IonModal.open("scanResult","JZ5nPxptnDEhoEvPH");
		}
	},
});