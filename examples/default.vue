<template>
	<vue-terminal-ui
		ref="terminal-ui"
		:prefix="prefix"
		@triggerCommand="execute" />
</template>


<script>
/* eslint-disable */
// import { VueTerminalUI } from "@evlad/vue-terminal"
import VueTerminalUI from "../src/VueTerminalUI.vue";
import { setTimeout } from 'timers';

export default {
	//
	// Name
	//
	name: "DefaultExample",

	//
	// Components
	//
	components: {
		"vue-terminal-ui": VueTerminalUI
	},

	//
	// Data
	//
	data: () => ({
		prefix: ""
	}),

	//
	// Computed
	//
	computed: {
		terminal() {
			return this.$refs["terminal-ui"];
		}
	},

	//
	// Methods
	//
	methods: {

		execute(command, args) {
			switch (command) {
				case "setprefix":
					let newPrefix = (args[0][0] === '"' && args[0][args[0].length - 1] === '"') ?
						args[0].slice(1, args[0].length - 1) : args[0];
					this.prefix = newPrefix;
					break;
				case "credits":
					this.printCredits();
					break;
				case "clear":
					this.terminal.$emit("clearHistory");
					break;
				default:
					this.terminal.$emit("write", `command not found: ${command}`);
			}
		},

		// Printing the credits ...
		printCredits() {
			let credit = `
 dP""b8 88""Yb 888888 8888b.  88 888888 .dP"Y8                                                                   
dP   \`" 88__dP 88__    8I  Yb 88   88   \`Ybo."                                                                   
Yb      88"Yb  88""    8I  dY 88   88   o.\`Y8b                                                                   
 YboodP 88  Yb 888888 8888Y"  88   88   8bodP'

       _                                                
 __   |_ ._ _  ._ _   _. ._       _  |   \\  / |  _.  _| 
      |_ | | | | | | (_| | | |_| (/_ |    \\/  | (_| (_| `;
				
			this.terminal.$emit("write", credit);
		},

	},
};
</script>
