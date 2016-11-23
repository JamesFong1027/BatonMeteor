Template.dataTitleTrendChart.onCreated(function() {
	if (!!!this.data) this.data = new Object();
	if (!!!this.data.periodType) this.data.periodType = AnalyticSpider.statTimeUnitType.Weekly;

	this.data.stat = new ReactiveVar(AnalyticSpider.getParticipationStatByTimePeriod(this.data.studentId, this.data.classroomId, this.data.periodType));
});

Template.dataTitleTrendChart.helpers({
	"classroomInfo": function() {
		return ClassroomKicker.getClassroomInfo(Template.instance().data.classroomId);
	},
	moreopId: function(id) {
		return "more-op-" + id;
	},
	"statData": function(){
		if(!!!Template.instance().data.stat.get()) return;

		var arr = Template.instance().data.stat.get().attendTimesArray;
		if(arr.length === 0) return 0;

		var currentNum = arr[arr.length-1];
		var prevNum = arr.length < 2 ? 0 : arr[arr.length - 2];
		var diffNum = currentNum - prevNum;
		var diffPercent = Math.round( ((diffNum/currentNum) * 100) *10)/10;
		var trendTypeClass = diffNum > 0 ? "summary-positive" : "summary-negative";
		var trendType = diffNum > 0 ? "Growth" : "Drop";
		var percentStr = (diffNum > 0 ? "+" : "") + diffPercent + "%"
		var periodTypeStr = "in previous ";
		var periodType = Template.instance().data.periodType;
		periodTypeStr = periodTypeStr + periodType.substring(0,periodType.length-1);
		var statData = {
			currentNum: currentNum,
			diffNum: diffNum,
			percentStr: percentStr,
			trendTypeClass: trendTypeClass,
			trendType: trendType,
			periodTypeStr: periodTypeStr
		}
		return statData;
	},
	"i18nTrendType":function(trendType){
		return TAPi18n.__("trend_type", {context: trendType.toLowerCase()});
	}
});

Template.dataTitleTrendChart.onRendered(function() {
	if(!!!Template.instance().data.stat.get()) return;
	
	initChart(this.data.stat.get().attendTimesArray, this.data.classroomId);
});

function initChart(statArray, classroomId){
	var options = {
		axisX: {
			offset: 0,
			// showGrid: false,
			showLabel: false,
		},
		axisY: {
			offset: 0,
			// showGrid: false,
			showLabel: false,
			onlyInteger: true,
		},
		chartPadding: 15,
		lineSmooth: false,
		//low: 0,
		//showArea: true,
		showPoint: false,
		//width: '410'//,
		fullWidth: true,
		//height: '120' 
	};

	// add 0 as start point
	statArray.unshift(0);
	var labelArray = new Array();
	for(var i =0 ; i <statArray.length; i++){
		labelArray.push(i);
	}
	// statArray = AnalyticSpider.accumulateArray(statArray);
	new Chartist.Line('.bang_chart#'+classroomId, {
		labels: labelArray,
		series: [
			statArray
		]
	}, options);
}