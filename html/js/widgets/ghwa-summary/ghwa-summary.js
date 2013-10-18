define(['jquery', 'text!widgets/ghwa-summary/template.html'], function($, template) {
    Widget = function(element) {
	this.node = element;
    }
    Widget.prototype = {
	can_render: function() {
	    return true;
	},
	init: function() {
	    var node = $(this.node);

	    this.src = node.data('src');
	    this.draw();
	},
	draw: function() {
	    var me = this;
	    var node = $(me.node);
	    
	    if (!me.data) { me.load(); }
	    if (!me.data) { return; }
	    
	    var html = template
		.replace('{country}', me.data['C_1'])
		.replace('{summary}', me.data['C_2']);
	    node.html(html);
	    
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
