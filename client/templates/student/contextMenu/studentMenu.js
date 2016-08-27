Template.studentMenu.onCreated(function(){
	console.log("in onCreated");
});


Template.studentMenu.helpers({

});

Template.studentMenu.events({
	"click #leave_class": function(event){
		Session.set("curClassroomId",undefined);
		Session.set("curMode",undefined);
		TicketShutter.leaveClass();
		//back to home page, create another classroom
		Router.go("studentTalk");
	},
	"click #cancel_request":function(event){
		var curTicket = TicketShutter.getCurrentTicket(Session.get("curMode"),Session.get("curClassroomId"));
		if(curTicket){
			var warnTitle = "Cancel your request ?";
			IonPopup.confirm({
		      title: warnTitle,
		      onOk: function() {
		      		TicketShutter.cancelTicket(curTicket._id);	
		      }
		    });
		} else {
			var warnTitle = "No request yet !";
			IonPopup.alert({title:warnTitle});
		}
	},
	"click #class_info":function(){
		IonModal.open("classroomCode");
	},
	"click #class_record":function(){

	},
	"click #guides":function(){
		IonModal.open("studentGuides");
	},
	"click .popover-item":function(event){
		// remove the popover when click on each item
		IonPopover.hide();
	}
});