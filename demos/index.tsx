import React, {useReducer, useState} from 'react'
import {interceptConsoleLog} from 'wretched'
import {
  Box,
  Br,
  Button,
  Checkbox,
  Collapsible,
  ConsoleLog,
  Digits,
  Flex,
  Input,
  Scrollable,
  Separator,
  Slider,
  Space,
  Style,
  Text,
} from 'wretched-react'
import {run} from 'wretched-react'
import {Border} from 'wretched'

const borders: Border[] = ['double', 'bold', 'dotted', 'rounded']

function Demo() {
  const [height, setHeight_] = useState(10)
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

  const setHeight = (height: number) => {
    if (debug) {
      console.log({height})
    }
    setHeight_(height)
  }

  return (
    <Box border="double" debug={debug}>
      <Flex direction="down" gap={1}>
        <Flex.right fill>
          <Space width={1} />
          <Slider
            direction="horizontal"
            range={[0, 20]}
            value={height}
            buttons
            step={1}
            border
            onChange={setHeight}
          />
          <Space width={1} />
          <Slider
            flex={1}
            direction="horizontal"
            range={[0, 20]}
            value={height}
            buttons
            step={1}
            border
            onChange={setHeight}
          />
          <Space width={1} />
        </Flex.right>
        <Separator.horizontal />
        <Flex direction="right" gap={1}>
          <Button text="-" onClick={() => setHeight(height - 1)} />
          <Button text="+" onClick={() => setHeight(height + 1)} />
          <Checkbox
            text="debug"
            onChange={toggleDebug}
            value={debug}
            hotKey="C-d"
          />
        </Flex>
        <Digits text={String(height)} />
        <Box height={height} border={border}>
          <Style bold foreground="blue">
            {hello}{' '}
            <Style italic foreground="green">
              world
            </Style>
            , I hope you are doing well,{' '}
            <Style italic>
              all things <Style underline>considered</Style>
            </Style>
          </Style>
          <br />
          world @ {height}
          <Br />
          👍{'\n'}
          👋
        </Box>
        <Input text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam interdum, magna eu pellentesque scelerisque, dui ipsum adipiscing ante, vel ullamcorper nisl sapien id arcu. Nullam egestas diam eu felis mollis sit amet cursus enim vehicula. Quisque eu tellus id erat pellentesque consequat. Maecenas fermentum faucibus magna, eget dictum nisi congue sed. Quisque a justo a nisi eleifend facilisis sit amet at augue. Sed a sapien vitae augue hendrerit porta vel eu ligula. Proin enim urna, faucibus in vestibulum tincidunt, commodo sit amet orci. Vestibulum ac sem urna, quis mattis urna. Nam eget ullamcorper ligula. Nam volutpat, arcu vel auctor dignissim, tortor nisi sodales enim, et vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit." />
        <Button text={hello === 'hello' ? 'Leave' : 'Enter'} onClick={leave} />
        <Flex.right>
          <Space flex={1} />
          <Button flex={3} text="Border" onClick={switchBorder} />
          <Space flex={1} />
        </Flex.right>
        <Button text={showExtra ? 'Hide' : 'Show'} onClick={toggleExtra} />
        {showExtra ? (
          <Collapsible
            isCollapsed
            collapsed={<Text italic>HI</Text>}
            expanded={<Text bold>bye</Text>}
          />
        ) : null}
        {debug ? <ConsoleLog /> : null}
      </Flex>
    </Box>
  )
}

interceptConsoleLog()

run(<Demo />)
