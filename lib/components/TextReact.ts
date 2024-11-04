import {
  Viewport,
  View,
  type ViewProps,
  Container,
  Style,
  Text,
  Size,
  Rect,
  Alignment,
  FontFamily,
} from 'wretched'

/**
 * Used by the React Reconciler to provide default text styles for descendant
 * TextLiteral nodes. Does not layout its children - TextContainer does that work.
 *
 * @example
 *     <Text>
 *       hello!
 *     </Text>
 *
 * - `<Text>` node creates `TextProvider`
 * - "hello!" creates `TextLiteral`
 * - `TextLiteral` is added to a `TextContainer`, which is added to `TextProvider`
 *
 *     <Flow.down>
 *       hello!<br />
 *       <Box height={5} width={5} />
 *       goodbye!<br />
 *     </Flow.down>
 *
 * - "hello!" and <br/> create instances of `TextLiteral`
 * - Both are added to the same `TextContainer`, and added to `Flow.down`
 * - `<Box/>` is added to `Flow.down`
 * - When the "goodbye!" `TextLiteral` is added, the _last child_ of `Flow.down` is
 *   not a `TextContainer`, so a new `TextContainer` is created.
 * - no `TextProvider` here, so default text styles are used (left align, default
 *   font)
 *
 *     <Text wrap={true}>
 *       {`good news everyone,\n`}
 *       tomorrow you'll be making a delivery to…
 *       <Box height={5} width={5} />
 *       goodbye!<br />
 *       I {happy ? 'hope you had fun' : 'wish you would leave'}.
 *     </Text>
 *
 * - The first two text nodes create `TextLiteral`-s, which are rendered together to
 *   become:
 *       good news everyone,⤦
 *       tomorrow you'll be making a delivery to…
 * - `<Box />` is not a TextLiteral, so it is rendered _below_ the text (regardless
 *   of `alignment`)
 * - The last nodes are turned into `TextLiteral`-s as well.
 */
namespace TextReact {}
// yeah I don't care about this namespace I just needed something to attach the JSDoc to

const DEFAULTS = {
  alignment: 'left',
  wrap: false,
  font: 'default',
} as const

/**
 * Used in the React reconciler for literal text JSX elements. They don't have any
 * props.
 */
export class TextLiteral extends View {
  #text: string
  parentTextContainer?: TextContainer

  constructor(text: string) {
    super({})
    this.#text = text
  }

  get text(): string | number {
    return this.#text
  }

  set text(value: string | number) {
    this.#text = String(value)
    this.#invalidateTextContainer()
    this.invalidateSize()
  }

  #invalidateTextContainer() {
    this.parentTextContainer?.invalidateText()
  }

  naturalSize() {
    return Size.zero
  }

  render() {}
}

interface TextProps {}

/**
 * Subsequent TextLiteral nodes are grouped into a TextContainer, which handles the
 * layout of child nodes. It gets its style, font, and alignment from the nearest
 * parent TextProvider.
 */
export class TextContainer extends Container {
  #nodes: View[] = []
  #needResolution = false

  constructor() {
    super({})
  }

  add(child: View, at?: number) {
    if (child instanceof TextLiteral) {
      child.parentTextContainer = this
    }

    this.#nodes.splice(at ?? this.#nodes.length, 0, child)
    this.#invalidateNodes()
  }

  removeChild(remove: View | number) {
    if (remove instanceof TextLiteral) {
      remove.parentTextContainer = undefined
    }

    if (typeof remove === 'number') {
      if (remove >= 0 && remove < this.#nodes.length) {
        const child = this.#nodes[remove]
        this.#nodes.splice(remove, 1)
      }
    } else {
      const index = this.#nodes.indexOf(remove)
      if (~index) {
        this.removeChild(index)
      }
    }

    this.#invalidateNodes()
  }

  removeAllChildren() {
    for (const child of this.#nodes) {
      if (child instanceof TextLiteral) {
        child.parentTextContainer = undefined
      }
    }

    this.#nodes.splice(0, this.#nodes.length)
    this.#invalidateNodes()
  }

  invalidateText() {
    let textBuffer: string | undefined
    const STOP = null
    let childIndex = 0
    for (const node of [...this.#nodes, STOP]) {
      const child = this.children.at(childIndex)

      if (node instanceof TextLiteral) {
        textBuffer ??= ''
        textBuffer += node.text
      } else {
        if (textBuffer !== undefined) {
          if (!(child instanceof Text)) {
            this.#invalidateNodes()
            return
          }

          child.text = textBuffer
        }

        childIndex += 1
      }
    }
  }

  #invalidateNodes() {
    this.#needResolution = true
    this.#resolveNodes()
  }

  #resolveNodes() {
    if (!this.#needResolution) {
      return
    }

    // ideally, we would not remove/add views that are in children and this.#nodes,
    // but in reality that turns out to be tedious, and it's hardly any trouble to
    // remove and re-add those views.
    super.removeAllChildren()

    let textBuffer: string | undefined
    const STOP = null
    for (const node of [...this.#nodes, STOP]) {
      if (node instanceof TextLiteral) {
        textBuffer ??= ''
        textBuffer += node.text
      } else {
        if (textBuffer !== undefined) {
          const textView = this.#createTextNode(textBuffer)
          super.add(textView)
          textBuffer = undefined
        }

        if (node) {
          super.add(node)
        }
      }
    }

    this.#needResolution = false
  }

  #createTextNode(text: string) {
    let textProvider: TextProvider | undefined
    for (
      let ancestorView = this.parent;
      Boolean(ancestorView);
      ancestorView = ancestorView && ancestorView.parent
    ) {
      if (ancestorView instanceof TextProvider) {
        textProvider = ancestorView
        break
      }
    }

    let textProps: TextProviderProps = {
      font: 'default',
      alignment: 'left',
      wrap: false,
    }
    if (textProvider) {
      textProps = {...textProps, ...textProvider.textProps}
    }

    return new Text({
      text,
      ...textProps,
    })
  }

  naturalSize(available: Size): Size {
    this.#resolveNodes()

    const size = Size.zero.mutableCopy()
    const remaining = available.mutableCopy()
    for (const child of this.children) {
      const childSize = child.naturalSize(remaining)
      size.width = Math.max(size.width, childSize.width)
      size.height += childSize.height
      remaining.height -= childSize.height
    }

    return size
  }

  render(viewport: Viewport) {
    const remaining = viewport.contentSize.mutableCopy()
    let y = 0
    for (const child of this.children) {
      const childSize = child.naturalSize(remaining).mutableCopy()
      childSize.width = viewport.contentSize.width
      remaining.height -= childSize.height

      const childViewport = new Rect([0, y], childSize)
      viewport.clipped(childViewport, inner => child.render(inner))
      y += childSize.height
    }
  }
}

interface TextProviderProps {
  style?: Style
  font?: FontFamily
  alignment?: Alignment
  wrap?: boolean
}

type ProviderProps = Partial<TextProviderProps> & ViewProps

export class TextProvider extends Container {
  #style: TextProviderProps['style']
  #alignment: TextProviderProps['alignment']
  #wrap: TextProviderProps['wrap']
  #font: TextProviderProps['font']

  declare wrap: FontFamily
  declare font: FontFamily
  declare alignment: Alignment

  constructor(props: ProviderProps = {}) {
    super(props)

    this.#update(props)
  }

  get textProps(): TextProviderProps {
    const retVal: TextProviderProps = {}
    if (this.#style !== undefined) {
      retVal.style = this.#style
    }
    if (this.#alignment !== undefined) {
      retVal.alignment = this.#alignment
    }
    if (this.#wrap !== undefined) {
      retVal.wrap = this.#wrap
    }
    if (this.#font !== undefined) {
      retVal.font = this.#font
    }

    return retVal
  }

  update(props: ProviderProps) {
    this.#update(props)
    super.update(props)
  }

  #update({style, alignment, wrap, font}: ProviderProps) {
    this.#font = font
    this.#style = style
    this.#alignment = alignment ?? 'left'
    this.#wrap = wrap ?? false
  }
}
