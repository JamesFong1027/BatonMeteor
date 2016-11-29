Template.trendingAreaChart.onCreated(function() {
	// console.log(this.data);
	if (!!!this.data) this.data = new Object();
	this.data.uniqChartId = RandomUtil.randomCharString();
	if (!!!this.data.statTimeUnitType) this.data.statTimeUnitType = AnalyticSpider.getPerfectTimePeriod(this.data.studentId, this.data.classroomId);
	this.data.stat = AnalyticSpider.getParticipationStatByTimePeriod(this.data.studentId, this.data.classroomId, this.data.statTimeUnitType);
	this.data.statTimeUnitType = new ReactiveVar(this.data.statTimeUnitType);
});

Template.trendingAreaChart.onRendered(function() {
	this.data.areaChart = initChart(this.data);
	console.log(this.data.areaChart);
});

Template.trendingAreaChart.events({
	"click #refreshChart": function(event, template) {
		template.data.statTimeUnitType.set(AnalyticSpider.statTimeUnitType.Weekly);
		template.data.stat = AnalyticSpider.getParticipationStatByTimePeriod(template.data.studentId, template.data.classroomId, template.data.statTimeUnitType.get());
		refreshChart(template.data.areaChart, template.data.stat);
	},
	"click .switch_btn": function(event, template) {
		template.data.statTimeUnitType.set(event.target.value);
		template.data.stat = AnalyticSpider.getParticipationStatByTimePeriod(template.data.studentId, template.data.classroomId, template.data.statTimeUnitType.get());
		refreshChart(template.data.areaChart, template.data.stat);
	},
});

Template.trendingAreaChart.helpers({
	"chartName": function() {
		return this.chartName;
	},
	"uniqChartId": function() {
		return this.uniqChartId;
	},
	"isChecked": function(statTimeUnitType) {
		return this.statTimeUnitType.get() === statTimeUnitType ? "checked" : "";
	}
});

function prepareChartData(stat) {
	if (!!!stat) return;
	var chartData = {
		xTicks: ['x'],
		acceptedArray: [TAPi18n.__("ticket_stat_title", {
			context: "accepted"
		})],
		totalArray: [TAPi18n.__("ticket_stat_title", {
			context: "total"
		})],
	};


	chartData.xTicks = chartData.xTicks.concat(stat.dateArray);
	chartData.acceptedArray = chartData.acceptedArray.concat(stat.selectedTimesArray);
	chartData.totalArray = chartData.totalArray.concat(stat.attendTimesArray);
	return chartData;
}

function initChart(data) {
	var stat = data.stat;
	if (!!!stat) return;
	var chartData = prepareChartData(stat);
	var statTimeUnitType = Template.instance().data.statTimeUnitType;

	return c3.generate({
		bindto: '#' + Template.instance().data.uniqChartId,
		data: {
			x: 'x',
			type: 'area-spline',
			columns: [
				chartData.xTicks,
				chartData.acceptedArray,
				chartData.totalArray
			],
		},
		grid: {
			y: {
				show: true
			},
		},
		tooltip: {
			show: true
		},
		axis: {
			x: {
				type: 'timeseries',
				tick: {
					format: function(x) {
						switch(statTimeUnitType.get()){
							case AnalyticSpider.statTimeUnitType.Daily:
								return moment(x).format('MMM/D');
								break;
							case AnalyticSpider.statTimeUnitType.Weekly:
								return moment(x).format('Y/M/D');
								break;
							case AnalyticSpider.statTimeUnitType.Monthly:
								return moment(x).format('Y/MMM');
								break;
						}
					},
					fit: true
				}
			},
			y: {
				tick: {
					format: d3.format("d")
				}
			}
		},
		padding: {
			right: 20
		}
	});
}

function refreshChart(chart, stat) {
	var chartData = prepareChartData(stat);
	chart.unload({
		done: function() {
			chart.load({
				columns: [
					chartData.xTicks,
					chartData.acceptedArray,
					chartData.totalArray
				],
			});
		}
	});
	chart.flush();
}