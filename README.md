# Wretched + React

See [Wretched](https://github.com/wretched-tui/wretched) for more info about
Wretched itself. This library adds a React renderer/reconciler.

```tsx
import React, {useReducer} from 'react'
import {interceptConsoleLog} from 'wretched'
import {
  Box,
  Button,
  Stack,
  run,
} from 'wretched-react'
import {run} from 'wretched-react'

// Recommended:
interceptConsoleLog()

function App() {
  const [bang, goto10] = useReducer((state) => state + '!', '')

  return <Box border="single">
    <Stack.down>
      First there was Ncurses{bang}
      <Button onClick={goto10}>Tell me more!</Button>
    </Stack.down>
  </Box>
}

run()
```
