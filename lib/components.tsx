import React from 'react'
import {
  Box as WrBox,
  Button as WrButton,
  Checkbox as WrCheckbox,
  Collapsible as WrCollapsible,
  // CollapsibleText,
  Digits as WrDigits,
  // Drawer,
  // Dropdown,
  Flex as WrFlex,
  Flow as WrFlow,
  Input as WrInput,
  // Log,
  // ScrollableList,
  Separator as WrSeparator,
  Slider as WrSlider,
  Space as WrSpace,
  Text as WrText,
  // Tree,
} from 'wretched'

type WretchedView<T extends abstract new (arg: any, ...args: any) => any> =
  Omit<ConstructorParameters<T>[0], 'children'>

type WretchedContainer<
  T extends abstract new (arg: any, ...args: any) => any,
  Children extends keyof ConstructorParameters<T>[0] = 'children',
> = Omit<WretchedView<T>, Children> & {[Key in Children]?: React.ReactNode}

type WretchedText<T extends abstract new (arg: any, ...args: any) => any> =
  WretchedView<T> & {children?: React.ReactNode}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wr-box': WretchedContainer<typeof WrBox>
      'wr-button': WretchedContainer<typeof WrButton>
      'wr-checkbox': WretchedContainer<typeof WrCheckbox>
      'wr-flex': WretchedContainer<typeof WrFlex>
      'wr-flow': WretchedContainer<typeof WrFlow>
      'wr-input': WretchedContainer<typeof WrInput>
      'wr-collapsible': WretchedContainer<
        typeof WrCollapsible,
        'collapsedView' | 'expandedView'
      >
      'wr-text': WretchedText<typeof WrText>
      'wr-br': {}
    }
  }
}

export function Box(reactProps: JSX.IntrinsicElements['wr-box']): JSX.Element {
  const {children, ...props} = reactProps
  return <wr-box {...props}>{children}</wr-box>
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
  const {children, ...props} = reactProps
  return <wr-input {...props}>{children}</wr-input>
}
export function Collapsible(
  reactProps: JSX.IntrinsicElements['wr-collapsible'],
): JSX.Element {
  const {collapsedView, expandedView, ...props} = reactProps
  return (
    <wr-collapsible {...props}>
      {collapsedView}
      {expandedView}
    </wr-collapsible>
  )
}
export function Text(
  reactProps: JSX.IntrinsicElements['wr-text'],
): JSX.Element {
  return <wr-text {...reactProps} />
}
export function Br(): JSX.Element {
  return <wr-br />
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
    <wr-flex direction="topToBottom" {...props}>
      {children}
    </wr-flex>
  )
}
FlexComponent.up = function FlexLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-flex'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-flex direction="bottomToTop" {...props}>
      {children}
    </wr-flex>
  )
}
FlexComponent.right = function FlexLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-flex'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-flex direction="leftToRight" {...props}>
      {children}
    </wr-flex>
  )
}
FlexComponent.left = function FlexLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-flex'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-flex direction="rightToLeft" {...props}>
      {children}
    </wr-flex>
  )
}

interface Flow {
  (reactProps: JSX.IntrinsicElements['wr-flow']): JSX.Element
  down(
    reactProps: Omit<JSX.IntrinsicElements['wr-flow'], 'direction'>,
  ): JSX.Element
  up(
    reactProps: Omit<JSX.IntrinsicElements['wr-flow'], 'direction'>,
  ): JSX.Element
  left(
    reactProps: Omit<JSX.IntrinsicElements['wr-flow'], 'direction'>,
  ): JSX.Element
  right(
    reactProps: Omit<JSX.IntrinsicElements['wr-flow'], 'direction'>,
  ): JSX.Element
}

function FlowComponent(reactProps: JSX.IntrinsicElements['wr-flow']) {
  const {children, ...props} = reactProps
  return <wr-flow {...props}>{children}</wr-flow>
}

FlowComponent.down = function FlowLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-flow'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-flow direction="topToBottom" {...props}>
      {children}
    </wr-flow>
  )
}
FlowComponent.up = function FlowLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-flow'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-flow direction="bottomToTop" {...props}>
      {children}
    </wr-flow>
  )
}
FlowComponent.right = function FlowLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-flow'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-flow direction="leftToRight" {...props}>
      {children}
    </wr-flow>
  )
}
FlowComponent.left = function FlowLeft(
  reactProps: Omit<JSX.IntrinsicElements['wr-flow'], 'direction'>,
) {
  const {children, ...props} = reactProps
  return (
    <wr-flow direction="rightToLeft" {...props}>
      {children}
    </wr-flow>
  )
}

export const Flex = FlexComponent as Flex
export const Flow = FlowComponent as Flow
