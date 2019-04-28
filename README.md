# Vue terminal

## VueTerminalUI
### Template
```html
<vue-terminal-ui
	ref="my-terminal-ui"
  prefix="user@host:"
  @triggerCommand="doSomething"
/>
```

### Script
```js
import { VueTerminalUI } from "vue-terminal"

export default {
  ...

  methods: {
    doSomething(command) {
      let args = command.split(" ");

      if (args[0] === "addLine" && args[1]) {
        this.$refs["my-terminal-ui"].$emit("write", args[1]);
      }
    }
  }
}
```


## VueTerminal

todo