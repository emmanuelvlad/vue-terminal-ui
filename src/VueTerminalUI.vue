<template>
	<div class="vue-terminal-container">
		<div
			id="terminal"
			@keyup.ctrl="handleKey"
			ref="terminal">

			<!-- History -->
			<div id="history">
				<div
					v-for="(obj, key) in history"
					:key="key"
					class="line">
					<span
						v-if="obj.prefix"
						class="prefix">{{ obj.prefix }}&nbsp;</span>
					<span v-html="obj.content" />
				</div>
			</div>

			<!-- Bottom -->
			<div
				id="text"
				ref="text">
				<div
					v-if="prefix"
					class="prefix">
					{{ prefix }}&nbsp;
				</div>

				<div id="input">

					<span
						v-for="(char, key) in input"
						:key="key"
						:ref="`input-${key + 1}`"
						class="">{{ (char === " ") ? "&nbsp;" : char }}</span>
					<span
						ref="input-0"
						class="cursor">&nbsp;</span>

				</div>
			</div>

		</div>
	</div>
</template>


<script>
export default {
	//
	// Name
	//
	name: "VueTerminalUI",

	//
	// Data
	//
	data: () => {
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

		write(content, prefix = false) {
			let parsed = String(content).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;");
			let obj = {
				prefix: (prefix) ? this.prefix : "",
				content: parsed
			};
			new Promise(res => {
				this.history.push(obj);
				res();
			}).then(() => {
				this.$refs.text.scrollIntoView(false);
			});
		},

		inputSend() {
			let input = this.input;
			this.write(input, true);
			this.updateInput("");
			this.savedInput = "";
			this.commandsHistoryIndex = 0;
			this.setCursor(0);
			this.commandsHistory.unshift(input);
			this.$emit("triggerCommand", input);
		},

		pasteText(raw) {
			let text = raw.replace(/\t/g, "");
			if (this.input.length >= this.limit) return;
			if (this.input.length + text.length >= this.limit) text = text.substring(0, this.limit - this.input.length);
			let index = (this.cursorIndex === 0) ? this.input.length : this.cursorIndex;
			let str = this.input;
			this.updateInput(str.substring(0, index - 1) + text + str.substring(index - 1, str.length));
			this.updateCursor(text.length);
		},

		setCursor(index) {
			const getRef = (i) => {
				return this.$refs[`input-${i}`][0] || this.$refs[`input-${i}`];
			};

			if (!getRef(index)) return;

			getRef(this.cursorIndex).className = "";
			getRef(index).className = "cursor";
			this.cursorIndex = index;
		},

		updateInput(str) {
			this.input = str;
			this.$emit('update:input', str);
		},

		updateCursor(nb) {
			let predict = this.cursorIndex + nb;
			let index = this.cursorIndex;

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

		handleKey(e) {
			const keyCode = e.keyCode;
			const printable = 
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
				navigator.clipboard.readText().then(text => { this.pasteText(text); });
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
				let backward = (keyCode === 46) ? 0 : 1;
				let index = (this.cursorIndex === 0) ? this.input.length : this.cursorIndex - backward;
				let str = this.input;
				let part1 = str.substring(0, index - 1);
				let part2 = str.substring(index, str.length);
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
				let length = this.commandsHistory.length;
				if (!length) return;
				if (this.commandsHistoryIndex + 1 > length) this.commandsHistoryIndex = length;
				else this.commandsHistoryIndex++;
				this.updateInput(this.commandsHistory[this.commandsHistoryIndex - 1]);
				this.setCursor(0);
			}
			// Arrow down
			else if (keyCode === 40) {
				if (this.commandsHistoryIndex - 1 <= 0) {
					this.commandsHistoryIndex = 0;
					this.updateInput(this.savedInput);
				}
				else this.updateInput(this.commandsHistory[--this.commandsHistoryIndex - 1]);
				this.setCursor(0);
			}
			// Other
			else if (printable) {
				if (this.input.length >= this.limit) return;
				let index = (this.cursorIndex === 0) ? this.input.length : this.cursorIndex - 1;
				let input = this.input.substring(0, index) + e.key + this.input.substring(index, this.input.length);

				this.updateInput(input);
				if (this.commandsHistoryIndex > 0) this.commandsHistory[this.commandsHistoryIndex - 1] = input;
				else this.savedInput = input;
				this.updateCursor(1);
			}
		}
	},

	//
	// Created
	//
	created() {
		window.addEventListener("keydown", (e) => {
			this.handleKey(e);
		});

		this.$on("write", line => {
			this.write(line);
		})
	}
};
</script>

<style scoped>

	.vue-terminal-container {
    position: absolute;
		height: 100vh;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
	}

	#terminal {
		height: 100%;
		overflow-x: hidden;
		background-color: #292a35;
		color: #fff;
		font-family: monospace;
		padding: 0;
		margin: 0;
	}

	.prefix {
		float: left;
	}

	#input, .line {
		word-break: break-all;
		min-height: 1.2em;
	}

	label {
		display: inline-block;
	}

	section {
		margin: 2rem 0;
	}

	#input .cursor {
		background: #c7c7c7;
		color: #111;
	}

</style>
