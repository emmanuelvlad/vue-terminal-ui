//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script = {
	//
	// Name
	//
	name: "VueTerminalUI",

	//
	// Data
	//
	data: function () {
		return {
			input: "",
			history: [],
			commandsHistory: [],
			commandsHistoryIndex: 0,
			savedInput: "",
			cursorIndex: 0,
			limit: 255
		};
	},

	//
	// Props
	//
	props: {
		prefix: {
			type: String,
			default: ""
		},
	},

	//
	// Methods
	//
	methods: {

		write: function write(content, prefix) {
			var this$1 = this;
			if ( prefix === void 0 ) prefix = false;

			var parsed = String(content).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;");
			var obj = {
				prefix: (prefix) ? this.prefix : "",
				content: parsed
			};
			new Promise(function (res) {
				this$1.history.push(obj);
				res();
			}).then(function () {
				this$1.$refs.text.scrollIntoView(false);
			});
		},

		inputSend: function inputSend() {
			var input = this.input;
			this.write(input, true);
			this.updateInput("");
			this.savedInput = "";
			this.commandsHistoryIndex = 0;
			this.setCursor(0);
			this.commandsHistory.unshift(input);
			this.$emit("triggerCommand", input);
		},

		pasteText: function pasteText(raw) {
			var text = raw.replace(/\t/g, "");
			if (this.input.length >= this.limit) { return; }
			if (this.input.length + text.length >= this.limit) { text = text.substring(0, this.limit - this.input.length); }
			var index = (this.cursorIndex === 0) ? this.input.length : this.cursorIndex;
			var str = this.input;
			this.updateInput(str.substring(0, index - 1) + text + str.substring(index - 1, str.length));
			this.updateCursor(text.length);
		},

		setCursor: function setCursor(index) {
			var this$1 = this;

			var getRef = function (i) {
				return this$1.$refs[("input-" + i)][0] || this$1.$refs[("input-" + i)];
			};

			if (!getRef(index)) { return; }

			getRef(this.cursorIndex).className = "";
			getRef(index).className = "cursor";
			this.cursorIndex = index;
		},

		updateInput: function updateInput(str) {
			this.input = str;
			this.$emit("update:input", str);
		},

		updateCursor: function updateCursor(nb) {
			var predict = this.cursorIndex + nb;
			var index = this.cursorIndex;

			// If at the of the initial position 
			if (this.cursorIndex === 0) {
				index = (predict === -1) ? this.input.length : 0;
			}
			// If at the end of input then go to the initial cursor index
			else if (predict > this.input.length) {
				index = 0;
			}
			// If at the beggining of the input, stays here
			else if (predict < 1) {
				index = 1;
			} else {
				index += nb;
			}

			this.setCursor(index);
		},

		handleKey: function handleKey(e) {
			var this$1 = this;

			var keyCode = e.keyCode;
			var printable = 
				(keyCode > 47 && keyCode < 58)   || // number keys
				keyCode == 32 || keyCode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
				(keyCode > 64 && keyCode < 91)   || // letter keys
				(keyCode > 95 && keyCode < 112)  || // numpad keys
				(keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
				(keyCode > 218 && keyCode < 223);   // [\]' (in order)
			// console.log(e);
			// ctrl-C
			if (e.ctrlKey && keyCode === 67) {
				this.inputSend(false);
			}
			// meta-V
			else if (e.metaKey && keyCode === 86) {
				navigator.clipboard.readText().then(function (text) { this$1.pasteText(text); });
			}
			// meta-C
			else if (e.metaKey) {
				return;
			}
			// Enter
			else if (keyCode === 13) {
				this.inputSend();
			}
			// Backspakce
			else if (keyCode === 8 || keyCode === 46) {
				var backward = (keyCode === 46) ? 0 : 1;
				var index = (this.cursorIndex === 0) ? this.input.length : this.cursorIndex - backward;
				var str = this.input;
				var part1 = str.substring(0, index - 1);
				var part2 = str.substring(index, str.length);
				this.updateInput(part1 + part2);

				if (this.cursorIndex === 0) {
					this.setCursor(0);
				} else {
					this.updateCursor(-backward);
				}
			}
			// Arrow
			else if (keyCode === 37 || keyCode === 39) {
				this.updateCursor((keyCode === 37) ? -1 : 1);
			}
			// Arrow up
			else if (keyCode === 38) {
				var length = this.commandsHistory.length;
				if (!length) { return; }
				if (this.commandsHistoryIndex + 1 > length) { this.commandsHistoryIndex = length; }
				else { this.commandsHistoryIndex++; }
				this.updateInput(this.commandsHistory[this.commandsHistoryIndex - 1]);
				this.setCursor(0);
			}
			// Arrow down
			else if (keyCode === 40) {
				if (this.commandsHistoryIndex - 1 <= 0) {
					this.commandsHistoryIndex = 0;
					this.updateInput(this.savedInput);
				}
				else { this.updateInput(this.commandsHistory[--this.commandsHistoryIndex - 1]); }
				this.setCursor(0);
			}
			// Other
			else if (printable) {
				if (this.input.length >= this.limit) { return; }
				var index$1 = (this.cursorIndex === 0) ? this.input.length : this.cursorIndex - 1;
				var input = this.input.substring(0, index$1) + e.key + this.input.substring(index$1, this.input.length);

				this.updateInput(input);
				if (this.commandsHistoryIndex > 0) { this.commandsHistory[this.commandsHistoryIndex - 1] = input; }
				else { this.savedInput = input; }
				this.updateCursor(1);
			}
		}
	},

	//
	// Created
	//
	created: function created() {
		var this$1 = this;

		window.addEventListener("keydown", function (e) {
			this$1.handleKey(e);
		});

		this.$on("write", function (line) {
			this$1.write(line);
		});

		this.$on("clearHistory", function () {
			this$1.history = [];
		});
	}
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) { style.element.setAttribute('media', css.media); }
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) { style.element.removeChild(nodes[index]); }
      if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "vue-terminal-container" }, [
    _c(
      "div",
      {
        ref: "terminal",
        attrs: { id: "terminal" },
        on: {
          keyup: function($event) {
            if (!$event.ctrlKey) {
              return null
            }
            return _vm.handleKey($event)
          }
        }
      },
      [
        _c(
          "div",
          { attrs: { id: "history" } },
          _vm._l(_vm.history, function(obj, key) {
            return _c("div", { key: key, staticClass: "line" }, [
              obj.prefix
                ? _c("span", { staticClass: "prefix" }, [
                    _vm._v(_vm._s(obj.prefix) + " ")
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c("span", { domProps: { innerHTML: _vm._s(obj.content) } })
            ])
          }),
          0
        ),
        _vm._v(" "),
        _c("div", { ref: "text", attrs: { id: "text" } }, [
          _vm.prefix
            ? _c("div", { staticClass: "prefix" }, [
                _vm._v("\n\t\t\t\t" + _vm._s(_vm.prefix) + " \n\t\t\t")
              ])
            : _vm._e(),
          _vm._v(" "),
          _c(
            "div",
            { attrs: { id: "input" } },
            [
              _vm._l(_vm.input, function(char, key) {
                return _c(
                  "span",
                  { key: key, ref: "input-" + (key + 1), refInFor: true },
                  [_vm._v(_vm._s(char === " " ? " " : char))]
                )
              }),
              _vm._v(" "),
              _c("span", { ref: "input-0", staticClass: "cursor" }, [
                _vm._v(" ")
              ])
            ],
            2
          )
        ])
      ]
    )
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-4eb633ac_0", { source: "\n.vue-terminal-container[data-v-4eb633ac] {\n    position: absolute;\n\t\theight: 100vh;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    overflow: auto;\n}\n#terminal[data-v-4eb633ac] {\n\t\theight: 100%;\n\t\toverflow-x: hidden;\n\t\tbackground-color: #292a35;\n\t\tcolor: #fff;\n\t\tfont-family: monospace;\n\t\tpadding: 0;\n\t\tmargin: 0;\n}\n.prefix[data-v-4eb633ac] {\n\t\tfloat: left;\n}\n#input[data-v-4eb633ac], .line[data-v-4eb633ac] {\n\t\tword-break: break-all;\n\t\tmin-height: 1.2em;\n}\nlabel[data-v-4eb633ac] {\n\t\tdisplay: inline-block;\n}\nsection[data-v-4eb633ac] {\n\t\tmargin: 2rem 0;\n}\n#input .cursor[data-v-4eb633ac] {\n\t\tbackground: #c7c7c7;\n\t\tcolor: #111;\n}\n\n", map: {"version":3,"sources":["/mnt/e/Project/git/vue-terminal/src/VueTerminalUI.vue"],"names":[],"mappings":";AAkQA;IACA,kBAAA;EACA,aAAA;IACA,MAAA;IACA,SAAA;IACA,OAAA;IACA,QAAA;IACA,cAAA;AACA;AAEA;EACA,YAAA;EACA,kBAAA;EACA,yBAAA;EACA,WAAA;EACA,sBAAA;EACA,UAAA;EACA,SAAA;AACA;AAEA;EACA,WAAA;AACA;AAEA;EACA,qBAAA;EACA,iBAAA;AACA;AAEA;EACA,qBAAA;AACA;AAEA;EACA,cAAA;AACA;AAEA;EACA,mBAAA;EACA,WAAA;AACA","file":"VueTerminalUI.vue","sourcesContent":["<template>\n\t<div class=\"vue-terminal-container\">\n\t\t<div\n\t\t\tid=\"terminal\"\n\t\t\t@keyup.ctrl=\"handleKey\"\n\t\t\tref=\"terminal\">\n\n\t\t\t<!-- History -->\n\t\t\t<div id=\"history\">\n\t\t\t\t<div\n\t\t\t\t\tv-for=\"(obj, key) in history\"\n\t\t\t\t\t:key=\"key\"\n\t\t\t\t\tclass=\"line\">\n\t\t\t\t\t<span\n\t\t\t\t\t\tv-if=\"obj.prefix\"\n\t\t\t\t\t\tclass=\"prefix\">{{ obj.prefix }}&nbsp;</span>\n\t\t\t\t\t<span v-html=\"obj.content\" />\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<!-- Bottom -->\n\t\t\t<div\n\t\t\t\tid=\"text\"\n\t\t\t\tref=\"text\">\n\t\t\t\t<div\n\t\t\t\t\tv-if=\"prefix\"\n\t\t\t\t\tclass=\"prefix\">\n\t\t\t\t\t{{ prefix }}&nbsp;\n\t\t\t\t</div>\n\n\t\t\t\t<div id=\"input\">\n\n\t\t\t\t\t<span\n\t\t\t\t\t\tv-for=\"(char, key) in input\"\n\t\t\t\t\t\t:key=\"key\"\n\t\t\t\t\t\t:ref=\"`input-${key + 1}`\"\n\t\t\t\t\t\tclass=\"\">{{ (char === \" \") ? \"&nbsp;\" : char }}</span>\n\t\t\t\t\t<span\n\t\t\t\t\t\tref=\"input-0\"\n\t\t\t\t\t\tclass=\"cursor\">&nbsp;</span>\n\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t</div>\n\t</div>\n</template>\n\n\n<script>\nexport default {\n\t//\n\t// Name\n\t//\n\tname: \"VueTerminalUI\",\n\n\t//\n\t// Data\n\t//\n\tdata: () => {\n\t\treturn {\n\t\t\tinput: \"\",\n\t\t\thistory: [],\n\t\t\tcommandsHistory: [],\n\t\t\tcommandsHistoryIndex: 0,\n\t\t\tsavedInput: \"\",\n\t\t\tcursorIndex: 0,\n\t\t\tlimit: 255\n\t\t};\n\t},\n\n\t//\n\t// Props\n\t//\n\tprops: {\n\t\tprefix: {\n\t\t\ttype: String,\n\t\t\tdefault: \"\"\n\t\t},\n\t},\n\n\t//\n\t// Methods\n\t//\n\tmethods: {\n\n\t\twrite(content, prefix = false) {\n\t\t\tlet parsed = String(content).replace(/</g, \"&lt;\").replace(/>/g, \"&gt;\").replace(/ /g, \"&nbsp;\");\n\t\t\tlet obj = {\n\t\t\t\tprefix: (prefix) ? this.prefix : \"\",\n\t\t\t\tcontent: parsed\n\t\t\t};\n\t\t\tnew Promise(res => {\n\t\t\t\tthis.history.push(obj);\n\t\t\t\tres();\n\t\t\t}).then(() => {\n\t\t\t\tthis.$refs.text.scrollIntoView(false);\n\t\t\t});\n\t\t},\n\n\t\tinputSend() {\n\t\t\tlet input = this.input;\n\t\t\tthis.write(input, true);\n\t\t\tthis.updateInput(\"\");\n\t\t\tthis.savedInput = \"\";\n\t\t\tthis.commandsHistoryIndex = 0;\n\t\t\tthis.setCursor(0);\n\t\t\tthis.commandsHistory.unshift(input);\n\t\t\tthis.$emit(\"triggerCommand\", input);\n\t\t},\n\n\t\tpasteText(raw) {\n\t\t\tlet text = raw.replace(/\\t/g, \"\");\n\t\t\tif (this.input.length >= this.limit) return;\n\t\t\tif (this.input.length + text.length >= this.limit) text = text.substring(0, this.limit - this.input.length);\n\t\t\tlet index = (this.cursorIndex === 0) ? this.input.length : this.cursorIndex;\n\t\t\tlet str = this.input;\n\t\t\tthis.updateInput(str.substring(0, index - 1) + text + str.substring(index - 1, str.length));\n\t\t\tthis.updateCursor(text.length);\n\t\t},\n\n\t\tsetCursor(index) {\n\t\t\tconst getRef = (i) => {\n\t\t\t\treturn this.$refs[`input-${i}`][0] || this.$refs[`input-${i}`];\n\t\t\t};\n\n\t\t\tif (!getRef(index)) return;\n\n\t\t\tgetRef(this.cursorIndex).className = \"\";\n\t\t\tgetRef(index).className = \"cursor\";\n\t\t\tthis.cursorIndex = index;\n\t\t},\n\n\t\tupdateInput(str) {\n\t\t\tthis.input = str;\n\t\t\tthis.$emit(\"update:input\", str);\n\t\t},\n\n\t\tupdateCursor(nb) {\n\t\t\tlet predict = this.cursorIndex + nb;\n\t\t\tlet index = this.cursorIndex;\n\n\t\t\t// If at the of the initial position \n\t\t\tif (this.cursorIndex === 0) {\n\t\t\t\tindex = (predict === -1) ? this.input.length : 0;\n\t\t\t}\n\t\t\t// If at the end of input then go to the initial cursor index\n\t\t\telse if (predict > this.input.length) {\n\t\t\t\tindex = 0;\n\t\t\t}\n\t\t\t// If at the beggining of the input, stays here\n\t\t\telse if (predict < 1) {\n\t\t\t\tindex = 1;\n\t\t\t} else {\n\t\t\t\tindex += nb;\n\t\t\t}\n\n\t\t\tthis.setCursor(index);\n\t\t},\n\n\t\thandleKey(e) {\n\t\t\tconst keyCode = e.keyCode;\n\t\t\tconst printable = \n\t\t\t\t(keyCode > 47 && keyCode < 58)   || // number keys\n\t\t\t\tkeyCode == 32 || keyCode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)\n\t\t\t\t(keyCode > 64 && keyCode < 91)   || // letter keys\n\t\t\t\t(keyCode > 95 && keyCode < 112)  || // numpad keys\n\t\t\t\t(keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)\n\t\t\t\t(keyCode > 218 && keyCode < 223);   // [\\]' (in order)\n\t\t\t// console.log(e);\n\t\t\t// ctrl-C\n\t\t\tif (e.ctrlKey && keyCode === 67) {\n\t\t\t\tthis.inputSend(false);\n\t\t\t}\n\t\t\t// meta-V\n\t\t\telse if (e.metaKey && keyCode === 86) {\n\t\t\t\tnavigator.clipboard.readText().then(text => { this.pasteText(text); });\n\t\t\t}\n\t\t\t// meta-C\n\t\t\telse if (e.metaKey) {\n\t\t\t\treturn;\n\t\t\t}\n\t\t\t// Enter\n\t\t\telse if (keyCode === 13) {\n\t\t\t\tthis.inputSend();\n\t\t\t}\n\t\t\t// Backspakce\n\t\t\telse if (keyCode === 8 || keyCode === 46) {\n\t\t\t\tlet backward = (keyCode === 46) ? 0 : 1;\n\t\t\t\tlet index = (this.cursorIndex === 0) ? this.input.length : this.cursorIndex - backward;\n\t\t\t\tlet str = this.input;\n\t\t\t\tlet part1 = str.substring(0, index - 1);\n\t\t\t\tlet part2 = str.substring(index, str.length);\n\t\t\t\tthis.updateInput(part1 + part2);\n\n\t\t\t\tif (this.cursorIndex === 0) {\n\t\t\t\t\tthis.setCursor(0);\n\t\t\t\t} else {\n\t\t\t\t\tthis.updateCursor(-backward);\n\t\t\t\t}\n\t\t\t}\n\t\t\t// Arrow\n\t\t\telse if (keyCode === 37 || keyCode === 39) {\n\t\t\t\tthis.updateCursor((keyCode === 37) ? -1 : 1);\n\t\t\t}\n\t\t\t// Arrow up\n\t\t\telse if (keyCode === 38) {\n\t\t\t\tlet length = this.commandsHistory.length;\n\t\t\t\tif (!length) return;\n\t\t\t\tif (this.commandsHistoryIndex + 1 > length) this.commandsHistoryIndex = length;\n\t\t\t\telse this.commandsHistoryIndex++;\n\t\t\t\tthis.updateInput(this.commandsHistory[this.commandsHistoryIndex - 1]);\n\t\t\t\tthis.setCursor(0);\n\t\t\t}\n\t\t\t// Arrow down\n\t\t\telse if (keyCode === 40) {\n\t\t\t\tif (this.commandsHistoryIndex - 1 <= 0) {\n\t\t\t\t\tthis.commandsHistoryIndex = 0;\n\t\t\t\t\tthis.updateInput(this.savedInput);\n\t\t\t\t}\n\t\t\t\telse this.updateInput(this.commandsHistory[--this.commandsHistoryIndex - 1]);\n\t\t\t\tthis.setCursor(0);\n\t\t\t}\n\t\t\t// Other\n\t\t\telse if (printable) {\n\t\t\t\tif (this.input.length >= this.limit) return;\n\t\t\t\tlet index = (this.cursorIndex === 0) ? this.input.length : this.cursorIndex - 1;\n\t\t\t\tlet input = this.input.substring(0, index) + e.key + this.input.substring(index, this.input.length);\n\n\t\t\t\tthis.updateInput(input);\n\t\t\t\tif (this.commandsHistoryIndex > 0) this.commandsHistory[this.commandsHistoryIndex - 1] = input;\n\t\t\t\telse this.savedInput = input;\n\t\t\t\tthis.updateCursor(1);\n\t\t\t}\n\t\t}\n\t},\n\n\t//\n\t// Created\n\t//\n\tcreated() {\n\t\twindow.addEventListener(\"keydown\", (e) => {\n\t\t\tthis.handleKey(e);\n\t\t});\n\n\t\tthis.$on(\"write\", line => {\n\t\t\tthis.write(line);\n\t\t});\n\n\t\tthis.$on(\"clearHistory\", () => {\n\t\t\tthis.history = [];\n\t\t});\n\t}\n};\n</script>\n\n<style scoped>\n\n\t.vue-terminal-container {\n    position: absolute;\n\t\theight: 100vh;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    overflow: auto;\n\t}\n\n\t#terminal {\n\t\theight: 100%;\n\t\toverflow-x: hidden;\n\t\tbackground-color: #292a35;\n\t\tcolor: #fff;\n\t\tfont-family: monospace;\n\t\tpadding: 0;\n\t\tmargin: 0;\n\t}\n\n\t.prefix {\n\t\tfloat: left;\n\t}\n\n\t#input, .line {\n\t\tword-break: break-all;\n\t\tmin-height: 1.2em;\n\t}\n\n\tlabel {\n\t\tdisplay: inline-block;\n\t}\n\n\tsection {\n\t\tmargin: 2rem 0;\n\t}\n\n\t#input .cursor {\n\t\tbackground: #c7c7c7;\n\t\tcolor: #111;\n\t}\n\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-4eb633ac";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var VueTerminalUI = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

var clear = {
	name: "CommandClear",
	methods: {
		clear: function clear() {
			this.history = [];
		}
	}
};

var pwd = {
	name: "CommandPwd",
	methods: {
		pwd: function pwd() {
			// console.log(this.findDir(this.workingDir));
			this.write(this.rootHierarchy[0].parent.name);
		}
	}
};

var whoami = {
	name: "CommandWhoami",
	methods: {
		whoami: function whoami(args) {
			if (args.length > 0) { this.write("usage: whoami"); }
			else { this.write(this.user); }
		}
	}
};

var secret = {
	name: "TerminalCommandSecret",
	methods: {
		secret: function secret() {
			this.write("Made with ❤ in London, UK - by @emmanuelvlad");
		}
	}
};

var Commands = {
	//
	// Name
	//
	name: "Commands",

	//
	// Mixins
	//
	mixins: [clear, pwd, whoami, secret],

	//
	// Methods
	//
	methods: {
		execute: function execute(input) {
			var args = input.trim().split(" ");
			if (!args[0]) { return; }

			if (typeof this[args[0]] === "function") { this[args[0]](args.slice(1)); }
			else { this.write(("sh: " + (args[0]) + ": command not found"), false); }
		}
	}
};

var Directory = {
	//
	// Name
	//
	name: "Directory",

	//
	// Data
	//
	data: function data() {
		return {
			currentDir: {},
			workingDir: "/",
			rootHierarchy: [
				{
					name: "root",
					directory: [
						{
							name: "hello.txt",
							permissions: 777,
							content: "hello"
						}
					],
					permissions: 777,
				}
			]
		};
	},

	//
	// Methods
	//
	methods: {

		cleanPath: function cleanPath(path) {
			return path.replace(/\/{2,}/, "/");
		},

		findDir: function findDir(raw) {
			var path = this.cleanPath(raw);
			var fromRoot = (path[0] === "/") ? true : false;
			var split = path.substring((fromRoot) ? 1 : 0, path.length).split("/");
			var index = 0;
			var find = (fromRoot) ? this.rootHierarchy : this.currentDir;

			for (; split.length > index; index++) {
				var next = find.find(function (el) { return el.name === split[index] && el.directory instanceof Array; });
				if (next && next.directory && (find = next.directory)) { continue; }
				else if (fromRoot && split.length === 1) { continue; }
				else { break; }
			}

			return (split.length === index) ? find : (split.length === 1 && fromRoot) ? true : false;
		},

		changeDir: function changeDir(str) {
			var dir = this.findDir(str);

			if (dir) { this.currentDir = dir; }
			else { return false; }
			var fromRoot = (str[0] === "/") ? true : false;

			var split = str.split("/");

			split.forEach();
		},

		applyParent: function applyParent(parent) {
			for (var i = 0; parent.length > i; i++) {
				parent[i].parent = parent;
				if (parent[i].directory) { parent[i] = this.applyParent(parent[i]); }
			}
			return parent;
		}
	},

	//
	// Created
	//
	created: function created() {
		this.rootHierarchy = this.applyParent(this.rootHierarchy);
		this.currentDir = this.rootHierarchy;
	}
};

//

var script$1 = {
	//
	// Name
	//
	name: "VueTerminal",

	mixins: [Commands, Directory],

	//
	// Components
	//
	components: {
		VueTerminalUI: VueTerminalUI
	},

	//
	// Props
	//
	props: {
		prefix: {
			type: String,
			default: ""
		},

		user: {
			type: String,
			default: "root"
		}
	},

	//
	// Methods
	//
	methods: {

		execute: function execute(command) {
			if (command === "test") {
				this.prefix = "hello@root:";
			}
			// TODO: do all the command execution
		},

	},
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("vue-terminal-ui", {
    ref: "terminal-ui",
    attrs: { prefix: _vm.prefix },
    on: { triggerCommand: _vm.execute }
  })
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  var __vue_inject_styles__$1 = undefined;
  /* scoped */
  var __vue_scope_id__$1 = undefined;
  /* module identifier */
  var __vue_module_identifier__$1 = undefined;
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VueTerminal = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

var main = { VueTerminal: VueTerminal, VueTerminalUI: VueTerminalUI };

export default main;
