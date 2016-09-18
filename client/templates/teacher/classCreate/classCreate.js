Template.classCreate.onCreated(function(){
	console.log("in onCreated");
	var template = this;
	template.searchStr = new ReactiveVar("");
});

Template.classCreate.events({
	"click #pickFromHistory":function(event){
		event.preventDefault();
		Router.go("classroomHistoryList");
	},
	"input #classSearch":function(event,template){
		console.log(event.target.value);
		var searchStr = event.target.value;
		template.searchStr.set(searchStr);
	}
});

Template.classCreate.helpers({
  classrooms: function () {
    return ClassroomKicker.getClassroomHistoryList(Template.instance().searchStr.get());
  }
});