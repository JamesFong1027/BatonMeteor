Template.studentMenu.onCreated(function(){
	console.log("in onCreated");
});


Template.studentMenu.helpers({

});

Template.studentMenu.events({
	"click #leave_class": function(event){
		ClassroomKicker.leaveClass(this.classroomId);
 
		//back to home page
		Router.go("home");
	},
	"click #cancel_request":function(event){
		var curTicket = TicketShutter.getCurrentTicket(Template.instance().data.classMode,Template.instance().data.classroomId);
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
		IonModal.open("classroomCode", this);
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