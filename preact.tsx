import {h, Fragment, render} from 'preact'
import {useState, useEffect, useRef, useMemo} from 'preact/hooks'
import {
  // Accordion,
  Box,
  // Button,
  // Checkbox,
  // Collapsible,
  // CollapsibleText,
  // Container,
  // Drawer,
  // Input,
  // Screen,
  // Scrollable,
  // Separator,
  // Slider,
  // Space,
  // Stack,
  // Tabs,
  Screen,
  View,
  Window,
} from 'wretched'
import {
  //   TextContainer,
  TextLiteral,
  //   TextProvider,
  //   TextStyle,
} from './lib/components/TextReact'
import {interceptConsoleLog} from 'wretched'
import {decorateConsoleLog} from 'wretched'

type Props = Record<string, any>

interface Renderer<Node> {
  create(type: string, props: Props): Node
  insert(parent: Node, node: Node, before?: Node): void
  update(node: Node, props: Props): void
  remove(parent: Node, node: Node): void
}

const defer = Promise.prototype.then.bind(Promise.resolve())

class RendererElement<T> {
  parentNode: RendererElement<T> | null = null
  nextSibling: RendererElement<T> | null = null
  previousSibling: RendererElement<T> | null = null
  firstChild: RendererElement<T> | null = null
  lastChild: RendererElement<T> | null = null
  props: Props = {}
  prevProps?: Props
  node?: any
  constructor(
    private renderer: Renderer<T>,
    public localName: string,
  ) {
    this._commit = this._commit.bind(this)
  }
  set data(text: any) {
    this.setAttribute('data', String(text))
  }
  setAttribute(name: string, value: any) {
    if (this.node && !this.prevProps) {
      this.prevProps = Object.assign({}, this.props)
      defer(this._commit)
    }
    this.props[name] = value
  }
  removeAttribute(name: string) {
    delete this.props[name]
  }
  _attach() {
    if (!this.node) {
      this.node = this.renderer.create(this.localName, this.props)
    }
    return this.node
  }
  _commit() {
    const state = this.node
    const prev = this.prevProps
    if (!state || !prev) return
    this.prevProps = undefined
    this.renderer.update(state, this.props)
  }
  insertBefore(child: RendererElement<T>, before?: RendererElement<T> | null) {
    if (child.parentNode === this) this.removeChild(child)

    if (before) {
      const prev = before.previousSibling
      child.previousSibling = prev
      before.previousSibling = child
      if (prev) {
        prev.nextSibling = child
      }
      if (before == this.firstChild) {
        this.firstChild = child
      }
    } else {
      const last = this.lastChild
      child.previousSibling = last
      this.lastChild = child
      if (last) last.nextSibling = child
      if (!this.firstChild) this.firstChild = child
    }

    child.parentNode = this
    child.nextSibling = before ?? null

    this.renderer.insert(
      this._attach(),
      child._attach(),
      before && before._attach(),
    )
  }
  appendChild(child: RendererElement<T>) {
    this.insertBefore(child)
  }
  removeChild(child: RendererElement<T>) {
    if (this.firstChild === child) this.firstChild = child.nextSibling
    if (this.lastChild === child) this.lastChild = child.previousSibling
    child.parentNode = child.nextSibling = child.previousSibling = null
    if (this.node && child.node) {
      this.renderer.remove(this.node, child.node)
    }
  }
}

function createRendererDom<T>(renderer: Renderer<T>) {
  function createElement(type: string) {
    return new RendererElement(renderer, type)
  }

  function createTextNode(text: any) {
    const node = createElement('Text')
    node.props.data = String(text)
    return node
  }

  function createRoot() {
    return createElement('Window')
  }

  return {createElement, createTextNode, createRoot}
}

const dom = createRendererDom({
  create(type, props) {
    switch (type) {
      case 'Text':
        return new TextLiteral(props.text ?? '')
      case 'Box':
        return new Box(props)
      case 'Window':
        return new Window(props)
      default:
        throw Error(`Unknown type ${type}`)
    }
  },
  insert(parent, node, before) {
    let index: number | undefined
    if (before) {
      index = parent.children.indexOf(before)
    }
    parent.add(node, index === -1 ? undefined : index)
  },
  remove(parent, node) {
    parent.removeChild(node)
  },
  update(node, props) {
    node.update(props)
  },
})

Object.assign(global, {document: {}})
Object.assign(document, dom)

function DemoApp() {
  const [date, setDate] = useState('')

  return <Box border="single" width={5} height={5} />
}

interceptConsoleLog()

export async function run() {
  const root = dom.createRoot()
  const window = root.node
  const start = await Screen.start(window)
  const [screen, _] = start

  render(<DemoApp />, root)
}

run()
