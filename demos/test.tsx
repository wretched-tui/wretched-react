import React, {useState} from 'react'
import {interceptConsoleLog} from 'wretched'
import {Box, Button, Stack, Text, Style, run} from 'wretched-react'

export function Test() {
  const hello = 'hello'
  const [height, setHeight] = useState(10)

  return (
    <Stack.down>
      <Stack direction="right" gap={1}>
        <Box height={1} width={20} />
        <Button text="-" onClick={() => setHeight(height - 1)} />
        <Button text="+" onClick={() => setHeight(height + 1)} />
      </Stack>
      <Box height={height} border="single">
        <Text alignment="left" font="fraktur">
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
        </Text>
      </Box>
      <Box height={height} border="single">
        {/* <Text /> creates a TextProvider */}
        <Text alignment="right" wrap={true}>
          {/* Each line creates a TextLiteral */}
          {/* Subsequent TextLiterals are grouped into a TextContainer */}
          {hello}!{'\n'}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu
          fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam
          interdum, magna eu pellentesque scelerisque, dui ipsum adipiscing
          ante, vel ullamcorper nisl sapien id arcu. Nullam egestas diam eu
          felis mollis sit amet cursus enim vehicula. Quisque eu tellus id erat
          vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum
          vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit.
          <br />
          world @ {height}
          <br />
          👍
        </Text>
      </Box>
      <Box height={height} border="single">
        <Text alignment="center">
          {/* Each line creates a TextLiteral */}
          {/* Subsequent TextLiterals are grouped into a TextContainer */}
          {hello}!{'\n'}
          world @ {height}
          <br />
          👍
        </Text>
      </Box>
      <Box height={height} border="single">
        <Style bold>
          {hello}
          <Style dim>!</Style>
          woah
        </Style>
        {'\n'}
        world @ {height}
        <br />
        👍
      </Box>
    </Stack.down>
  )
}

interceptConsoleLog()

run(<Test />)
