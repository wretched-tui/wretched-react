import React from 'react'
import type {
  Box as WrBox,
  Button as WrButton,
  Checkbox as WrCheckbox,
  Collapsible as WrCollapsible,
  ConsoleLog as WrConsoleLog,
  // CollapsibleText,
  Digits as WrDigits,
  // Drawer,
  // Dropdown,
  Stack as WrStack,
  Input as WrInput,
  // Log,
  // ScrollableList,
  Scrollable as WrScrollable,
  Separator as WrSeparator,
  Slider as WrSlider,
  Space as WrSpace,
  // Tree,
  Tabs as WrTabs,
} from 'wretched'
import {TextProvider, TextStyle} from './components/TextReact'

type WretchedView<
  T extends abstract new (arg: any, ...args: any) => any,
  Children extends keyof ConstructorParameters<T>[0] = 'children',
> = Omit<NonNullable<ConstructorParameters<T>[0]>, Children>

type WretchedContainer<
  T extends abstract new (arg: any, ...args: any) => any,
  Children extends keyof NonNullable<ConstructorParameters<T>[0]> = 'children',
> = WretchedView<T, Children> & {[Key in Children]?: React.ReactNode}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // views
      'wr-br': {}
      'wr-checkbox': WretchedView<typeof WrCheckbox>
      'wr-console': WretchedView<typeof WrConsoleLog>
      'wr-digits': WretchedView<typeof WrDigits>
      'wr-input': WretchedView<typeof WrInput>
      'wr-separator': WretchedView<typeof WrSeparator>
      'wr-slider': WretchedView<typeof WrSlider>
      'wr-space': WretchedView<typeof WrSpace>

      // "simple" containers
      'wr-box': WretchedContainer<typeof WrBox>
      'wr-button': WretchedContainer<typeof WrButton>
      'wr-collapsible': WretchedContainer<
        typeof WrCollapsible,
        'collapsed' | 'expanded' | 'children'
      >
      'wr-scrollable': WretchedContainer<typeof WrScrollable>
      'wr-stack': WretchedContainer<typeof WrStack>
      'wr-style': WretchedContainer<typeof TextStyle>
      'wr-text': WretchedContainer<typeof TextProvider>

      // "complex" containers
      'wr-tabs': WretchedContainer<typeof WrTabs>
      'wr-tab': WretchedContainer<typeof WrTabs.Section>
    }
  }
}

export function Br(): JSX.Element {
  return <wr-br />
}
export function Checkbox(
  reactProps: JSX.IntrinsicElements['wr-checkbox'],
): JSX.Element {
  return <wr-checkbox {...reactProps} />
}
export function ConsoleLog(
  reactProps: JSX.IntrinsicElements['wr-console'],
): JSX.Element {
  return <wr-console {...reactProps} />
}
export function Digits(
  reactProps: JSX.IntrinsicElements['wr-digits'],
): JSX.Element {
  return <wr-digits {...reactProps} />
}
export function Input(
  reactProps: JSX.IntrinsicElements['wr-input'],
): JSX.Element {
  return <wr-input {...reactProps} />
}

interface Separator {
  (reactProps: JSX.IntrinsicElements['wr-separator']): JSX.Element
  horizontal(
    reactProps: Omit<JSX.IntrinsicElements['wr-separator'], 'direction'>,
  ): JSX.Element
  vertical(
    reactProps: Omit<JSX.IntrinsicElements['wr-separator'], 'direction'>,
  ): JSX.Element
}
export const Separator: Separator = function Separator(
  reactProps: JSX.IntrinsicElements['wr-separator'],
): JSX.Element {
  return <wr-separator {...reactProps} />
}
Separator.horizontal = function SeparatorHorizontal(
  reactProps: Omit<JSX.IntrinsicElements['wr-separator'], 'direction'>,
) {
  return <wr-separator direction="horizontal" {...reactProps} />
}
Separator.vertical = function SeparatorHorizontal(
  reactProps: Omit<JSX.IntrinsicElements['wr-separator'], 'direction'>,
) {
  return <wr-separator direction="vertical" {...reactProps} />
}

interface Slider {
  (reactProps: JSX.IntrinsicElements['wr-slider']): JSX.Element
  horizontal(
    reactProps: Omit<JSX.IntrinsicElements['wr-slider'], 'direction'>,
  ): JSX.Element
  vertical(
    reactProps: Omit<JSX.IntrinsicElements['wr-slider'], 'direction'>,
  ): JSX.Element
}
export const Slider: Slider = function Slider(
  reactProps: JSX.IntrinsicElements['wr-slider'],
): JSX.Element {
  return <wr-slider {...reactProps} />
}
Slider.horizontal = function SliderHorizontal(
  reactProps: Omit<JSX.IntrinsicElements['wr-slider'], 'direction'>,
) {
  return <wr-slider direction="horizontal" {...reactProps} />
}
Slider.vertical = function SliderHorizontal(
  reactProps: Omit<JSX.IntrinsicElements['wr-slider'], 'direction'>,
) {
  return <wr-slider direction="vertical" {...reactProps} />
}

export function Space(
  reactProps: JSX.IntrinsicElements['wr-space'],
): JSX.Element {
  return <wr-space {...reactProps} />
}

export function Box(reactProps: JSX.IntrinsicElements['wr-box']): JSX.Element {
  const {children, ...props} = reactProps
  return <wr-box {...props}>{children}</wr-box>
}
export function Scrollable(
  reactProps: JSX.IntrinsicElements['wr-scrollable'],
): JSX.Element {
  const {children, ...props} = reactProps
  return <wr-scrollable {...props}>{children}</wr-scrollable>
}

interface Tabs {
  (reactProps: JSX.IntrinsicElements['wr-tabs']): JSX.Element
  Section(
    reactProps: Omit<JSX.IntrinsicElements['wr-tab'], 'direction'>,
  ): JSX.Element
}
export const Tabs: Tabs = function Tabs(
  reactProps: JSX.IntrinsicElements['wr-tabs'],
): JSX.Element {
  const {children, ...props} = reactProps
  return <wr-tabs {...props}>{children}</wr-tabs>
}
Tabs.Section = function SliderHorizontal(
  reactProps: Omit<JSX.IntrinsicElements['wr-tab'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return <wr-tab {...props}>{children}</wr-tab>
}

export function Button(
  reactProps: JSX.IntrinsicElements['wr-button'],
): JSX.Element {
  const {children, ...props} = reactProps
  return <wr-button {...props}>{children}</wr-button>
}

export function Collapsible(
  reactProps: JSX.IntrinsicElements['wr-collapsible'],
): JSX.Element {
  const {collapsed, expanded, ...props} = reactProps
  return (
    <wr-collapsible {...props}>
      {collapsed}
      {expanded}
    </wr-collapsible>
  )
}

/**
 * <Text /> is a container that sets the text properties of child TextLiterals
 * (font, style) and TextContainers (wrap, alignment)
 */
export function Text(
  reactProps: JSX.IntrinsicElements['wr-text'],
): JSX.Element {
  return <wr-text {...reactProps} />
}

interface Stack {
  (reactProps: JSX.IntrinsicElements['wr-stack']): JSX.Element
  down(
    reactProps: Omit<JSX.IntrinsicElements['wr-stack'], 'direction'>,
  ): JSX.Element
  up(
    reactProps: Omit<JSX.IntrinsicElements['wr-stack'], 'direction'>,
  ): JSX.Element
  left(
    reactProps: Omit<JSX.IntrinsicElements['wr-stack'], 'direction'>,
  ): JSX.Element
  right(
    reactProps: Omit<JSX.IntrinsicElements['wr-stack'], 'direction'>,
  ): JSX.Element
}
export const Stack: Stack = function Stack(
  reactProps: JSX.IntrinsicElements['wr-stack'],
) {
  const {children, ...props} = reactProps
  return <wr-stack {...props}>{children}</wr-stack>
}

Stack.down = function StackLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-stack'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-stack direction="down" {...props}>
      {children}
    </wr-stack>
  )
}
Stack.up = function StackLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-stack'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-stack direction="up" {...props}>
      {children}
    </wr-stack>
  )
}
Stack.right = function StackLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-stack'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-stack direction="right" {...props}>
      {children}
    </wr-stack>
  )
}
Stack.left = function StackLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-stack'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-stack direction="left" {...props}>
      {children}
    </wr-stack>
  )
}

/**
 * <Style /> is similar to <Text/> but only allows inline styles (bold, etc).
 * Does not support align or wrap (block styles). Does not support 'font', because
 * font is not encodable via SGR codes (and that's how I'm styling and
 * concatenating the text nodes).
 */
export function Style(
  reactProps: JSX.IntrinsicElements['wr-style'],
): JSX.Element {
  return <wr-style {...reactProps} />
}
