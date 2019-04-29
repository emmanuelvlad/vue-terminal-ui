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
       _                                                
 __   |_ ._ _  ._ _   _. ._       _  |   \\  / |  _.  _| 
      |_ | | | | | | (_| | | |_| (/_ |    \\/  | (_| (_| `;
				
			this.terminal.$emit("write", credit);
		},

	},
};
</script>
