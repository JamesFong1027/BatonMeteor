Template.breakdownChart.onCreated(function() {

});

Template.breakdownChart.onRendered(function() {
	console.log(this.data);

	var studentId = this.data.studentId;
	var classroomId = this.data.classroomId;
	this.data.stat = AnalyticSpider.getParticipationStatByType(studentId, classroomId);
	this.data.pieChart = initChart(studentId,classroomId,this.data.stat);
});

Template.breakdownChart.events({
	"click #refreshChart": function(event, template) {
		template.data.stat = AnalyticSpider.getParticipationStatByType(template.data.studentId, template.data.classroomId);
		refreshChart(template.data.pieChart, template.data.stat);
	}
});

Template.breakdownChart.helpers({
	"chartName": function() {
		return Template.instance().data.chartName;
	}
});

function initChart(studentId,classroomId, stat){
	if(!!!stat) return;

	return c3.generate({
		bindto: '.breakdown_pie_chart',
		data: {
			columns: [
				stat.workTicketTotal,
				stat.talkTicketTotal,
			],
			type: 'pie',
			onclick: function(d, i) {
				var pieChart = this;
				if(d.id === "Talk"){
					pieChart.load({
						columns: stat.talkTicketArray
					});
				} else if(d.id === "Work"){
					pieChart.load({
						columns: stat.workTicketArray
					});
				} else {
					pieChart.focus(d.id);
					return;
				}
				pieChart.unload({
					ids: ['Talk', 'Work'],
				});

			}
		}
	});
}

function refreshChart(pieChart, stat){
	pieChart.unload({
		done:function(){
			pieChart.load({
				columns: [
					stat.workTicketTotal,
					stat.talkTicketTotal
				]
			});
		}
	});
}