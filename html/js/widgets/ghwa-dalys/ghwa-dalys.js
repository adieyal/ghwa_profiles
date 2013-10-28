define(['jquery', 'text!widgets/ghwa-dalys/template.html'], function($, template) {
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
	    var colors = {
		purple: "#757AB9",
		blue: "#00A3B2",
		pink: "#C37194"
	    }

	    node.html(template);

	    if (!me.data) { me.load(); }
	    if (!me.data) { return; }
	    
	    var svg = node.find('svg');

	    for (i=0; i<10; i++) {
		var data = me.data[i];
		var bar = svg.find('g[data-bar-key="bar'+i+'"]');
		var rect = bar.find('rect');
		var text = bar.find('text');
		if (data['value']>=0) {
		    bar.find('rect')
			.attr('width', data['value'])
			.css('fill', data['color']);
		    bar.find('text')
			.text(data['text'])
			.attr('x', data['value']+2);
		    if (text[0].getBBox()['width']+4 < rect[0].getBBox()['width']) {
			bar.find('text')
			    .css('fill', '#ffffff')
			    .css('text-anchor', 'end')
			    .attr('x', Math.min(data['value']-2, 198));
		    }
		} else {
		    bar.find('rect')
			.attr('width', -data['value'])
			.attr('x', data['value'])
			.css('fill', data['color']);
		    bar.find('text')
			.text(data['text'])
			.attr('x', data['value']-2)
			.css('text-anchor', 'end');
		    if (text[0].getBBox()['width']+4 < rect[0].getBBox()['width']) {
			bar.find('text')
			    .css('fill', '#ffffff')
			    .css('text-anchor', 'start')
			    .attr('x', Math.max(data['value']+2, -198));
		    }
		}
	    }
	    
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
