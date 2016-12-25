Template.dataTitleBar.onCreated(function() {
	
});

Template.dataTitleBar.onRendered(function() {
	console.log(Template.instance().data);
});

Template.dataTitleBar.helpers({
	"selectedTimes": function() {
		return Template.instance().data.selectedTimes;
	},
	"attendTimes": function(){
		return Template.instance().data.attendTimes;
	},
	"target":function(){
		return Template.instance().data.target;	
	}
});