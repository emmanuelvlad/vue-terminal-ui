(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('src/VueTerminal'), require('src/VueTerminalUI')) :
	typeof define === 'function' && define.amd ? define(['exports', 'src/VueTerminal', 'src/VueTerminalUI'], factory) :
	(global = global || self, factory(global.VueTerminal = {}, global.VueTerminal, global.VueTerminalUI));
}(this, function (exports, VueTerminal, VueTerminalUI) { 'use strict';

	VueTerminal = VueTerminal && VueTerminal.hasOwnProperty('default') ? VueTerminal['default'] : VueTerminal;
	VueTerminalUI = VueTerminalUI && VueTerminalUI.hasOwnProperty('default') ? VueTerminalUI['default'] : VueTerminalUI;



	exports.VueTerminal = VueTerminal;
	exports.VueTerminalUI = VueTerminalUI;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
