# Wretched + React

See [Wretched](https://github.com/wretched-tui/wretched) for more info about
Wretched itself. This library adds a React renderer/reconciler.

```tsx
import React, {useReducer} from 'react'
import {interceptConsoleLog} from 'wretched'
import {run} from 'wretched-react'

// Recommended:
interceptConsoleLog()

function App() {
  const [bang, goto10] = useReducer((state) => state + '!', '')

  return <box border="single">
    <flow direction="topToBottom">
      First there was Ncurses{bang}
      <button onClick={goto10}>Tell me more!</button>
    </flow>
  </box>
}

run()

// While the terminal is in full screen mode, you probably don't want to write
// console.log to stdout - it will appear whever the cursor happens to be, and will
// clobber your output. You can mount <console-log /> to view logs, otherwise
// when you exit (Ctrl-C) the logs will be flushed to stdout.
```
