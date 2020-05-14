/*!
 * artDialog iframeTools
 * Date: 2011-11-25 13:54
 * http://code.google.com/p/artdialog/
 * (c) 2009-2011 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */
 
;(function ($, window, artDialog, undefined) {

var _topDialog, _proxyDialog, _zIndex,
	_data = '@ARTDIALOG.DATA',
	_open = '@ARTDIALOG.OPEN',
	_opener = '@ARTDIALOG.OPENER',
	_winName = window.name = window.name
	|| '@ARTDIALOG.WINNAME' + + new Date,
	_isIE6 = window.VBArray && !window.XMLHttpRequest;

$(function () {
	!window.jQuery && document.compatMode === 'BackCompat'
	&& alert('artDialog Error: document.compatMode === "BackCompat"');
});
	
	
var _top = artDialog.top = function () {
	var top = window,
	test = function (name) {
		try {
			var doc = window[name].document;	// ����|��Ȩ��
			doc.getElementsByTagName; 			// chrome ���ذ�ȫ����
		} catch (e) {
			return false;
		};
		
		return window[name].artDialog
		// ��ܼ��޷���ʾ������Ԫ��
		&& doc.getElementsByTagName('frameset').length === 0;
	};
	
	if (test('top')) {
		top = window.top;
	} else if (test('parent')) {
		top = window.parent;
	};
	
	return top;
}();
artDialog.parent = _top; 


_topDialog = _top.artDialog;

_zIndex = function () {
	return _topDialog.defaults.zIndex;
};



/**
 * �������ݹ����ӿ�
 * @see		http://www.planeart.cn/?p=1554
 * @param	{String}	�洢��������
 * @param	{Any}		��Ҫ�洢����������(�޴����򷵻ر���ѯ������)
 */
artDialog.data = function (name, value) {
	var top = artDialog.top,
		cache = top[_data] || {};
	top[_data] = cache;
	
	if (value !== undefined) {
		cache[name] = value;
	} else {
		return cache[name];
	};
	return cache;
};


/**
 * ���ݹ���ɾ���ӿ�
 * @param	{String}	ɾ����������
 */
artDialog.removeData = function (name) {
	var cache = artDialog.top[_data];
	if (cache && cache[name]) delete cache[name];
};


/** ������ͨ�Ի��� */
artDialog.through = _proxyDialog = function () {
	var api = _topDialog.apply(this, arguments);
		
	// ����ӵ�ǰ window������Ϊiframe���������п��ܶԻ���
	// �Ա��õ�ǰ window ж��ǰȥ�ر���Щ�Ի���
	// ��Ϊiframeע����Ҳ����ڴ���ɾ���䴴���Ķ����������Է�ֹ�ص���������
	if (_top !== window) artDialog.list[api.config.id] = api;
	return api;
};

// ���ҳ��ж��ǰ�ر����д�Խ�ĶԻ���
_top !== window && $(window).bind('unload', function () {
	var list = artDialog.list, config;
	for (var i in list) {
		if (list[i]) {
			config = list[i].config;
			if (config) config.duration = 0; // ȡ������
			list[i].close();
			//delete list[i];
		};
	};
});


/**
 * ���� (iframe)
 * @param	{String}	��ַ
 * @param	{Object}	���ò���. ���ﴫ��Ļص��������յĵ�1������Ϊiframe�ڲ�window����
 * @param	{Boolean}	�Ƿ���������. Ĭ��true
 */
artDialog.open = function (url, options, cache) {
	options = options || {};
	
	var api, DOM,
		$content, $main, iframe, $iframe, $idoc, iwin, ibody,
		top = artDialog.top,
		initCss = 'position:absolute;left:-9999em;top:-9999em;border:none 0;background:transparent',
		loadCss = 'width:100%;height:100%;border:none 0';
	if (cache === false) {
		var ts = + new Date,
			ret = url.replace(/([?&])_=[^&]*/, "$1_=" + ts );
		url = ret + ((ret === url) ? (/\?/.test(url) ? "&" : "?") + "_=" + ts : "");
	};
		
	var load = function () {
		var iWidth, iHeight,
			loading = DOM.content.find('.aui_loading'),
			aConfig = api.config;
		
		$content.addClass('aui_state_full');
		
		loading && loading.hide();
		
		try {
			iwin = iframe.contentWindow;
			$idoc = $(iwin.document);
			ibody = iwin.document.body;
		} catch (e) {// ����
			iframe.style.cssText = loadCss;
			
			aConfig.follow
			? api.follow(aConfig.follow)
			: api.position(aConfig.left, aConfig.top);
			
			options.init && options.init.call(api, iwin, top);
			options.init = null;
			return;
		};
		
		// ��ȡiframe�ڲ��ߴ�
		iWidth = aConfig.width === 'auto'
		? $idoc.width() + (_isIE6 ? 0 : parseInt($(ibody).css('marginLeft')))
		: aConfig.width;
		
		iHeight = aConfig.height === 'auto'
		? $idoc.height()
		: aConfig.height;
		
		// ��Ӧiframe�ߴ�
		setTimeout(function () {
			iframe.style.cssText = loadCss;
		}, 0);// setTimeout: ��ֹIE6~7�Ի�����ʽ��Ⱦ�쳣
		api.size(iWidth, iHeight);
		
		// �����Ի���λ��
		aConfig.follow
		? api.follow(aConfig.follow)
		: api.position(aConfig.left, aConfig.top);
		
		options.init && options.init.call(api, iwin, top);
		options.init = null;
	};
		
	var config = {
		zIndex: _zIndex(),
		init: function () {
			api = this;
			DOM = api.DOM;
			$main = DOM.main;
			$content = DOM.content;
			
			iframe = api.iframe = top.document.createElement('iframe');
			iframe.src = url;
			iframe.name = 'Open' + api.config.id;
			iframe.style.cssText = initCss;
			iframe.setAttribute('frameborder', 0, 0);
			iframe.setAttribute('allowTransparency', true);
			
			$iframe = $(iframe);
			api.content().appendChild(iframe);
			iwin = iframe.contentWindow;
		//	$(".aui_outer").show();	 //����
			try {
				iwin.name = iframe.name;
				artDialog.data(iframe.name + _open, api);
				artDialog.data(iframe.name + _opener, window);
			} catch (e) {};
			
			$iframe.bind('load', load);
		},
		close: function () {
			$iframe.css('display', 'none').unbind('load', load);

			if (options.close && options.close.call(this, iframe.contentWindow, top) === false) {
				return false;
			};
			$content.removeClass('aui_state_full');
			
			// ��Ҫ����Ҫ����iframe��ַ�������´γ��ֵĶԻ�����IE6��7�޷��۽�input
			// IEɾ��iframe��iframe��Ȼ�������ڴ��г����������⣬�û�src�������׽���ķ���
			$iframe[0].src = 'about:blank';
			$iframe.remove();
		//	$(".aui_outer").hide();//����
			try {
				artDialog.removeData(iframe.name + _open);
				artDialog.removeData(iframe.name + _opener);
			} catch (e) {};
		}
	};
	
	// �ص�������һ������ָ��iframe�ڲ�window����
	if (typeof options.ok === 'function') config.ok = function () {
		return options.ok.call(api, iframe.contentWindow, top);
	};
	if (typeof options.cancel === 'function') config.cancel = function () {
		return options.cancel.call(api, iframe.contentWindow, top);
	};
	
	delete options.content;

	for (var i in options) {
		if (config[i] === undefined) config[i] = options[i];
	};
	
	return _proxyDialog(config);
};


/** ����open������չ����(��open�򿪵�iframe�ڲ�˽�з���) */
artDialog.open.api = artDialog.data(_winName + _open);


/** ����open����������Դҳ��window(��open�򿪵�iframe�ڲ�˽�з���) */
artDialog.opener = artDialog.data(_winName + _opener) || window;
artDialog.open.origin = artDialog.opener; // ����v4.1֮ǰ�汾��δ���汾��ɾ����

/** artDialog.open �򿪵�iframeҳ����رնԻ����ݷ��� */
artDialog.close = function () {
	var api = artDialog.data(_winName + _open);
	api && api.close();
	return false;
};

// ���iframe�����л����Ӹ߶�
_top != window && $(document).bind('mousedown', function () {
	var api = artDialog.open.api;
	api && api.zIndex();
});


/**
 * Ajax�������
 * @param	{String}			��ַ
 * @param	{Object}			���ò���
 * @param	{Boolean}			�Ƿ���������. Ĭ��true
 */
artDialog.load = function(url, options, cache){
	cache = cache || false;
	var opt = options || {};
		
	var config = {
		zIndex: _zIndex(),
		init: function(here){
			var api = this,
				aConfig = api.config;
			
			$.ajax({
				url: url,
				success: function (content) {
					api.content(content);
					opt.init && opt.init.call(api, here);		
				},
				cache: cache
			});
			
		}
	};
	
	delete options.content;
	
	for (var i in opt) {
		if (config[i] === undefined) config[i] = opt[i];
	};
	
	return _proxyDialog(config);
};


/**
 * ����
 * @param	{String}	��Ϣ����
 */
artDialog.alert = function (content, callback) {
	return _proxyDialog({
		id: 'Alert',
		zIndex: _zIndex(),
		icon: 'warning',
		fixed: true,
		lock: true,
		content: content,
		ok: true,
		close: callback
	});
};


/**
 * ȷ��
 * @param	{String}	��Ϣ����
 * @param	{Function}	ȷ����ť�ص�����
 * @param	{Function}	ȡ����ť�ص�����
 */
artDialog.confirm = function (content, yes, no) {
	return _proxyDialog({
		id: 'Confirm',
		zIndex: _zIndex(),
		icon: 'question',
		fixed: true,
		lock: true,
		opacity: .7,
		content: content,
		ok: function (here) {
			return yes.call(this, here);
		},
		cancel: function (here) {
			return no && no.call(this, here);
		}
	});
};


/**
 * ����
 * @param	{String}	��������
 * @param	{Function}	�ص�����. ���ղ���������ֵ
 * @param	{String}	Ĭ��ֵ
 */
artDialog.prompt = function (content, yes, value) {
	value = value || '';
	var input;
	
	return _proxyDialog({
		id: 'Prompt',
		zIndex: _zIndex(),
		icon: 'question',
		fixed: true,
		lock: true,
		opacity: .1,
		content: [
			'<div style="margin-bottom:5px;font-size:12px">',
				content,
			'</div>',
			'<div>',
				'<input value="',
					value,
				'" style="width:18em;padding:6px 4px" />',
			'</div>'
			].join(''),
		init: function () {
			input = this.DOM.content.find('input')[0];
			input.select();
			input.focus();
		},
		ok: function (here) {
			return yes && yes.call(this, input.value, here);
		},
		cancel: true
	});
};


/**
 * ������ʾ
 * @param	{String}	��ʾ����
 * @param	{Number}	��ʾʱ�� (Ĭ��1.5��)
 */
artDialog.tips = function (content, time) {
	return _proxyDialog({
		id: 'Tips',
		zIndex: _zIndex(),
		title: false,
		cancel: false,
		fixed: true,
		lock: false
	})
	.content('<div style="padding: 0 1em;">' + content + '</div>')
	.time(time || 1.5);
};
/**
 * ������ʾ,�������ӵĺ���
 * @param	{String}	��ʾ����
 * @param	{Number}	��ʾʱ�� (Ĭ��1.5��)
 */
artDialog.tips = function (content, time,ico,callback) {
	return _proxyDialog({
		id: 'Tips',
		zIndex: _zIndex(),
		title: false,
		cancel: false,
		fixed: true,
		lock: false,
		close: callback
	})
	.content('<div style="padding: 0 1em;">' + content + '</div>')
	.time(time || 1.5);
};

// ��ǿartDialog��ק����
// - ��ֹ�������iframe���²�����
// - �Գ���Ի����϶��Ż�
$(function () {
	var event = artDialog.dragEvent;
	if (!event) return;

	var $window = $(window),
		$document = $(document),
		positionType = _isIE6 ? 'absolute' : 'fixed',
		dragEvent = event.prototype,
		mask = document.createElement('div'),
		style = mask.style;
		
	style.cssText = 'display:none;position:' + positionType + ';left:0;top:0;width:100%;height:100%;'
	+ 'cursor:move;filter:alpha(opacity=0);opacity:0;background:#FFF';
		
	document.body.appendChild(mask);
	dragEvent._start = dragEvent.start;
	dragEvent._end = dragEvent.end;
	
	dragEvent.start = function () {
		var DOM = artDialog.focus.DOM,
			main = DOM.main[0],
			iframe = DOM.content[0].getElementsByTagName('iframe')[0];
		
		dragEvent._start.apply(this, arguments);
		style.display = 'block';
		style.zIndex = artDialog.defaults.zIndex + 3;
		
		if (positionType === 'absolute') {
			style.width = $window.width() + 'px';
			style.height = $window.height() + 'px';
			style.left = $document.scrollLeft() + 'px';
			style.top = $document.scrollTop() + 'px';
		};
		
		if (iframe && main.offsetWidth * main.offsetHeight > 307200) {
			main.style.visibility = 'hidden';
		};
	};
	
	dragEvent.end = function () {
		var dialog = artDialog.focus;
		dragEvent._end.apply(this, arguments);
		style.display = 'none';
		if (dialog) dialog.DOM.main[0].style.visibility = 'visible';
	};
});

})(this.art || this.jQuery, this, this.artDialog);

