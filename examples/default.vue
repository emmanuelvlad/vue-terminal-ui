<template>
	<vue-terminal-ui
		ref="terminal-ui"
		:prefix="prefix"
		@triggerCommand="execute" />
</template>


<script>
/* eslint-disable */
import VueTerminalUI from "../src/VueTerminalUI";

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
		"vue-terminal-ui": VueTerminalUI
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
