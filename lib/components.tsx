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
  Flex as WrFlex,
  Input as WrInput,
  // Log,
  // ScrollableList,
  Scrollable as WrScrollable,
  Separator as WrSeparator,
  Slider as WrSlider,
  Space as WrSpace,
  // Tree,
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
      'wr-box': WretchedContainer<typeof WrBox>
      'wr-button': WretchedContainer<typeof WrButton>
      'wr-br': {}
      'wr-digits': WretchedView<typeof WrDigits>
      'wr-checkbox': WretchedContainer<typeof WrCheckbox>
      'wr-collapsible': WretchedContainer<
        typeof WrCollapsible,
        'collapsed' | 'expanded' | 'children'
      >
      'wr-console': WretchedView<typeof WrConsoleLog>
      'wr-flex': WretchedContainer<typeof WrFlex>
      'wr-input': WretchedContainer<typeof WrInput>
      'wr-text': WretchedContainer<typeof TextProvider>
      'wr-space': WretchedContainer<typeof WrSpace>
      'wr-scrollable': WretchedContainer<typeof WrScrollable>
      'wr-separator': WretchedContainer<typeof WrSeparator>
      'wr-slider': WretchedContainer<typeof WrSlider>
      'wr-style': WretchedContainer<typeof TextStyle>
    }
  }
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
export function Space(
  reactProps: JSX.IntrinsicElements['wr-space'],
): JSX.Element {
  return <wr-space {...reactProps} />
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

function SeparatorComponent(
  reactProps: JSX.IntrinsicElements['wr-separator'],
): JSX.Element {
  return <wr-separator {...reactProps} />
}
SeparatorComponent.horizontal = function SliderHorizontal(
  reactProps: Omit<JSX.IntrinsicElements['wr-separator'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-separator direction="horizontal" {...props}>
      {children}
    </wr-separator>
  )
}
SeparatorComponent.vertical = function SliderHorizontal(
  reactProps: Omit<JSX.IntrinsicElements['wr-separator'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-separator direction="vertical" {...props}>
      {children}
    </wr-separator>
  )
}

export const Separator = SeparatorComponent as Separator

export function Slider(
  reactProps: JSX.IntrinsicElements['wr-slider'],
): JSX.Element {
  return <wr-slider {...reactProps} />
}

export function Button(
  reactProps: JSX.IntrinsicElements['wr-button'],
): JSX.Element {
  const {children, ...props} = reactProps
  return <wr-button {...props}>{children}</wr-button>
}
export function Checkbox(
  reactProps: JSX.IntrinsicElements['wr-checkbox'],
): JSX.Element {
  const {children, ...props} = reactProps
  return <wr-checkbox {...props}>{children}</wr-checkbox>
}

export function Input(
  reactProps: JSX.IntrinsicElements['wr-input'],
): JSX.Element {
  return <wr-input {...reactProps} />
}
export function Digits(
  reactProps: JSX.IntrinsicElements['wr-digits'],
): JSX.Element {
  return <wr-digits {...reactProps} />
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
export function Br(): JSX.Element {
  return <wr-br />
}

export function ConsoleLog(
  reactProps: JSX.IntrinsicElements['wr-console'],
): JSX.Element {
  return <wr-console {...reactProps} />
}

interface Flex {
  (reactProps: JSX.IntrinsicElements['wr-flex']): JSX.Element
  down(
    reactProps: Omit<JSX.IntrinsicElements['wr-flex'], 'direction'>,
  ): JSX.Element
  up(
    reactProps: Omit<JSX.IntrinsicElements['wr-flex'], 'direction'>,
  ): JSX.Element
  left(
    reactProps: Omit<JSX.IntrinsicElements['wr-flex'], 'direction'>,
  ): JSX.Element
  right(
    reactProps: Omit<JSX.IntrinsicElements['wr-flex'], 'direction'>,
  ): JSX.Element
}

function FlexComponent(reactProps: JSX.IntrinsicElements['wr-flex']) {
  const {children, ...props} = reactProps
  return <wr-flex {...props}>{children}</wr-flex>
}

FlexComponent.down = function FlexLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-flex'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-flex direction="down" {...props}>
      {children}
    </wr-flex>
  )
}
FlexComponent.up = function FlexLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-flex'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-flex direction="up" {...props}>
      {children}
    </wr-flex>
  )
}
FlexComponent.right = function FlexLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-flex'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-flex direction="right" {...props}>
      {children}
    </wr-flex>
  )
}
FlexComponent.left = function FlexLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-flex'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-flex direction="left" {...props}>
      {children}
    </wr-flex>
  )
}

export const Flex = FlexComponent as Flex
