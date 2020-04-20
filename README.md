![npm version](https://img.shields.io/npm/v/@evlad/vue-terminal-ui.svg)
![license](https://img.shields.io/npm/l/@evlad/vue-terminal-ui.svg)
# Vue terminal UI

![gif](https://i.imgur.com/XV9pGib.gif)

Live demo at [www.emmanuelvlad.com](https://www.emmanuelvlad.com)

## Installation

```
npm install @evlad/vue-terminal-ui
```

## Usage

> The list of components that it exports

### VueTerminalUI

Here is an example

**Template**
```html
<vue-terminal-ui
  ref="my-terminal-ui"
  prefix="user@host:"
  @triggerCommand="commandHandler"
/>
```

**Script**
```js
import VueTerminalUI from "@evlad/vue-terminal-ui"

export default {
  ...

  methods: {
    commandHandler(command, args) {
      if (command === "write" && args.length > 0) {
        this.$refs["my-terminal-ui"].$emit("write", "\\color:rainbow;" + args.join(" "));
      }
    }
  }
}
```
