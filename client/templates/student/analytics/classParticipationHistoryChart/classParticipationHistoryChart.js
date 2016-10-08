Template.classParticipationHistoryChart.onCreated(function(){

});

Template.classParticipationHistoryChart.onRendered(function(){
	var monthlyStat = AnalyticSpider.getMonthlyParticipationStat(Meteor.userId(),Template.instance().data);
	drawMonthlyBarChart(monthlyStat);

	labels = ['Aug', 'Sep', 'Oct', 'Nov'];
	data = [
		[200, 400, 500, 800],
		[100, 200, 400, 600],
	];
	drawTrendingLineChart(labels,data);

});

Template.classParticipationHistoryChart.helpers({
  className:function(){
  	return ClassroomKicker.getClassroomInfo(Template.instance().data).name;
  }
});

Template.classParticipationHistoryChart.events({
  
});

Template.classParticipationHistoryChart.onDestroyed(function(){
	// console.log("onDestroyed");
	// console.log(Template.instance());
	// Template.instance().qrScanner.stopCapture();
});

function drawMonthlyBarChart(participationStat){
	new Chartist.Bar('.class_participation_summary_chart', {
	  labels: participationStat.monthStrArray,
	  // series: [participationStat.attendTimesArray,participationStat.selectedTimesArray]
	  series: [[2],[1]]
	}, {
	  stackBars: true,
	  stackMode: 'overlap',
	  horizontalBars: true,
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
	}).on('draw', function(data) {
	  if(data.type === 'bar') {
	  	var strokeWidth = $(".class_participation_summary_chart").height()*0.1 + "px";
	    data.element.attr({
	      style: 'stroke-width: '+ strokeWidth
	    });
	  }
	});
}

function drawTrendingLineChart(labels, data){
	var chart = new Chartist.Line('.class_participation_trends_chart', {
	  labels: labels,
	  series: data
	}, {
	  low: 0,
	  showArea: true,
	  showPoint: false,
	  fullWidth: false,
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