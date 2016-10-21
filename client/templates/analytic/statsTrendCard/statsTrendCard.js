Template.statsTrendCard.onCreated(function() {
	if(!!!this.data) this.data = new Object();
	if(!!!this.data.periodType) this.data.periodType = AnalyticSpider.statTimeUnitType.Weekly;
	
	this.data.stat = new ReactiveVar(AnalyticSpider.getParticipationStatByTimePeriod(this.data.studentId,this.data.classroomId,this.data.periodType));
});

Template.statsTrendCard.onRendered(function() {
	initChart(this.data.stat.get().attendTimesArray);
});

Template.statsTrendCard.events({
	
});

Template.statsTrendCard.helpers({
	"statsTitle": function() {
		return Template.instance().data.chartTitle;
	},
	"statData": function(){
		if(!!!Template.instance().data.stat) return;

		var arr = Template.instance().data.stat.get().attendTimesArray;
		if(arr.length === 0) return 0;

		var currentNum = arr[arr.length-1];
		var prevNum = arr.length < 2 ? 0 : arr[arr.length - 2];
		var diffNum = currentNum - prevNum;
		var diffPercent = Math.round( ((diffNum/currentNum) * 100) *10)/10;
		var trendType = diffNum > 0 ? "summary-positive" : "summary-negative";
		var percentStr = (diffNum > 0 ? "+" : "") + diffPercent + "%";
		var periodType = Template.instance().data.periodType;
		var periodTypeStr = periodType.substring(0,periodType.length-1);
		var statData = {
			currentNum: currentNum,
			percentStr: percentStr,
			trendType: trendType,
			periodTypeStr: periodTypeStr
		}
		return statData;
	},
	"moreopId":function(){

	}
});

function initChart(statArray){
	var options = {
		axisX: {
			offset: 0,
			showGrid: false,
			showLabel: false
		},
		axisY: {
			offset: 0,
			showGrid: false,
			showLabel: false
		},
		chartPadding: 0,
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
	new Chartist.Line('.bg-chart', {
		labels: labelArray,
		series: [
			statArray
		]
	}, options);
}