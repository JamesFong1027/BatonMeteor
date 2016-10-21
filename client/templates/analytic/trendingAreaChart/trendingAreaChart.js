Template.trendingAreaChart.onCreated(function() {
	this.uniqChartId = RandomUtil.randomCharString();
});

Template.trendingAreaChart.onRendered(function() {
	console.log(this.data);
	if(!!!this.data) this.data = new Object();

	var studentId = this.data.studentId;
	var classroomId = this.data.classroomId;
	this.data.stat = AnalyticSpider.getMonthlyParticipationStat(studentId,classroomId);
	this.data.areaChart = initChart(studentId,classroomId,this.data.stat);
});

Template.trendingAreaChart.events({
	"click #refreshChart": function(event, template) {
		template.data.stat = AnalyticSpider.getMonthlyParticipationStat(template.data.studentId, template.data.classroomId);
		refreshChart(template.data.areaChart, template.data.stat);
	}
});

Template.trendingAreaChart.helpers({
	"chartName": function() {
		return Template.instance().data.chartName;
	},
	"uniqChartId": function(){
		return Template.instance().uniqChartId;
	}
});

function prepareChartData(stat){
	if(!!!stat) return;
	var chartData = {
		xTicks : ['x', '2014-01-01'],
		acceptedArray : ['Accepted', 0],
		totalArray : ['Total', 0],
	};
	

	chartData.xTicks = chartData.xTicks.concat(stat.dateArray);
	chartData.acceptedArray = chartData.acceptedArray.concat(stat.selectedTimesArray);
	chartData.totalArray = chartData.totalArray.concat(stat.attendTimesArray);
	return chartData;
}

function initChart(studentId, classroomId, stat){
	if(!!!stat) return;
	var chartData = prepareChartData(stat);

	return c3.generate({
		bindto: '#'+Template.instance().uniqChartId,
		data: {
			x:'x',
			type: 'area-spline',
			columns: [
				chartData.xTicks,
				chartData.acceptedArray,
				chartData.totalArray
			],
		},
		tooltip: {
		  show: true
		},
		axis: {
	        x: {
	            type : 'timeseries',
	            tick: {
			      format: "%b %Y",
			      fit:true,
			      values:stat.dateArray
			    }
	        },
	        y: {
	        	tick: { format: d3.format("d") }
	        }
	    },
	    padding: {
		  right: 20
		}
	});
}

function refreshChart(chart, stat){
	var chartData = prepareChartData(stat);
	chart.unload({
		done:function(){
			chart.load({
				columns: [
					chartData.xTicks,
					chartData.acceptedArray,
					chartData.totalArray
				],
			});
		}
	});
}