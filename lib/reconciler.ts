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
  Input,
  Screen,
  View,
  Window,
} from 'wretched'
import {TextContainer, TextLiteral, TextProvider} from './components/TextReact'

import {isSame} from './isSame'
import {childrenToText} from './childToText'
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

  function removeFromTextContainer(container: Container, child: TextLiteral) {
    if (_d) {
      console.log('=========== removeFromTextContainer:41 ===========')
      console.log({container, child})
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
      console.log('=========== removeChild:58 ===========')
      console.log({container, child})
    }
    if (child instanceof TextLiteral) {
      removeFromTextContainer(container, child)
      return
    }

    container.removeChild(child)
  }

  function appendChild(parentInstance: Container, child: View, before?: View) {
    if (child instanceof TextLiteral) {
      // if last child of parentInstance is TextContainer, use it, otherwise create new one
      const lastChild = parentInstance.children.at(-1)
      let textContainer: TextContainer
      if (lastChild instanceof TextContainer) {
        textContainer = lastChild
        if (_d) {
          console.log('=========== appendChild:77 ===========')
        }
      } else {
        textContainer = new TextContainer()
        parentInstance.add(textContainer)
      }

      textContainer.add(child)
      if (_d) {
        console.log('=========== appendChild:86 ===========')
        console.log({parentInstance, textContainer, child})
      }
      return
    }

    let index: number | undefined = before
      ? parentInstance.children.indexOf(before)
      : -1
    if (index === -1) {
      index = undefined
    }

    if (_d) {
      console.log('=========== appendChild:100 ===========')
      console.log({parentInstance, child, index})
    }
    parentInstance.add(child, index)
    if (_d) {
      console.log('=========== reconciler.ts at line 105 ===========')
      console.log({
        children: parentInstance.children,
        length: parentInstance.children.length,
        root: screen.rootView,
      })
    }
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
        console.log('=========== createInstance:143 ===========')
        console.log({type, props})
      }
      if ('children' in props) {
        const {children, ...remainder} = props
        if (type === 'wr-text') {
          const text = childrenToText(children as any[])
          props = {
            ...remainder,
            text,
          }
        } else {
          props = remainder
        }
      }

      if ('child' in props) {
        const {child, ...remainder} = props
        if (type === 'wr-text') {
          const text = childrenToText([child as any])
          props = {
            ...remainder,
            text,
          }
        } else {
          props = remainder
        }
      }

      switch (type) {
        case 'br':
        case 'wr-br':
          return new TextLiteral('\n')
        case 'wr-box':
          return new Box(props as any)
        case 'wr-checkbox':
          return new Checkbox(props as any)
        case 'wr-collapsible':
          return new Collapsible(props as any)
        case 'wr-console':
          return new ConsoleLog(props as any)
        case 'wr-digits':
          return new Digits(props as any)
        case 'wr-flex':
          return new Flex(props as any)
        case 'wr-input':
          return new Input(props as any)
        case 'wr-button':
          return new Button(props as any)
        case 'wr-text':
          return new TextProvider(props as any)

        default:
          throw new Error(`unknown component "${type}"`)
      }
    },
    createTextInstance(text: string) {
      if (_d) {
        console.log('=========== createTextInstance:201 ===========')
        console.log({text})
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
        console.log('=========== appendChildToContainer:221 ===========')
      }
      appendChild(rootWindow, child)
    },
    insertInContainerBefore(
      rootWindow: Window,
      child: View,
      beforeChild: View,
    ) {
      if (_d) {
        console.log('=========== insertInContainerBefore:231 ===========')
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
        console.log('=========== reconciler.ts at line 269 ===========')
        console.log({view: textInstance, newText})
      }
      textInstance.text = newText
    },

    resetTextContent(instance: TextLiteral) {
      instance.text = ''
    },
    shouldSetTextContent(type: string, _props: Props) {
      if (_d) {
        console.log('=========== reconciler.ts at line 280 ===========')
        console.log({type})
      }
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
      if (children !== undefined && node instanceof TextLiteral) {
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
