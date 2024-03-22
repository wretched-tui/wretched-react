import React from 'react'
import type {ReactNode} from 'react'
import ReactReconciler from 'react-reconciler'
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Flow,
  Input,
  Screen,
  Text,
  View,
  Window,
} from 'wretched'

function isSame(lhs: any, rhs: any, depth = 0): boolean {
  if (depth >= 100) {
    return false
  }

  if (typeof lhs !== typeof rhs) {
    return false
  }

  if (
    typeof lhs === 'symbol' ||
    typeof lhs === 'string' ||
    typeof lhs === 'undefined' ||
    typeof lhs === 'boolean' ||
    typeof lhs === 'number'
  ) {
    return lhs === rhs
  }

  if (lhs === null || rhs === null) {
    return lhs === rhs
  }

  if (lhs.constructor !== rhs.constructor) {
    return false
  }

  if (lhs instanceof Array) {
    return (
      lhs.length === rhs.length &&
      lhs.every((value, index) => isSame(value, rhs[index], depth + 1))
    )
  }

  if (lhs instanceof Set) {
    if (lhs.size !== rhs.size) {
      return false
    }

    for (const value of lhs) {
      if (!rhs.has(value)) {
        return false
      }
    }

    return true
  }

  if (lhs instanceof Map) {
    if (lhs.size !== rhs.size) {
      return false
    }

    for (const [key, value] of lhs) {
      if (!rhs.has(key) || !isSame(value, rhs.get(key), depth + 1)) {
        return false
      }
    }

    return true
  }

  if (lhs instanceof Date) {
    return lhs.getTime() === rhs.getTime()
  }

  // ok, better be an object
  // and if it's a FiberNode, skip the _owner, it's too huge
  if ('$$typeof' in lhs || '$$typeof in rhs') {
    const {_owner: _lhsOwner, lhsTrim} = lhs
    const {_owner: _rhsOwner, rhsTrim} = rhs
    return isSame(lhsTrim, rhsTrim, depth + 1)
  }

  for (const prop in lhs) {
    if (!Object.hasOwn(lhs, prop)) {
      continue
    }

    // if rhs doesn't have the prop, or the values aren't the same
    if (!Object.hasOwn(rhs, prop) || !isSame(lhs[prop], rhs[prop], depth + 1)) {
      return false
    }
  }

  for (const prop in rhs) {
    if (!Object.hasOwn(rhs, prop)) {
      continue
    }

    // only need to check if lhs doesn't have the prop
    if (!Object.hasOwn(lhs, prop)) {
      return false
    }

    return false
  }

  return true
}

function childToText(child: any) {
  if (child === null || child === undefined || child === false) {
    return ''
  } else if (
    typeof child === 'number' ||
    typeof child === 'symbol' ||
    child === true
  ) {
    return String(child)
  } else if (typeof child === 'string') {
    return child
  } else if (child.type === 'wr-br') {
    return '\n'
  } else if (child.type instanceof Function) {
    return childToText(child.type({}))
  } else {
    return `<${child.type} />`
  }
}

function childrenToText(children: any[]) {
  return children.map(childToText).join('')
}

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
          props = {
            ...props,
            text: childrenToText(props.children as any[]),
          }
        } else {
          props = {...props}
        }

        delete (props as any)['children']
      }

      switch (type) {
        case 'wr-br':
          return new Text({text: '\n'})
        case 'wr-box':
          return new Box(props as any)
        case 'wr-checkbox':
          return new Checkbox(props as any)
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
    appendChildToContainer(rootWindow: Window, child: View) {
      rootWindow.add(child)
    },

    insertBefore(parentInstance: Container, child: View, beforeChild: View) {
      const index = parentInstance.children.indexOf(beforeChild)
      parentInstance.add(child, index === -1 ? undefined : index)
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
      const changed = []
      for (const prop in oldProps) {
        if (!Object.hasOwn(oldProps, prop)) {
          continue
        }

        if (!isSame(oldProps[prop], newProps[prop])) {
          return []
        }
      }

      for (const prop in newProps) {
        if (Object.hasOwn(oldProps, prop) || !Object.hasOwn(newProps, prop)) {
          continue
        }

        if (!isSame(oldProps[prop], newProps[prop])) {
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

  // let indent = ''
  // for (const key in reconciler) {
  //   const fn = (reconciler as any)[key]
  //   if (fn instanceof Function) {
  //     ;(reconciler as any)[key] = (...args: any[]) => {
  //       const prevIndent = indent
  //       console.log(`${indent}==> ${key}(`, ...args, ')')
  //       indent += '  '
  //       const ret = fn.apply(reconciler, args)
  //       indent = prevIndent
  //       console.log(`${indent}<== ${key}`)
  //       return ret
  //     }
  //   }
  // }

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

export async function run(component: ReactNode) {
  const start = await Screen.start()
  const [screen, _, window] = start

  render(screen, window, component)

  return [screen, window, component]
}
