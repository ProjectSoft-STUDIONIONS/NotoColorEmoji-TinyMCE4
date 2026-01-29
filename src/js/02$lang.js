let translate = function(value) {
	let returnValue = `${value}`;
	try {
		returnValue = (tinymce.i18n.data[`${tinymce.settings.language}`][`${value}`] != undefined) ? tinymce.i18n.data[`${tinymce.settings.language}`][`${value}`] : `${value}`;
	}catch(e){
		returnValue = `${value}`;
	}
	return returnValue;
}