function addOverlay(base) {
    $('[data-widget]').each(function() {
	var node = $(this);
	node.css('position', 'relative');
	node.append(
	    $('<div/>')
		.attr('class', 'widgetOverlay')
		.css({
		    'position': 'absolute',
		    'top': '0',
		    'left': '0',
		    'width': '100%',
		    'height': '100%',
		    'padding': '10px',
		    'box-sizing': 'border-box',
		    'border': '1px solid white',
		    'border-radius': '5px',
		    'background': 'black',
		    'opacity': '0.8',
		    'color': 'white',
		    'text-align': 'center'
		})
		.text('<div data-widget="'+node.attr('data-widget')+'" data-src="'+base+node.attr('data-src')+'"></div>')
	)
    });
}

function removeOverlay() {
    $('.widgetOverlay').remove();
}

function checkboxChange(chk) {
    if (chk.checked) {
	addOverlay($(chk).attr('data-base'));
    } else {
	removeOverlay();
    }
}
