Template.classEntry.events({
	"click #pickClassroom":function(event){
		event.preventDefault();
		Router.go("classroomPickList");
	},
});