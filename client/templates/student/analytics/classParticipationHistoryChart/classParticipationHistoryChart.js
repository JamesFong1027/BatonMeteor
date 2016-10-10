Template.classParticipationHistoryChart.onCreated(function(){

});

Template.classParticipationHistoryChart.onRendered(function(){
	var monthlyStat = AnalyticSpider.getMonthlyParticipationStat(Meteor.userId(),Template.instance().data);
	if(!!monthlyStat && monthlyStat.monthStrArray.length !== 0) {
		$(".class_participation_summary_chart").empty();
		$(".class_participation_trends_chart").empty();
		drawMonthlyBarChart(monthlyStat);
		drawTrendingLineChart(monthlyStat);
	}
});

Template.classParticipationHistoryChart.helpers({
  className:function(){
  	return ClassroomKicker.getClassroomInfo(Template.instance().data).name;
  }
});

Template.classParticipationHistoryChart.events({
  
});

Template.classParticipationHistoryChart.onDestroyed(function(){
	
});

function drawMonthlyBarChart(participationStat){
	var barWidth = $(".class_participation_summary_chart").height()*0.1/2;

	new Chartist.Bar('.class_participation_summary_chart', {
	  labels: participationStat.monthStrArray,
	  series: [{
			"name": "Accepted",
			"data": participationStat.selectedTimesArray
		}, {
			"name": "Total",
			"data": participationStat.attendTimesArray
		}]
	 //  labels: ["Oct", "Nov", "Dec"],
		// series: [
		// 	{ "name": "Total", "data": [20, 30, 40] },
		// 	{ "name": "Accepted", "data": [10, 15, 20] }
		// ]
	}, {
	  horizontalBars: true,
	  seriesBarDistance: barWidth,
	  reverseData: true,
	  fullWidth: false,
	  height:'90%',
	  axisX: {
	  	onlyInteger: true,
		labelOffset: {
			x: -10,
			y: 0
		},
	  },
      chartPadding: {
        top: 10,
        right: 20,
        bottom: 5,
        left: 5
      },
      plugins: [
        Chartist.plugins.legend()
      ]
	}).on('draw', function(data) {
	  if(data.type === 'bar') {
	  	var strokeWidth =  barWidth + "px";
	    data.element.attr({
	      style: 'stroke-width: '+ strokeWidth
	    });
	  }
	});
}

function drawTrendingLineChart(participationStat){
	var acceptArray = participationStat.selectedTimesArray.slice(0);
	var totalArray = participationStat.attendTimesArray.slice(0);
	var labels = participationStat.monthStrArray.slice(0);
	// var acceptArray = [100, 200, 400, 600];
	// var totalArray = [200, 400, 500, 800];
	// var labels = ['Aug', 'Sep', 'Oct', 'Nov'];
	
	// var data = [
	// 	{ "name": "Accepted", "data": [100, 200, 400, 600] },
	// 	{ "name": "Total", "data": [200, 400, 500, 800] }
	// ];
	
	var data = [];
	// add start point for line chart and accumulate the array
	labels.unshift("");
	acceptArray.unshift(0);
	totalArray.unshift(0);
	acceptArray = accumulateArray(acceptArray);
	totalArray = accumulateArray(totalArray);

	data = [{
		"name": "Accepted",
		"data": acceptArray
	}, {
		"name": "Total",
		"data": totalArray
	}];

	var chart = new Chartist.Line('.class_participation_trends_chart', {
		labels: labels,
		series: data
	}, {
	  low: 0,
	  showArea: true,
	  showPoint: false,
	  fullWidth: false,
	  lineSmooth: true,
	  axisY: {
	  	onlyInteger: true,
	  },
	  plugins: [
        Chartist.plugins.legend()
      ]
	});

	chart.on('draw', function(data) {
	  if(data.type === 'line' || data.type === 'area') {
	    data.element.animate({
	      d: {
	        begin: 2000 * data.index,
	        dur: 2000,
	        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
	        to: data.path.clone().stringify(),
	        easing: Chartist.Svg.Easing.easeOutQuint
	      }
	    });
	  }
	});
}

function accumulateArray(oldArray){
	var newArray = [];
	oldArray.reduce(function(a,b,i) { return newArray[i] = a+b; },0);
	return newArray;
}