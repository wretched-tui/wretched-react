import React, {useReducer, useState} from 'react'
import {interceptConsoleLog} from 'wretched'
import {
  Br,
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  Text,
  Digits,
} from 'wretched-react'
import {run, debug as reconcilerDebug} from 'wretched-react'
import {Border} from 'wretched'

const borders: Border[] = ['double', 'bold', 'dotted', 'rounded']

function Demo() {
  const [height, setHeight] = useState(10)
  const [hello, leave] = useReducer(
    state => (state === 'hello' ? 'goodbye' : 'hello'),
    'hello',
  )
  const [showExtra, toggleExtra] = useReducer(state => !state, false)
  const [debug, toggleDebug] = useReducer(state => !state, false)
  const [border, switchBorder] = useReducer((border: Border) => {
    borders.unshift(border)
    return borders.pop() as Border
  }, 'single')

  return (
    <Box border="double" debug={debug}>
      <Flex direction="down" gap={1}>
        <Flex direction="right" gap={1}>
          <Button text="-" onClick={() => setHeight(height => height - 1)} />
          <Button text="+" onClick={() => setHeight(height => height + 1)} />
          <Checkbox text="debug" onChange={toggleDebug} isChecked={debug} />
        </Flex>
        <Digits text={String(height)} />
        <Box height={height} border={border}>
          {hello}!<br />
          world @ {height}
        </Box>
        <Input text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam interdum, magna eu pellentesque scelerisque, dui ipsum adipiscing ante, vel ullamcorper nisl sapien id arcu. Nullam egestas diam eu felis mollis sit amet cursus enim vehicula. Quisque eu tellus id erat pellentesque consequat. Maecenas fermentum faucibus magna, eget dictum nisi congue sed. Quisque a justo a nisi eleifend facilisis sit amet at augue. Sed a sapien vitae augue hendrerit porta vel eu ligula. Proin enim urna, faucibus in vestibulum tincidunt, commodo sit amet orci. Vestibulum ac sem urna, quis mattis urna. Nam eget ullamcorper ligula. Nam volutpat, arcu vel auctor dignissim, tortor nisi sodales enim, et vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit." />
        <Text>
          {hello}
          <Br />
          world
        </Text>
        <Text>
          {hello}!{'\n'}
          world
        </Text>
        <Button text="Leave" onClick={leave} />
        <Button text="Border" onClick={switchBorder} />
        <Button text={showExtra ? 'Hide' : 'Show'} onClick={toggleExtra} />
        {showExtra ? (
          <Box height={3} border={border}>
            😀
          </Box>
        ) : null}
      </Flex>
    </Box>
  )
}

interceptConsoleLog()
run(<Demo />)
