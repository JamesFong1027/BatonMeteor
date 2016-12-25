AnalyticSpider = {
	statTimeUnitType:{
		Daily: "days",
		Weekly: "weeks",
		Monthly: "months"
	},
	accumulateArray:function(oldArray){
		var newArray = [];
		oldArray.reduce(function(a,b,i) { return newArray[i] = a+b; },0);
		return newArray;
	},
	getUntrackedClassroomList:function(){
		var achievementClassList = AnalyticSpider.getClassAchievementList(Meteor.userId()).fetch();
	    var excludeClassIdList = null;
	    if (!!achievementClassList && achievementClassList.length !== 0)
	      excludeClassIdList = _.pluck(achievementClassList, 'cid');
	    return ClassroomKicker.getAttendedClassroomInfoList(null,excludeClassIdList);
	},
	addClassAchievement:function(classroomId, target){
		if(!!AnalyticSpider.getClassAchievement(classroomId,Meteor.userId())) return;

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
	getClassAchievement: function(classroomId,studentId) {
		return Achievement.findOne({
			uid: studentId,
			cid: classroomId,
			achievementType: Schemas.achievementType.totalSentTicket
		});
	},
	getClassAchievementList: function(studentId){
		return Achievement.find({
			uid: studentId,
			achievementType: Schemas.achievementType.totalSentTicket
		});
	},
	getAchievementsWithRelativeInfo: function(studentId, startDateFilter, endDateFilter){
		return TicketShutter.getAchievementRelativeInfo(AnalyticSpider.getClassAchievementList(studentId).fetch(),startDateFilter,endDateFilter);
	},
	fetchSummaryAchievement: function(studentId) {
		var achievements = AnalyticSpider.getAchievementsWithRelativeInfo(studentId);
		var summaryInfo = new Object();
		var attendTimes = 0;
		var selectedTimes = 0;
		var totalTarget = 0;
		for (var i = achievements.length - 1; i >= 0; i--) {
			attendTimes += achievements[i].participation.attendTimes;
			selectedTimes += achievements[i].participation.selectedTimes;
			totalTarget += parseInt(achievements[i].target);
		}
		summaryInfo.attendTimes = attendTimes;
		summaryInfo.selectedTimes = selectedTimes;
		summaryInfo.target = totalTarget;
		return summaryInfo;
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
	// userId means student user id
	getMonthlyParticipationStat:function(userId,classroomId){
		return AnalyticSpider.getParticipationStatByTimePeriod(userId,classroomId,AnalyticSpider.statTimeUnitType.Monthly);
	},
	getWeeklyParticipationStat:function(userId,classroomId){
		return AnalyticSpider.getParticipationStatByTimePeriod(userId,classroomId,AnalyticSpider.statTimeUnitType.Weekly);
	},
	getDailyParticipationStat:function(userId,classroomId){
		return AnalyticSpider.getParticipationStatByTimePeriod(userId,classroomId,AnalyticSpider.statTimeUnitType.Daily);
	},
	getPerfectTimePeriod:function(userId,classroomId,startDateFilter,endDateFilter){
		var query = new Object();
		if(!!classroomId) query.cid = classroomId;
		if(!!userId) query.uid = userId;
		if(!!startDateFilter) query.createDate = { $gte : startDateFilter };
		if(!!endDateFilter) {
			if(!!query.createDate) query.createDate.$lte = endDateFilter;
			else query.createDate = {$lte : endDateFilter};
		}

		var firstTicket = TicketsInfo.findOne(query,{sort:{createDate:1}});
		var lastTicket = TicketsInfo.findOne(query,{sort:{createDate:-1}});
		if(!!!firstTicket) return null;

		var statObj = {
			dateArray: new Array(),
			attendTimesArray : new Array(),
			selectedTimesArray : new Array()
		};
		var startMoment = moment(firstTicket.createDate);
		var lastMoment = moment(lastTicket.createDate);


		var monthDiff = Math.ceil(lastMoment.diff(startMoment, AnalyticSpider.statTimeUnitType.Monthly ,true));
		var weekDiff = Math.ceil(lastMoment.diff(startMoment, AnalyticSpider.statTimeUnitType.Weekly ,true));
		var dayDiff = Math.ceil(lastMoment.diff(startMoment, AnalyticSpider.statTimeUnitType.Daily ,true));
		if(monthDiff > 1) return AnalyticSpider.statTimeUnitType.Monthly;
		if(weekDiff > 1) return AnalyticSpider.statTimeUnitType.Weekly;

		return AnalyticSpider.statTimeUnitType.Daily;
	},
	getParticipationStatByTimePeriod:function(userId,classroomId,statTimeUnitType,startDateFilter,endDateFilter){
		var query = new Object();
		if(!!classroomId) query.cid = classroomId;
		if(!!userId) query.uid = userId;
		if(!!startDateFilter) query.createDate = { $gte : startDateFilter };
		if(!!endDateFilter) {
			if(!!query.createDate) query.createDate.$lte = endDateFilter;
			else query.createDate = {$lte : endDateFilter};
		}

		var firstTicket = TicketsInfo.findOne(query,{sort:{createDate:1}});
		var lastTicket = TicketsInfo.findOne(query,{sort:{createDate:-1}});
		if(!!!firstTicket) return null;

		var statObj = {
			dateArray: new Array(),
			attendTimesArray : new Array(),
			selectedTimesArray : new Array()
		};
		var startMoment = moment(firstTicket.createDate);
		var lastMoment = moment(lastTicket.createDate);


		var timeUnitDiff = Math.ceil(lastMoment.diff(startMoment, statTimeUnitType,true));

		for (var i=0 ; i <= timeUnitDiff; i++) { 
			var startDate = startMoment.clone().startOf(statTimeUnitType).toDate();
			var endDate = startMoment.clone().endOf(statTimeUnitType).toDate();
			if(startDate.getTime() > lastMoment.toDate().getTime()) break;

			statObj.dateArray.push(startMoment.format("Y-M-D"));
			var stat = TicketShutter.getParticipationInfo(userId, classroomId, startDate, endDate);
			statObj.selectedTimesArray.push(stat.selectedTimes);
			statObj.attendTimesArray.push(stat.attendTimes);
			startMoment.add(1,statTimeUnitType);
		}
		return statObj;
	},
	// for specific student in specific classroom, or in general 
	getParticipationStatByType:function(studentId, classroomId){
		var workTicketQuery = {ticketType:Schemas.ticketType.workTicket};
		var talkTicketQuery = {ticketType:Schemas.ticketType.talkTicket};
		if(!!studentId){
			workTicketQuery.uid = studentId;
			talkTicketQuery.uid = studentId;
		}
		if(!!classroomId){
			workTicketQuery.cid = classroomId;
			talkTicketQuery.cid = classroomId;	
		}

		var statObj = {
			workTicketTotal: ["Work"],
			workTicketArray : new Array(),
			talkTicketTotal: ["Talk"],
			talkTicketArray: new Array()
		}
		statObj.workTicketTotal.push(TicketsInfo.find(workTicketQuery).count());
		statObj.talkTicketTotal.push(TicketsInfo.find(talkTicketQuery).count());
		if(statObj.workTicketTotal[1] === 0 && statObj.talkTicketTotal[1] === 0){
			return;
		}
		statObj.workTicketArray = DBUtil.groupBy(TicketsInfo,"ticketContent",workTicketQuery);
		statObj.talkTicketArray = DBUtil.groupBy(TicketsInfo,"ticketContent",talkTicketQuery);

		return statObj;
	}
}