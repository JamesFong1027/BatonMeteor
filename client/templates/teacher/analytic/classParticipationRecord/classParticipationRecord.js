Template.classParticipationRecords.onCreated(function(){

});

Template.classParticipationRecords.onRendered(function(){
    
});

Template.classParticipationRecords.helpers({
  ClassroomInfoList: function() {
    return ClassroomKicker.getClassroomList();
  },
  moreopId: function(id) {
    return "more-op-" + id;
  },
  chartArg:function(){
    return {
      chartTitle: TAPi18n.__("total_participation_times"),
      statTimeUnitType: AnalyticSpider.statTimeUnitType.Weekly,
    }
  },
  classChartArg: function(classroomId){
    return {
      chartTitle: TAPi18n.__("total_participation_times"),
      statTimeUnitType: AnalyticSpider.statTimeUnitType.Weekly,
      classroomId: classroomId
    }
  }
});

Template.classParticipationRecords.events({
  "click .more-op":function(){
    console.log(this._id);
    IonPopover.show("classParticipationRecordMenu", this, "#more-op-"+this._id);
  },
  // "click .add_goal":function(event,template){
  //   var achievementId = this._id;
  //   IonPopup.prompt({
  //     title: 'Setup goal',
  //     template: 'Please enter your participation goal',
  //     okText: 'Submit',
  //     inputType: 'number',
  //     inputPlaceholder: 'Your goal in number',
  //     onOk: function(event, value){
  //       AnalyticSpider.editClassAchievement(achievementId,value);
  //     }
  //   });
  // },
  "click .add_class": function(event, template){
    IonModal.open("classroomPickList");
  },
})

Template.classParticipationRecords.onDestroyed(function(){
	// console.log("onDestroyed");
	// console.log(Template.instance());
	// Template.instance().qrScanner.stopCapture();
});

function fetchClassAchievements(){
  // right now we fetch all the participation info
  return AnalyticSpider.getAchievementsWithRelativeInfo();
}

// function fetchSummaryAchievement(){
//   var achievements = fetchClassAchievements();
//   var summaryInfo = new Object();
//   var attendTimes = 0;
//   var selectedTimes = 0;
//   var totalTarget = 0;
//   for (var i = achievements.length - 1; i >= 0; i--) {
//     attendTimes += achievements[i].participation.attendTimes;
//     selectedTimes += achievements[i].participation.selectedTimes;
//     totalTarget += parseInt(achievements[i].target);
//   }
//   summaryInfo.attendTimes = attendTimes;
//   summaryInfo.selectedTimes = selectedTimes;
//   summaryInfo.target = totalTarget;
//   return summaryInfo;
// }

// function initSummaryInfo(){
//   var summaryInfo = fetchSummaryAchievement();
//   if(!!!summaryInfo) return;

//   if(summaryInfo.target === 0 && summaryInfo.attendTimes === 0 && summaryInfo.selectedTimes === 0){
//     summaryInfo.target = 1;
//   } else if(summaryInfo.target === 0 && (summaryInfo.attendTimes !== 0 || summaryInfo.selectedTimes !== 0)){
//     summaryInfo.target = summaryInfo.attendTimes + summaryInfo.selectedTimes;
//   }

//   var data = [summaryInfo.selectedTimes, summaryInfo.attendTimes - summaryInfo.selectedTimes, summaryInfo.target-summaryInfo.attendTimes];
//   if(!!summaryInfo && (summaryInfo.target < summaryInfo.attendTimes)){
//     data = [summaryInfo.target,0];
//   }

//   console.log(data);
//   var donutWidth = $(".general_summary_chart").height()*0.3;
//   var summaryPie = new Chartist.Pie('.general_summary_chart', {
//     series: data
//   }, {
//     height:'200%',
//     donutWidth: donutWidth,
//     donut: true,
//     startAngle: 270,
//     total: summaryInfo.target * 2,
//     showLabel: true,
//     labelInterpolationFnc: function(value,index) {
//         var total = summaryPie.data.series.reduce(function(pv, cv) { return pv + cv; }, 0);
//         if(index===0)
//           return Math.round(summaryInfo.attendTimes/summaryInfo.target*100)+"%";
//     }
//   });

//   // summaryPie.on('created', function() {
//   //   var chartEl = $('.ct-chart-donut');
//   //   chartEl.removeAttr('style');
//   //   chartEl.height(chartEl.height() / 1.5);
//   // });

//   summaryPie.on('draw', function(ctx) {
//     if(ctx.type === 'label') {
//         ctx.element.addClass("ct-label-pie");
//         if(ctx.index === 0){
//           ctx.element.attr({
//               dx: ctx.element.root().width() / 2,
//               dy: ctx.element.root().height() / 2,
//               "id": "ct-label-pie-"+ctx.index
//           });  
//         }
//     }else if(ctx.type === 'slice'){
//         ctx.element.attr({
//             'id' : "ct-slice-pie-"+ctx.index
//         });
//         donutDisplayAnimation(ctx,800);
//     }
//   });
// }
