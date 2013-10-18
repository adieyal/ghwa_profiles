define([
    'jquery', 'd3',
    'text!widgets/ghwa-human-resources/template.html',
    'text!widgets/ghwa-human-resources/yes.svg',
    'text!widgets/ghwa-human-resources/no.svg',
    'text!widgets/ghwa-human-resources/partial.svg',
    'text!widgets/ghwa-human-resources/no_data.svg',
    'text!widgets/ghwa-human-resources/nurse.svg',
    'text!widgets/ghwa-human-resources/physician.svg'
], function($, d3dummy, template, icon_yes, icon_no, icon_partial, icon_no_data, icon_nurse, icon_physician) {
    Widget = function(element) {
	this.node = element;
    }
    Widget.prototype = {
	can_render: function() {
	    var svg = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
	    return svg;
	},
	init: function() {
	    var node = $(this.node);

	    this.src = node.data('src');
	    this.draw();
	},
	draw: function() {
	    var me = this;
	    var node = $(me.node);
	    var icons = {
		"YES": icon_yes,
		"NO": icon_no,
		"YES*": icon_partial,
		"?": icon_no_data
	    }
	    var color = {
		"RED" : "#C37194",
		"YELLOW" : "#E89964",
		"GREEN": "#A4BB6B",
		"NONE": "none"
	    }
	    
	    if (!me.data) { me.load(); }
	    if (!me.data) { return; }
	    
	    node.html(template);
	    node.find('[data-key]').each(function() {
		var elem = $(this);
		var keys = elem.attr('data-key').split('.');
		var value = me.data;
		for (i=0; i<keys.length; i++) {
		    if (value) {
			value = value[keys[i]];
		    }
		}
		if (value) {
		    elem.html(value);
		} else {
		    elem.html('-');
		}
		if (elem.attr('data-key') == 'AP_1') {
		    if (value == 'ABOVE') {
			elem.attr('style', 'color: #a4bb6b');
		    } else if (value == 'BELOW' ) {
			elem.attr('style', 'color: #b03877');
		    }
		}
	    });
	    node.find('[data-icon-key]').each(function() {
		var elem = $(this);
		var keys = elem.attr('data-icon-key').split('.');
		var value = me.data;
		for (i=0; i<keys.length; i++) {
		    if (value) {
			value = value[keys[i]];
		    }
		}
		if (value) {
		    elem.html(icons[value]);
		} else {
		    elem.html(icons['?']);
		}
	    });
	    node.find('[data-key-text]').each(function() {
		var elem = $(this);
		var keys = elem.attr('data-key-text').split('.');
		var value = me.data;
		for (i=0; i<keys.length; i++) {
		    if (value) {
			value = value[keys[i]];
		    }
		}
		if (value) {
		    elem.html(value);
		} else {
		    elem.html('-');
		}
	    });
	    node.find('[data-background-color]').each(function() {
		var elem = $(this);
		var keys = elem.attr('data-background-color').split('.');
		var value = me.data;
		for (i=0; i<keys.length; i++) {
		    if (value) {
			value = value[keys[i]];
		    }
		}
		if (value) {
		    elem.css('background-color', color[value]);
		} else {
		    elem.css('background-color', color['NONE']);
		}
	    });
	    node.find('[data-icon]').each(function() {
		var elem = $(this);
		var value = elem.attr('data-icon');
		elem.html(icons[value]);
	    });
	    node.find('.nurses').each(function() {
		var elem = $(this).find('.icons');
		var num = Math.ceil(me.data['AP_3']);
		if (num > 10) {
		    num = 10;
		}
		var width;
		var height;
		if (num > 5) {
		    height = 20;
		    width = elem.width()/Math.ceil(num/2);
		} else {
		    height = 40;
		    width = elem.width()/num;
		}
		for (i=0; i<num; i++) {
		    var div = $('<div></div>');
		    div.attr('class', 'icon');
		    div.html(icon_nurse);
		    div.css('height', height+'px');
		    div.css('width', width+'px');
		    elem.append(div);
		}
	    });
	    node.find('.physicians').each(function() {
		var elem = $(this).find('.icons');
		var num = 1;
		if (num > 10) {
		    num = 10;
		}
		var width;
		var height;
		if (num > 5) {
		    height = 20;
		    width = elem.width()/Math.ceil(num/2);
		} else {
		    height = 40;
		    width = elem.width()/num;
		}
		for (i=0; i<num; i++) {
		    var div = $('<div></div>');
		    div.attr('class', 'icon');
		    div.html(icon_physician);
		    div.css('height', height+'px');
		    div.css('width', width+'px');
		    elem.append(div);
		}
	    });
	    node.find('.pie').each(function() {
		var elem = $(this).find('svg');
		var val = me.data['AP_2'];
		if (isNaN(parseFloat(val))) { return; }
		var arc = d3.svg.arc();
		arc.innerRadius(0);
		arc.outerRadius(17);
		arc.startAngle(Math.PI/2);
		arc.endAngle((Math.PI/2)+(val/100*2*Math.PI));
		d3.select(elem[0])
		    .append('path')
		    .attr('d', arc);
		arc.innerRadius(4);
		d3.select(elem[0])
		    .append('text')
		    .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; })
		    .attr("dy", ".35em")
		    .text(val+'%');
		
	    });
	    
	    $(me.node).attr('data-rendered', true);
	    $(document).trigger('widget-rendered');
	},
	load: function() {
	    var me = this;
	    var node = $(me.node);
	    var src = node.data('src');

	    if (src) {
		var url = src.split('#')[0];
		var sel = src.split('#')[1];
		$.ajax({
		    type: 'get',
		    url: url,
		    dataType: 'json',
		    async: false,
		    success: function(d) {
			if (sel) {
			    me.data = d[sel];
			} else {
			    me.data = d;
			}
		    },
		    error: function() { alert('Error loading data.'); }
		});
	    }
	}
    }
    return Widget;
});
