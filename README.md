![npm version](https://img.shields.io/npm/v/@evlad/vue-terminal.svg)
![license](https://img.shields.io/npm/l/@evlad/vue-terminal.svg)
# Vue terminal

## Installation

```
npm install @evlad/vue-terminal
```

## Usage

> The list of components that it exports

### VueTerminalUI

Only the UI part of the terminal without any commands

Here is an example

**Template**
```html
<vue-terminal-ui
  ref="my-terminal-ui"
  prefix="user@host:"
  @triggerCommand="doSomething"
/>
```

**Script**
```js
import { VueTerminalUI } from "@evlad/vue-terminal"

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


### VueTerminal

todo
