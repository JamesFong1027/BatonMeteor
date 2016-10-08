AnalyticSpider = {
	getUntrackedClassroomList:function(){
		var achievementClassList = AnalyticSpider.getClassAchievementList().fetch();
	    var excludeClassIdList = null;
	    if (!!achievementClassList && achievementClassList.length !== 0)
	      excludeClassIdList = _.pluck(achievementClassList, 'cid');
	    return ClassroomKicker.getAttendedClassroomInfoList(null,excludeClassIdList);
	},
	addClassAchievement:function(classroomId, target){
		if(!!AnalyticSpider.getClassAchievement(classroomId)) return;

		Achievement.insert({
			uid: Meteor.userId(),
			cid: classroomId,
			target: target
		});
	},
	removeClassAchievement: function(achievementId){
		Achievement.remove(achievementId);
	},
	editClassAchievement: function(achievementId, target){
		Achievement.update({_id:achievementId},{$set:{target:target}});
	},
	getClassAchievement: function(classroomId) {
		return Achievement.findOne({
			uid: Meteor.userId(),
			cid: classroomId,
			achievementType: Schemas.achievementType.totalSentTicket
		});
	},
	getClassAchievementList: function(){
		return Achievement.find({
			uid: Meteor.userId(),
			achievementType: Schemas.achievementType.totalSentTicket
		});
	},
	getAchievementsWithRelativeInfo: function(startDateFilter, endDateFilter){
		return TicketShutter.getAchievementRelativeInfo(AnalyticSpider.getClassAchievementList().fetch(),startDateFilter,endDateFilter);
	},
	getTimeFrameByMonth:function(userId,classroomId){
		var firstTicket = TicketsInfo.findOne({uid:userId, cid:classroomId},{sort:{createDate:1}});
		var lastTicket = TicketsInfo.findOne({uid:userId, cid:classroomId},{sort:{createDate:-1}});
		if(!!!firstTicket) return null;

		var monthArray = [];
		var startMoment = moment(firstTicket.createDate);
		var lastMoment = moment(lastTicket.createDate);
		var monthDiff = lastMoment.diff(startMoment,"month");

		if(monthDiff > 0){
			for (var i=0 ; i < monthDiff; i++) { 
				monthArray.push(startMoment.format("MMM"));
				startMoment.add(1,"M");
			}
		} else {
			monthArray.push(startMoment.format("MMM"));
		}
		return monthArray;
	},
	getMonthlyParticipationStat:function(userId,classroomId){
		var firstTicket = TicketsInfo.findOne({uid:userId, cid:classroomId},{sort:{createDate:1}});
		var lastTicket = TicketsInfo.findOne({uid:userId, cid:classroomId},{sort:{createDate:-1}});
		if(!!!firstTicket) return null;

		var statObj = {
			monthStrArray : new Array(),
			attendTimesArray : new Array(),
			selectedTimesArray : new Array()
		};
		var startMoment = moment(firstTicket.createDate);
		var lastMoment = moment(lastTicket.createDate);
		var monthDiff = lastMoment.diff(startMoment,"month");

		for (var i=0 ; i <= monthDiff; i++) { 
			statObj.monthStrArray.push(startMoment.format("MMM"));
			var startDateFilter = startMoment.clone().startOf('month').toDate();
			var endDateFilter = startMoment.clone().endOf('month').toDate();
			var monthlyStat = TicketShutter.getParticipationInfo(userId, classroomId, startDateFilter, endDateFilter);
			statObj.selectedTimesArray.push(monthlyStat.selectedTimes);
			statObj.attendTimesArray.push(monthlyStat.attendTimes);
			startMoment.add(1,"M");
		}


		return statObj;
	}
}