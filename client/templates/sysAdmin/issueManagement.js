Template.issueManagement.onCreated(function() {
	this.associateIssueID = new ReactiveVar(null);
	this.searchStr = new ReactiveVar("");
});

Template.issueManagement.onRendered(function() {
	if(!!this.data){
		var userId = this.data.userId;
		var userProfile = ClassroomKicker.getUserProfile(userId);
		// update the title
		this.$(".bar-header .title").text(
			TAPi18n.__("issue_management_page_title_for_user",{userName:userProfile.firstName + " " + userProfile.lastName})
		);	
	} else {
		this.$(".bar-header .title").text(
			TAPi18n.__("issue_management_page_title")
		);
	}
});

Template.issueManagement.events({
	'keydown .issueInput': function(event, template) {
		if(event.keyCode === 13){
			event.preventDefault();
			postIssue(event.currentTarget, this.userId);
		}
	},
	'input .issueInput':function(event,template){
		if(!!this.userId){
			$(".addIssue").toggleClass("disable-button",!!!event.currentTarget.value);
			$(".addIssue").toggleClass("button-positive",!!event.currentTarget.value);	
		}
	},
	'click .addIssue':function(event, template){
		postIssue(template.$(".issueInput")[0], this.userId);
		return false;
	},
	"click .issueItem":function(event, template){
		if(!!!template.data || !!!Issue.findOne({giid:this.issue.giid,uid:template.data.userId})){
			if(template.associateIssueID.get() === this.issue._id){
				template.associateIssueID.set(null);
			} else{
				template.associateIssueID.set(this.issue._id);	
			}
		}
	},
	"click .associateIssue": function(event, template){
		IssueKiller.associateIssue(template.data.userId, template.associateIssueID.get(), function(e,r){
			template.associateIssueID.set(null);
		});
	},
	"input #issueSearch":function(event,template){
		// console.log(event.target.value);
		var searchStr = event.target.value.trim();
		template.searchStr.set(searchStr);
	}
});

Template.issueManagement.helpers({
	issues: function(){
		var issueIdList = _.pluck(
				DBUtil.distinctMulti(Issue,"giid", ["_id"], {state: Schemas.IssueState.open}),
				"_id");
		var keyword = Template.instance().searchStr.get();
		// escape the search string
		keyword = keyword.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
		// default to match all the string
		keyword = keyword+".*";

		return Issue.find({_id:{$in:issueIdList}, description:{$regex:keyword, $options: "i"}}, {sort:{createDate:-1}});
	},
	isOwner: function(issue){
		var passData = Template.instance().data;
		// console.log(Issue.findOne({giid:issue.giid,uid:passData.userId}));
		if(!!passData && !!Issue.findOne({giid:issue.giid,uid:passData.userId})) {
			return "dark ion-checkmark-circled";
		} else if(Template.instance().associateIssueID.get() === issue._id){
			return "calm ion-checkmark";
		} else {
			return "";
		}
	},
	canAssociate:function(){
		return !!Template.instance().associateIssueID.get() && !!Template.instance().data ? "bar-positive" : "disable-button";
	},
	canAddIssue:function(){
		return !!Template.instance().data && !!$(".issueInput").val() ? "button-positive" : "disable-button";
	}
});

function postIssue(issueInput, userId){
	if(!!!issueInput || !!!userId) return;

	var description = issueInput.value.trim();
	if(description !== ''){
		IssueKiller.InsertIssue(userId, Schemas.IssueState.open, description, function(e,r) {
			if(!!e){
				console.log("InsertIssue error");
			} else{
				$(issueInput).val('').trigger('input');	
			}
		});
	}
	issueInput.focus();
}