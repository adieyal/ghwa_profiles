define([
    'jquery',
    'text!widgets/ghwa-governance/template.html',
    'text!widgets/ghwa-governance/yes.svg',
    'text!widgets/ghwa-governance/no.svg',
    'text!widgets/ghwa-governance/partial.svg',
    'text!widgets/ghwa-governance/no_data.svg'
], function($, template, icon_yes, icon_no, icon_partial, icon_no_data) {
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
	    node.find('[data-icon]').each(function() {
		var elem = $(this);
		var value = elem.attr('data-icon');
		elem.html(icons[value]);
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
