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

export default {
	//
	// Name
	//
	name: "DefaultExample",

	//
	// Data
	//
	data: () => ({
		prefix: ""
	}),

	//
	// Components
	//
	components: {
		VueTerminalUI
	},

	//
	// Methods
	//
	methods: {

		execute(command) {
			let args = command.split(" ");

			switch (args[0]) {
				case "prefix":
					this.prefix = args[1];
					break;
				case "clear":
					this.$refs["terminal-ui"].$emit("clearHistory");
					break;
			}
		},

	},
};
</script>
