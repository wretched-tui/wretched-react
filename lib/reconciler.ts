import React from 'react'
import type {ReactNode} from 'react'
import ReactReconciler from 'react-reconciler'
import {
  Box,
  Button,
  Checkbox,
  Collapsible,
  Container,
  Flex,
  Flow,
  Input,
  Screen,
  Text,
  View,
  Window,
} from 'wretched'

import {isSame} from './isSame'
import {childToText, childrenToText} from './childToText'

type Props = {}
interface HostContext {}

export function render(screen: Screen, window: Window, rootNode: ReactNode) {
  function rerender() {
    screen.render()
  }

  const reconciler = ReactReconciler({
    supportsMutation: true,
    supportsPersistence: false,
    supportsHydration: false,
    noTimeout: undefined,
    isPrimaryRenderer: true,

    getRootHostContext(rootWindow: Window): HostContext {
      return {screen, window: rootWindow}
    },
    getChildHostContext(
      _parentHostContext: HostContext,
      type: string,
      _rootWindow: Window,
    ) {
      return {type}
    },
    clearContainer(rootWindow: Window) {
      for (const child of rootWindow.children) {
        child.removeFromParent()
      }
    },

    createInstance(
      type: string,
      props: Props,
      _rootWindow: Window,
      _hostContext: HostContext,
      _internalInstanceHandle: Object,
    ) {
      if ('children' in props) {
        if (type === 'wr-text') {
          const text = childrenToText(props.children as any[])
          props = {
            ...props,
            text,
          }
        } else {
          props = {...props}
        }

        delete (props as any)['children']
      }

      if ('child' in props) {
        if (type === 'wr-text') {
          const text = childrenToText([props.child as any])
          props = {
            ...props,
            text,
          }
        } else {
          props = {...props}
        }

        delete (props as any)['child']
      }

      switch (type) {
        case 'wr-br':
          return new Text({text: '\n'})
        case 'wr-box':
          return new Box(props as any)
        case 'wr-checkbox':
          return new Checkbox(props as any)
        case 'wr-collapsible':
          return new Collapsible(props as any)
        case 'wr-flow':
          return new Flow(props as any)
        case 'wr-flex':
          return new Flex(props as any)
        case 'wr-input':
          return new Input(props as any)
        case 'wr-button':
          return new Button(props as any)
        case 'wr-text':
          return new Text(props as any)

        default:
          throw new Error(`unknown component "${type}"`)
      }
    },
    createTextInstance(text: string) {
      return new Text({text})
    },

    appendInitialChild(parentInstance: Container, child: View) {
      parentInstance.add(child)
    },
    appendChild(parentInstance: Container, child: View) {
      parentInstance.add(child)
    },
    insertBefore(parentInstance: Container, child: View, beforeChild: View) {
      const index = parentInstance.children.indexOf(beforeChild)
      parentInstance.add(child, index === -1 ? undefined : index)
    },

    appendChildToContainer(rootWindow: Window, child: View) {
      rootWindow.add(child)
    },
    insertInContainerBefore(
      rootWindow: Window,
      child: View,
      beforeChild: View,
    ) {
      const index = rootWindow.children.indexOf(beforeChild)
      rootWindow.add(child, index === -1 ? undefined : index)
    },

    removeChild(_: Container, child: View) {
      child.removeFromParent()
    },
    removeChildFromContainer(_rootWindow: Window, child: View) {
      child.removeFromParent()
    },
    detachDeletedInstance(node: View) {},

    finalizeInitialChildren(instance: View) {
      return false
    },
    prepareForCommit() {
      return null
    },
    resetAfterCommit() {
      rerender()
    },

    commitMount(
      _instance: View,
      _type: string,
      _newProps: Props,
      _internalInstanceHandle: Object,
    ) {
      // not needed as long as finalizeInitialChildren returns `false`
    },

    commitTextUpdate(textInstance: Text, _oldText: string, newText: string) {
      textInstance.text = newText
    },

    resetTextContent(instance: Text) {
      instance.text = ''
    },
    shouldSetTextContent(type: string, _props: Props) {
      return type === 'wr-text'
    },

    prepareUpdate(
      _instance: View,
      _type: string,
      oldProps: any,
      newProps: any,
      _rootContainer: unknown,
      _hostContext: unknown,
    ) {
      for (const prop in oldProps) {
        if (!Object.hasOwn(oldProps, prop)) {
          continue
        }

        if (!isSame(oldProps[prop], newProps[prop])) {
          // difference found - we just return a non-null here to indicate "difference"
          return []
        }
      }

      for (const prop in newProps) {
        // if we already checked it, or it isn't an own-prop on newProps, continue
        if (Object.hasOwn(oldProps, prop) || !Object.hasOwn(newProps, prop)) {
          continue
        }

        if (!isSame(oldProps[prop], newProps[prop])) {
          // difference found - we just return a non-null here to indicate "difference"
          return []
        }
      }

      return null
    },
    commitUpdate(
      node: View,
      _updatePayload: [PropertyKey, any][],
      _type: string,
      _oldProps: Props,
      newProps: Props,
      _internalInstanceHandle: Object,
    ) {
      const {children, ...updates} = newProps as any
      if (children !== undefined && node instanceof Text) {
        updates.text = childrenToText(children)
      }

      node.update(updates)
    },

    getPublicInstance(_instance: unknown) {
      throw new Error('Function not implemented.')
    },
    preparePortalMount(_containerInfo: unknown) {
      throw new Error('Function not implemented.')
    },
    scheduleTimeout(
      _fn: (...args: unknown[]) => unknown,
      _delay?: number | undefined,
    ) {
      throw new Error('Function not implemented.')
    },
    cancelTimeout(_id: unknown) {
      throw new Error('Function not implemented.')
    },
    getCurrentEventPriority(): number {
      throw new Error('Function not implemented.')
    },
    getInstanceFromNode(): ReactReconciler.Fiber | null | undefined {
      throw new Error('Function not implemented.')
    },
    beforeActiveInstanceBlur() {
      throw new Error('Function not implemented.')
    },
    afterActiveInstanceBlur() {
      throw new Error('Function not implemented.')
    },
    prepareScopeUpdate() {
      throw new Error('Function not implemented.')
    },
    getInstanceFromScope() {
      throw new Error('Function not implemented.')
    },
  })

  const fiber = reconciler.createContainer(
    window,
    0,
    null,
    false,
    null,
    '',
    () => {},
    null,
  )

  const parentComponent = null
  const callback = null
  reconciler.updateContainer(rootNode, fiber, parentComponent, callback)
  return reconciler.getPublicRootInstance(fiber)
}

export async function run(
  component: ReactNode,
): Promise<[Screen, Window, React.ReactNode]> {
  const start = await Screen.start()
  const [screen, _, window] = start

  render(screen, window, component)

  return [screen, window, component]
}
