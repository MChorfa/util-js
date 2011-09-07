/*!
* Utilities
*
* A collection of useful utitilies
*
* @version	0.9
* @revision	6.1.11
*/
(function () {

	// an empty string
	var blank = this.blank = '';

	/*
	* Adds support for trim function like in php
	*
	* @param	String	character		(optional) you can pass in a character such as /
	* @return	String
	*/
	String.prototype.trim = function (character) {
		if (typeof character === 'undefined') {
			return this.replace(/^\s+|\s+$/g, blank);
		}
		if (character.substr(0, 1) !== '\\') {
			character = '\\' + character;
		}
		return this.replace(new RegExp('^' + character + '+|' + character + '+$', 'g'), blank);
	};


	/*
	* Create embed code for a flash file
	*
	* @param	Object	options		{ id: String, width: String, height: String, base: String, bgcolor: String, flashvars: String }
	* @return	String
	*/
	var embed = this.embed = function (options, retrn) {
		var html = '<object width="{width}" height="{height}" id="{id}" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"><param value="false" name="menu"/><param value="{bgcolor}" name="bgcolor"/><param value="{src}" name="src"/><param value="transparent" name="wmode"/><param value="{base}" name="base"/><param value="{flashvars}" name="flashvars"/><embed flashvars="{flashvars}" width="{width}" height="{height}" wmode="transparent" base="{base}" name="{id}" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer" bgcolor="{bgcolor}" menu="false" src="{src}"/></object>';
		var defaults = { id: 'FlashVideo', width: '100%', height: '100%', base: '/images/showcase/swf', bgcolor: '#ffffff', flashvars: blank },
			item;
		for (item in options) {
			if (options.hasOwnProperty(item)) {
				defaults[item] = options[item];
			}
		}
		for (item in defaults) {
			if (defaults.hasOwnProperty(item)) {
				html = html.replace(new RegExp('{' + item + '}', 'g'), defaults[item]);
			}
		}
		return html;
	};

	/*
	* Gets the true type of an object
	*
	* @param	mixed		item
	* @return	String
	*/
	var typeOf = this.typeOf = function (item) {
		var s = typeof item;
		if (s === 'object') {
			if (item instanceof Array) {
				s = 'array';
			}
			if (item === null) {
				s = 'null';
			}
		}
		return s;
	};

	/*
	* Adds support for inArray() like the php function
	* 
	* @param	String	string	The string to search for
	* @param	Array		array		The array to search in
	* @return	Bool
	*/
	var inArray = this.inArray = function (string, array) {
		var item;
		for (item in array) {
			if (array[item] === string) {
				return true;
			}
		}
		return false;
	};
	Array.prototype.inArray = function (string) {
		return inArray(string, this);
	};

	/*
	* Gets the current scroll position
	*
	* @return	Object	{ top: Int, left: Int }
	*/
	var scrollPosition = this.scrollPosition = function () {
		if (document.body && (document.body.scrollLeft || document.body.scrollTop)) { // DOM compliant
			return { top: document.body.scrollTop, left: document.body.scrollLeft };
		}
		else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) { //ie6
			return { top: document.documentElement.scrollTop, left: document.documentElement.scrollLeft };
		}
		return { top: 0, left: 0 };
	};

	/*
	* HTTP object with related functions
	*/
	var http = this.http = {

		/*
		* Adds a parameter to the URL passed in
		*
		* @param	String	url		The string url
		* @param	String	add		The parameter string to add: 'param1=this&param2=that'
		*/
		addParam: function (url, add) {
			return url + (url.lastIndexOf('?') === -1 ? '?' : '&') + ((add) ? add : blank);
		},

		/*
		* Gets a param from a serialized param string
		*
		* @param	String	param		The name of the param: 'param1'
		* @return	String
		*/
		param: function (key) {
			var params = this.getParams(),
				i;
			if (params === null) { // no params to return
				return null;
			}

			var arr = params.split('&'),
				result = [];

			for (i = arr.length - 1; i >= 0; i--) {
				var tmp = arr[i].split('='); result[tmp[0]] = tmp[1];
			}
			return result[key] || null;
		},

		/*
		* Gets a param from a serialized hash string
		*
		* @param	String	param		The name of the param: 'param1'
		* @return	String
		*/
		hash: function (key) {
			var hash = this.getHash(),
				i;
			if (hash === null) {
				return null;
			}

			var arr = hash.split('&'),
				result = [];

			for (i = arr.length - 1; i >= 0; i--) {
				var tmp = arr[i].split('='); result[tmp[0]] = tmp[1];
			}
			return result[key] || null;
		},

		/*
		* Gets the hash from the URL string
		*
		* @param	String	url		(optional) The URL string. Defaults to location.hash.
		*/
		getHash: function (url) {
			url = (typeof url !== 'undefined') ? url.substr(url.lastIndexOf('#')) : location.hash;
			return (url.length > 1) ? url.substr(1) : null;
		},

		/*
		* Gets all the params from the URL string
		*
		* @param	String	url		(optional) The URL string. Defaults to location.search.
		*/
		getParams: function (url) {
			url = (typeof url !== 'undefined') ? url.substr(url.lastIndexOf('?')) : location.search;
			return (url.length > 1) ? url.substr(1) : null;
		},

		/*
		* Gets the last URI field from URL string
		*
		* @requires	String.trim()
		*
		* @param	String	url		(optional) The URL string. Defaults to location.pathname.
		*/
		pageID: function (url) {
			url = url || location.pathname;
			url = '/' + url.toString().trim('/');
			return (url === '/') ? 'index' : url.substr(url.lastIndexOf('/') + 1);
		}
	};

	/*
	* An object holding browser info
	*
	* @requires	jQuery,	inArray(), String.trim()
	*/
	this.browser = {
		ff: jQuery.browser.mozilla,
		safari: jQuery.browser.safari && /Apple/.test(navigator.vendor),
		chrome: jQuery.browser.safari && /Google/.test(navigator.vendor),
		ie: jQuery.browser.msie,
		ie9: jQuery.browser.msie && jQuery.browser.version === 9,
		ie8: jQuery.browser.msie && jQuery.browser.version === 8,
		ie7: jQuery.browser.msie && jQuery.browser.version === 7,
		ie6: jQuery.browser.msie && jQuery.browser.version === 6,
		version: parseInt(jQuery.browser.version, 10),
		setClass: function (selector) {
			var css_class = blank,
				item;
			for (item in this) {
				if (this.hasOwnProperty(item) && this[item] === true && ['set_class', 'version'].inArray(item) !== true ) {
					css_class += item + ' ';
				}
			}
			jQuery(function () {
				jQuery(selector || 'body').addClass(css_class.trim());
			});
			return true;
		}
	};



}());

/* debug */
var dbug = {
  report: function(on) { on = on || true; if (on && typeof console == 'undefined') { window.onerror = function(msg, url, l) { err = "error: " + msg + "\nurl: " + url + "\nline: " + l; alert(err); return true } } else if (on == false) { window.onerror = null } return true },
  log: function(msg, label) { label = label || false; if (typeof console != 'undefined') { if (label) console.group(label); console.log(msg); if (label) console.groupEnd() } else alert(((label) ? label + ":\n\n" : blank) + util.source(msg)); return msg },
	source: function (obj, esc) {
    esc = esc || false;
    var types = { object: ['{ ', ' }'], array: ['[ ', ' ]'], string: ['', ''] }, type = this.typeOf(obj), output = blank;
    if (type == 'object') { for (var val in obj) { if (obj.hasOwnProperty(val)) output += val + ': ' + ((typeof obj[val] == 'string') ? '"' + obj[val].replace(/\"/g, '\\"') + '"' : obj[val]) + ', ' } }
    if (type == 'array') { for (i = 0; i < obj.length; i++) { output += obj[i] } }
    if (type == 'string') { output += obj + ', '; }
    output = types[type][0] + output.replace(/,\s$/, types[type][1]);
    return (esc) ? escape(output) : output;
  }
}
/* end debug */
/* cookie */
var cookie = { name: 'toshiba', expire: 90, expire_type: 'days', items: [] }
cookie.items[cookie.name] = cookie;
cookie.add = function (obj) {
  obj.name = obj.name || cookie.name, obj.expire = obj.expire || cookie.expire, obj.expire_type = obj.expire_type || cookie.expire_type;
  cookie.items[obj.name] = obj;
  if (obj.value) { cookie.set(obj.name, obj.value); }
  return obj;
}
cookie.destroy = function (nm) { nm = nm || cookie.name; if (cookie.exists(nm)) { document.cookie = nm + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;'; } return !cookie.exists(nm); }
cookie.isset = function(nm) { return cookie.items[nm] != null }
cookie.exists = function(nm) { return (document.cookie.length > 0 && document.cookie.indexOf(nm + '=') != -1) }
cookie._get_info = function(nm) { return (cookie.isset(nm)) ? cookie.items[nm] : null }
cookie.get = function (nm) {
  nm = nm || cookie.name;
  if (cookie.exists(nm)) {
    var cs = document.cookie.indexOf(nm + '=') + nm.length + 1, ce = document.cookie.indexOf(';', cs);
    if (ce == -1) { ce = document.cookie.length; }
    return unescape(document.cookie.substring(cs, ce));
  }
  return null;
}
cookie.set = function (nm, v) {
  if (!v) { v = nm, nm = cookie.name; }
  var ck = cookie._get_info(nm), dt = new Date();
  if (ck.expire_type == 'hours') { dt.setHours(dt.getHours() + ck.expire); }
  else { dt.setHours(dt.getHours() + (ck.expire * 24)); }
  document.cookie = ck.name + '=' + escape(v) + '; expires=' + dt.toGMTString();
  return true;
}
/* end cookie */