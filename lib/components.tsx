import React from 'react'
import {
  Box as WrBox,
  Button as WrButton,
  Checkbox as WrCheckbox,
  Flex as WrFlex,
  Flow as WrFlow,
  Input as WrInput,
  Text as WrText,
} from 'wretched'

type WretchedView<T extends abstract new (arg: any, ...args: any) => any> =
  Omit<ConstructorParameters<T>[0], 'children'>

type WretchedContainer<T extends abstract new (arg: any, ...args: any) => any> =
  WretchedView<T> & {children?: React.ReactNode}

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
      'wr-text': WretchedText<typeof WrText>
      'wr-br': {}
    }
  }
}

export function Box(reactProps: JSX.IntrinsicElements['wr-box']) {
  const {children, ...props} = reactProps
  return <wr-box {...props}>{children}</wr-box>
}

export function Button(reactProps: JSX.IntrinsicElements['wr-button']) {
  const {children, ...props} = reactProps
  return <wr-button {...props}>{children}</wr-button>
}
export function Checkbox(reactProps: JSX.IntrinsicElements['wr-checkbox']) {
  const {children, ...props} = reactProps
  return <wr-checkbox {...props}>{children}</wr-checkbox>
}
export function Flex(reactProps: JSX.IntrinsicElements['wr-flex']) {
  const {children, ...props} = reactProps
  return <wr-flex {...props}>{children}</wr-flex>
}
export function Flow(reactProps: JSX.IntrinsicElements['wr-flow']) {
  const {children, ...props} = reactProps
  return <wr-flow {...props}>{children}</wr-flow>
}
export function Input(reactProps: JSX.IntrinsicElements['wr-input']) {
  const {children, ...props} = reactProps
  return <wr-input {...props}>{children}</wr-input>
}
export function Text(reactProps: JSX.IntrinsicElements['wr-text']) {
  return <wr-text {...reactProps} />
}
export function Br() {
  return <wr-br />
}
