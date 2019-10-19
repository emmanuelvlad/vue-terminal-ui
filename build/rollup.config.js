import commonjs from "rollup-plugin-commonjs";
import vue from "rollup-plugin-vue";
import buble from "rollup-plugin-buble";
import cleanup from 'rollup-plugin-cleanup';

export default
	[
		{
			input: "src/main.js",
			output: {
				file: "dist/vue-terminal-ui.js",
				name: "VueTerminalUI"
			},
			plugins: [
				commonjs(),
				vue(),
				buble(),
				cleanup(),
			]
		}
	];