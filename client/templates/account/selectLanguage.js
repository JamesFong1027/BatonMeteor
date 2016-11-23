Template.selectLanguage.onRendered(function(){
	this.$(".item-radio [value='zh']")[0].checked = isChecked('zh');
	this.$(".item-radio [value='en']")[0].checked = isChecked('en');
});

function isChecked(langCode){
	return TAPi18n.getLanguage() === langCode;
}

Template.selectLanguage.events({
	"click .item-radio [name='language']": function(events, template){
		console.log(events.target.value);
		TAPi18n.setLanguage(events.target.value);		
	}
});