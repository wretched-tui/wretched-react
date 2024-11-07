import React from 'react'
import type {ReactNode} from 'react'
import ReactReconciler from 'react-reconciler'
import {
  Accordion,
  Box,
  Button,
  Checkbox,
  Collapsible,
  Container,
  Stack,
  Input,
  Screen,
  Scrollable,
  Separator,
  Slider,
  Space,
  Tabs,
  View,
  Window,
} from 'wretched'
import {
  TextContainer,
  TextLiteral,
  TextProvider,
  TextStyle,
} from './components/TextReact'

import {isSame} from './isSame'
import {ConsoleLog} from 'wretched'
import {Digits} from 'wretched'

type Props = {}
interface HostContext {
  screen: Screen
  window: Window
}

let _d = false
export function debug() {
  _d = true
}

export function render(screen: Screen, window: Window, rootNode: ReactNode) {
  function rerender() {
    screen.render()
  }

  function removeFromTextContainer(container: Container, child: View) {
    if (_d) {
      console.info('=========== removeFromTextContainer:46 ===========')
      console.info({container, child})
    }
    // find TextContainer with child in it, and remove
    for (const node of container.children) {
      if (node instanceof TextContainer && node.children.includes(child)) {
        node.removeChild(child)
        if (node.children.length === 0) {
          container.removeChild(node)
        }
        return
      }
    }
  }

  function removeChild(container: Container, child: View) {
    if (_d) {
      console.info('=========== removeChild:63 ===========')
      console.info({container, child})
    }
    if (child.parent === container) {
      container.removeChild(child)
    } else if (child instanceof TextLiteral || child instanceof TextStyle) {
      removeFromTextContainer(container, child)
    }
  }

  function appendChild(parentInstance: Container, child: View, before?: View) {
    if (
      parentInstance instanceof TextStyle &&
      (child instanceof TextLiteral || child instanceof TextStyle)
    ) {
      // do not do the TextContainer song and dance
    } else if (child instanceof TextLiteral || child instanceof TextStyle) {
      // if last child of parentInstance is TextContainer, use it, otherwise create new one
      const lastChild = parentInstance.children.at(-1)
      let textContainer: TextContainer
      if (lastChild instanceof TextContainer) {
        textContainer = lastChild
      } else {
        textContainer = new TextContainer()
        parentInstance.add(textContainer)
      }

      if (_d) {
        console.info('=========== appendChild to TextContainer:92 ===========')
        console.info({child, textContainer, parentInstance})
      }
      textContainer.add(child)
      return
    }

    let index: number | undefined = before
      ? parentInstance.children.indexOf(before)
      : -1
    if (index === -1) {
      index = undefined
    }

    if (_d) {
      console.info('=========== appendChild to View:106 ===========')
      console.info({child, parentInstance, index})
    }
    parentInstance.add(child, index)
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
      rootWindow.removeAllChildren()
    },

    createInstance(
      type: string,
      props: Props,
      _rootWindow: Window,
      _hostContext: HostContext,
      _internalInstanceHandle: Object,
    ) {
      if (_d) {
        console.info('=========== createInstance:149 ===========')
        console.info({type, props})
      }
      if ('children' in props) {
        const {children, ...remainder} = props
        props = remainder
      }

      if ('child' in props) {
        const {child, ...remainder} = props
        props = remainder
      }

      switch (type) {
        // views
        case 'br':
        case 'wr-br':
          return new TextLiteral('\n')
        case 'wr-checkbox':
          return new Checkbox(props as any)
        case 'wr-console':
          return new ConsoleLog(props as any)
        case 'wr-digits':
          return new Digits(props as any)
        case 'wr-input':
          return new Input(props as any)
        case 'wr-separator':
          return new Separator(props as any)
        case 'wr-slider':
          return new Slider(props as any)
        case 'wr-space':
          return new Space(props as any)

        // "simple" containers
        case 'wr-box':
          return new Box(props as any)
        case 'wr-button':
          return new Button(props as any)
        case 'wr-collapsible':
          return new Collapsible(props as any)
        case 'wr-stack':
          return new Stack(props as any)
        case 'wr-scrollable':
          return new Scrollable(props as any)
        case 'wr-style':
          return new TextStyle(props as any)
        case 'wr-text':
          return new TextProvider(props as any)

        // "complex" containers
        case 'wr-tabs':
          return new Tabs(props as any)
        case 'wr-tabs-section':
          return new Tabs.Section(props as any)
        case 'wr-accordion':
          return new Accordion(props as any)
        case 'wr-accordion-section':
          return new Accordion.Section(props as any)

        default:
          throw new Error(`unknown component "${type}"`)
      }
    },
    createTextInstance(text: string) {
      if (_d) {
        console.info('=========== createTextInstance:193 ===========')
        console.info({text})
      }
      return new TextLiteral(text)
    },

    appendInitialChild(parentInstance: Container, child: View) {
      appendChild(parentInstance, child, undefined)
    },
    appendChild(parentInstance: Container, child: View) {
      appendChild(parentInstance, child, undefined)
    },
    insertBefore(parentInstance: Container, child: View, beforeChild: View) {
      const index = parentInstance.children.indexOf(beforeChild)
      parentInstance.add(child, index === -1 ? undefined : index)
      appendChild(parentInstance, child, beforeChild)
    },

    appendChildToContainer(rootWindow: Window, child: View) {
      if (_d) {
        console.info('=========== appendChildToContainer:213 ===========')
      }
      appendChild(rootWindow, child)
    },
    insertInContainerBefore(
      rootWindow: Window,
      child: View,
      beforeChild: View,
    ) {
      if (_d) {
        console.info('=========== insertInContainerBefore:223 ===========')
      }
      appendChild(rootWindow, child, beforeChild)
    },

    removeChild(container: Container, child: View) {
      removeChild(container, child)
    },
    removeChildFromContainer(container: Window, child: View) {
      removeChild(container, child)
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

    commitTextUpdate(
      textInstance: TextLiteral,
      _oldText: string,
      newText: string,
    ) {
      if (_d) {
        console.info('=========== reconciler.ts at line 261 ===========')
        console.info({view: textInstance, newText})
      }
      textInstance.text = newText
    },

    resetTextContent(instance: TextLiteral) {
      instance.text = ''
    },
    shouldSetTextContent(type: string, _props: Props) {
      return false
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
      // if (children !== undefined && node instanceof TextLiteral) {
      //   updates.text = childrenToText(children)
      // }

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

  reconciler.updateContainer(
    rootNode,
    fiber,
    null /* parentComponent */,
    null /* callback */,
  )
  return reconciler.getPublicRootInstance(fiber)
}

export async function run(
  component: ReactNode,
): Promise<[Screen, Window, React.ReactNode]> {
  const window = new Window()
  const start = await Screen.start(window)
  const [screen, _] = start

  render(screen, window, component)

  return [screen, window, component]
}
