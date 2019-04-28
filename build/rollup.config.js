import commonjs from "rollup-plugin-commonjs";
import vue from "rollup-plugin-vue";
import buble from "rollup-plugin-buble";

export default 
[
	{
		input: "src/main.js",
		output: {
			file: "dist/vue-terminal.js",
			name: "VueTerminal"
		},
		plugins: [
			commonjs(),
			vue(),
			buble(),
		]
	}
];