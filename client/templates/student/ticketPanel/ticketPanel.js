Template.ticketPanel.onCreated(function() {
	// console.log("ticketPanel onCreated");
	var template = this;
	template.sender = new ReactiveVar(new TicketSenderPanel(template));
});

Template.ticketPanel.onRendered(function() {
	// console.log(this.data);
	var template = this;
	if (!!!template.data.classroomInfo)
			return;
	template.sender.get().addClassroomWatcher(template.data.classMode, template.data.classroomInfo._id);
});

Template.ticketPanel.events({
	"click .menu_item.active": function(event,template) {
		// prevent multi click on the menu item
		if(document.getElementsByClassName("check_icon active").length !== 0) return;

		TicketShutter.sendTicket(template.data.classMode, event.currentTarget.id, template.data.classroomInfo._id);
	},
	"click .flipCircle-container.active": function(event, template) {
		if(!document.getElementById('menu-toggler').checked) return;
		if(document.getElementsByClassName("check_icon active").length !== 0) return;

		// console.log("click on back");
		$(".flipCircle-container.active .check_icon").toggleClass("active");
		Meteor.setTimeout(function(){
			document.getElementById('menu-toggler').checked = !document.getElementById('menu-toggler').checked;
			template.sender.get().togglePanel(!document.getElementById('menu-toggler').checked);
			Meteor.setTimeout(function(){
				$(".flipCircle-container.active .check_icon").toggleClass("active",false);
			}, 500);
		}, 1000);
	},
	"click #menu-toggler": function(event) {
		// console.log("click on menu toggler");
		$(".flipCircle-container").toggleClass('active',false);
		Template.instance().sender.get().togglePanel(!event.target.checked);
	},
	"click .menu-toggler-circle": function(event) {
		// console.log("click on menu toggler circle");
		$(".flipCircle-container").toggleClass('active',false);
		var curCheckStatus = document.getElementById('menu-toggler').checked;
		document.getElementById('menu-toggler').checked = !curCheckStatus;
		Template.instance().sender.get().togglePanel(curCheckStatus);
	},
	"click .flipCircle-container .front":function(event){
		if(!document.getElementById('menu-toggler').checked) return;

		// console.log("click on front");
		$(".flipCircle-container").toggleClass('active',false);
		$(event.currentTarget).closest(".flipCircle-container").toggleClass('active',true);
	}
});

Template.ticketPanel.helpers({
	"panelClass": function() {
		return isTalkMode(Template.instance()) ? "talk_panel" : "work_panel";
	},
	"menuArg":function(){
		var menuArg;
		if(isTalkMode(Template.instance())){
			menuArg = [
				{
					menuType:Schemas.talkTicketValue.buildOn,
					menuIconClass: "ion-android-contacts"
				},
				{
					menuType:Schemas.talkTicketValue.newIdea,
					menuIconClass: "ion-ios-lightbulb"
				},
				{
					menuType:Schemas.talkTicketValue.question,
					menuIconClass: "ion-help"
				},
				{
					menuType:Schemas.talkTicketValue.challenge,
					menuIconClass: "ion-alert"
				},
			];
		} else {
			menuArg = [
				{
					menuType:Schemas.workTicketValue.eight,
					menuValue:Schemas.workTicketValue.eight,
					menuStyle:"background: rgba(255,120,0, 0.7)",
				},
				{
					menuType:Schemas.workTicketValue.nine,
					menuValue:Schemas.workTicketValue.nine,
					menuStyle:"background: rgba(255,60,0, 0.8)",
				},
				{
					menuType:Schemas.workTicketValue.ten,
					menuValue:Schemas.workTicketValue.ten,
					menuStyle:"background: rgba(255,0,0, 0.9)",
				},
				{
					menuType:Schemas.workTicketValue.one,
					menuValue:Schemas.workTicketValue.one,
					menuStyle:"background: rgba(0,255,0, 0.2)",
				},
				{
					menuType:Schemas.workTicketValue.two,
					menuValue:Schemas.workTicketValue.two,
					menuStyle:"background: rgba(60,255,0, 0.3)",
				},
				{
					menuType:Schemas.workTicketValue.three,
					menuValue:Schemas.workTicketValue.three,
					menuStyle:"background: rgba(120,255,0, 0.4)",
				},
				{
					menuType:Schemas.workTicketValue.four,
					menuValue:Schemas.workTicketValue.four,
					menuStyle:"background: rgba(180,255,0, 0.5)",
				},
				{
					menuType:Schemas.workTicketValue.five,
					menuValue:Schemas.workTicketValue.five,
					menuStyle:"background: rgba(240,255,0, 0.6)",
				},
				{
					menuType:Schemas.workTicketValue.six,
					menuValue:Schemas.workTicketValue.six,
					menuStyle:"background: rgba(255,240,0, 0.6)",
				},
				{
					menuType:Schemas.workTicketValue.seven,
					menuValue:Schemas.workTicketValue.seven,
					menuStyle:"background: rgba(255,180,0, 0.6)",
				},
			];
		}

		return menuArg;
	}
});

Template.ticketPanel.onDestroyed(function() {
	this.sender.get().removeClassroomWatcher();
});

function isTalkMode(template){
	return !!Template.instance().data && Template.instance().data.classMode === Schemas.ticketType.talkTicket;
}