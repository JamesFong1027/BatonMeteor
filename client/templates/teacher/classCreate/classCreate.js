Template.classCreate.events({
	"click #pickFromHistory":function(event){
		event.preventDefault();
		Router.go("classroomHistoryList");
	},
});