Template.studentParticipationRecord.onCreated(function() {

});

Template.studentParticipationRecord.onRendered(function() {
	var studentId = this.data.studentId;
	var classroomId = this.data.classroomId;

	var studentProfile = ClassroomKicker.getUserProfile(studentId);
	var classroomInfo = ClassroomKicker.getClassroomInfo(classroomId);
	// update the title
	this.$(".title").text(studentProfile.firstName +"'s record"+" in "+classroomInfo.name);

	$(".trending_chart").data.lineChart = loadTrendChart(studentId,classroomId);
	$(".breakdown_chart").data.pieChart = loadBreakdownChart(studentId,classroomId);
});

Template.studentParticipationRecord.helpers({

});

Template.studentParticipationRecord.events({
	"click #refreshChart": function(event, template) {
		$(".breakdown_chart").data.pieChart = loadBreakdownChart(template.data.studentId,template.data.classroomId);
	}
});

Template.studentParticipationRecord.onDestroyed(function() {

});

function loadTrendChart(studentId,classroomId){
	var stat = AnalyticSpider.getMonthlyParticipationStat(studentId,classroomId);
	var xTicks = ['x', '2014-01-01'];
	var acceptedArray = ['Accepted', 0];
	var totalArray = ['Total', 0];
	if(!!!stat) return;

	xTicks = xTicks.concat(stat.dateArray);
	acceptedArray = acceptedArray.concat(stat.selectedTimesArray);
	totalArray = totalArray.concat(stat.attendTimesArray);
	console.log(xTicks);

	return c3.generate({
		bindto: '.trending_chart',
		data: {
			x:'x',
			type: 'area-spline',
			columns: [
				xTicks,
				acceptedArray,
				totalArray
			],
			// colors: {
	  //           "Accepted": '#03A9F4',
	  //           "Total": '#60c4f8',
	  //       },
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

function loadBreakdownChart(studentId,classroomId){
	var breakdownStat = AnalyticSpider.getParticipationStatByType(studentId,classroomId);
	if(!!!breakdownStat) return;

	return c3.generate({
		bindto: '.breakdown_chart',
		data: {
			columns: [
				['Talk', breakdownStat.workTicketTotal],
				['Work', breakdownStat.talkTicketTotal],
			],
			type: 'pie',
			onclick: function(d, i) {
				if(d.id === "Talk"){
					this.load({
						columns: breakdownStat.talkTicketArray
					});
				} else if(d.id === "Work"){
					this.load({
						columns: breakdownStat.workTicketArray
					});
				} else {
					this.focus(d.id);
					return;
				}
				this.unload({
					ids: ['Talk', 'Work']
				});

			}
		}
	});
}