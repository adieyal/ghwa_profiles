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
	    
	    var pathFor = function(value) {
		return 
	    }

	    for (i=0; i<10; i++) {
		var data = me.data[i];
		var bar = svg.find('g[data-bar-key="bar'+i+'"]');
		var rect = bar.find('rect');
		var text = bar.find('text');
		if (data['value']>=0) {
		    var value = Math.min(data['value'], 200)
		    bar.find('rect')
			.attr('width', value)
			.css('fill', data['color']);
		    bar.find('text')
			.text(data['text'])
			.attr('x', value+2);
		    if (text[0].getBBox()['width']+4 < rect[0].getBBox()['width']) {
			bar.find('text')
			    .css('fill', '#ffffff')
			    .css('text-anchor', 'end')
			    .attr('x', Math.min(data['value']-2, 198));
		    }
		    if (data['value'] > 200) {
			var box = bar.find('rect')[0].getBBox();
			var path = bar.find('path');
			path.attr('d', 'M199,'+box['y']+' l1,0 l8,8 l-8,8 l-1,0 z');
			path.css('fill', data['color']);
		    }
		} else {
		    var value = Math.max(data['value'], -200)
		    bar.find('rect')
			.attr('width', -value)
			.attr('x', value)
			.css('fill', data['color']);
		    bar.find('text')
			.text(data['text'])
			.attr('x', value-2)
			.css('text-anchor', 'end');
		    if (text[0].getBBox()['width']+4 < rect[0].getBBox()['width']) {
			bar.find('text')
			    .css('fill', '#ffffff')
			    .css('text-anchor', 'start')
			    .attr('x', Math.max(value+2, -198));
		    }
		    if (data['value'] < -200) {
			var box = bar.find('rect')[0].getBBox();
			var path = bar.find('path');
			path.attr('d', 'M-199,'+box['y']+' l-1,0 l-8,8 l8,8 l1,0 z');
			path.css('fill', data['color']);
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
