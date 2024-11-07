import React, {useReducer, useState} from 'react'
import {interceptConsoleLog} from 'wretched'
import {
  Accordion,
  Box,
  Br,
  Button,
  Checkbox,
  Collapsible,
  ConsoleLog,
  Digits,
  Drawer,
  Stack,
  Input,
  Scrollable,
  Separator,
  Slider,
  Space,
  Style,
  Text,
  Tabs,
  CollapsibleText,
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
  const [accordionMultiple, toggleAccordionMultiple] = useReducer(
    state => !state,
    false,
  )
  const [border, switchBorder] = useReducer((border: Border) => {
    borders.unshift(border)
    return borders.pop() as Border
  }, 'single')

  const setHeight = (height: number) => {
    if (debug) {
      console.debug({height})
    }
    setHeight_(height)
  }

  return (
    <Drawer.bottom>
      <Stack.right>
        <Box border="double" flex={1}>
          <Stack.down gap={1}>
            <Stack.right>
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
            </Stack.right>
            <Separator.horizontal />
            <Stack.down>
              <Stack.right gap={1}>
                <Button text="-" onClick={() => setHeight(height - 1)} />
                <Button text="+" onClick={() => setHeight(height + 1)} />
                <Checkbox
                  text="Show Console Log"
                  onChange={toggleDebug}
                  value={debug}
                  hotKey="C-d"
                />
                <Checkbox
                  text="Accordion: multiple"
                  onChange={toggleAccordionMultiple}
                  value={debug}
                  hotKey="C-m"
                />
              </Stack.right>

              <Digits text={String(height)} />
            </Stack.down>
            <Tabs border>
              <Tabs.Section title="Text Example" height={height}>
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
              </Tabs.Section>
              <Tabs.Section title="Another Example">
                I don't have one yet.
              </Tabs.Section>
            </Tabs>
            <Input
              wrap
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam interdum, magna eu pellentesque scelerisque, dui sodales enim, et vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit."
            />
            <Button
              text={hello === 'hello' ? 'Leave' : 'Enter'}
              onClick={leave}
            />
            <Stack.right>
              <Space flex={1} />
              <Button flex={3} text="Border" onClick={switchBorder} />
              <Space flex={1} />
            </Stack.right>
            <Button text={showExtra ? 'Hide' : 'Show'} onClick={toggleExtra} />
            {showExtra ? (
              <Scrollable height={3}>
                <Stack.down>
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (1)</Text>}
                    expanded={<Text bold>bye (1)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (2)</Text>}
                    expanded={<Text bold>bye (2)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (3)</Text>}
                    expanded={<Text bold>bye (3)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (4)</Text>}
                    expanded={<Text bold>bye (4)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (5)</Text>}
                    expanded={<Text bold>bye (5)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (6)</Text>}
                    expanded={<Text bold>bye (6)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (7)</Text>}
                    expanded={<Text bold>bye (7)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (8)</Text>}
                    expanded={<Text bold>bye (8)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (9)</Text>}
                    expanded={<Text bold>bye (9)</Text>}
                  />
                </Stack.down>
              </Scrollable>
            ) : null}
            {debug ? <ConsoleLog /> : null}
          </Stack.down>
        </Box>
        <Accordion multiple={accordionMultiple}>
          <Accordion.Section title="A">
            Yup, this is section A
          </Accordion.Section>
          <Accordion.Section title="B">You get the idea</Accordion.Section>
          <Accordion.Section title="C" width="shrink">
            <Stack.down>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              consectetur molestie faucibus. Phasellus iaculis pellentesque
              felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris
              tortor. Nam interdum, magna eu pellentesque scelerisque, dui ipsum
              adipiscing ante, vel ullamcorper nisl sapien id arcu. Nullam
              egestas diam eu felis mollis sit amet cursus enim vehicula.
              Quisque eu tellus id erat pellentesque consequat. Maecenas
              fermentum faucibus magna, eget dictum nisi congue sed.
              <CollapsibleText text="Quisque a justo a nisi eleifend facilisis sit amet at augue. Sed a sapien vitae augue hendrerit porta vel eu ligula. Proin enim urna, faucibus in vestibulum tincidunt, commodo sit amet orci. Vestibulum ac sem urna, quis mattis urna. Nam eget ullamcorper ligula. Nam volutpat, arcu vel auctor dignissim, tortor nisi sodales enim, et vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit." />
            </Stack.down>
          </Accordion.Section>
        </Accordion>
      </Stack.right>
      <Text alignment="center">Not much to see here</Text>
    </Drawer.bottom>
  )
}

interceptConsoleLog()

run(<Demo />)
