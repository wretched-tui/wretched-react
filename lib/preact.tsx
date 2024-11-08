import {h, Fragment, render} from 'preact'
import {useState, useReducer, useRef, useMemo} from 'preact/hooks'
import {
  Container,
  Screen,
  View,
  Window as WrWindow,
  interceptConsoleLog,
  Checkbox as WrCheckbox,
  CollapsibleText as WrCollapsibleText,
  ConsoleLog as WrConsoleLog,
  Digits as WrDigits,
  Input as WrInput,
  Separator as WrSeparator,
  Slider as WrSlider,
  Space as WrSpace,
  Box as WrBox,
  Button as WrButton,
  Collapsible as WrCollapsible,
  Scrollable as WrScrollable,
  Stack as WrStack,
  Accordion as WrAccordion,
  Drawer as WrDrawer,
  Tabs as WrTabs,
  ViewProps,
  Border,
} from 'wretched'
import {
  TextContainer,
  TextLiteral,
  TextProvider,
  TextStyle,
} from './components/TextReact'

const borders: Border[] = ['double', 'bold', 'dotted', 'rounded']

type Children = 'children' | 'child'
type WretchedView<
  T extends abstract new (arg: any, ...args: any) => any,
  OmitProps extends keyof ConstructorParameters<T>[0] = Children,
> = Omit<NonNullable<ConstructorParameters<T>[0]>, OmitProps>

type WretchedContainer<
  T extends abstract new (arg: any, ...args: any) => any,
  ChildrenProps extends keyof NonNullable<
    ConstructorParameters<T>[0]
  > = Children,
> = WretchedView<T, ChildrenProps> & {[Key in ChildrenProps]?: React.ReactNode}

type CheckboxProps = WretchedView<typeof WrCheckbox>
type CollapsibleTextProps = WretchedView<typeof WrCollapsibleText>
type ConsoleProps = WretchedView<typeof WrConsoleLog>
type DigitsProps = WretchedView<typeof WrDigits>
type InputProps = WretchedView<typeof WrInput>
type SeparatorProps = WretchedView<typeof WrSeparator>
type SliderProps = WretchedView<typeof WrSlider>
type SpaceProps = WretchedView<typeof WrSpace>
type BoxProps = WretchedContainer<typeof WrBox>
type ButtonProps = WretchedContainer<typeof WrButton>
type CollapsibleProps = WretchedContainer<
  typeof WrCollapsible,
  'collapsed' | 'expanded' | 'children'
>
type ScrollableProps = WretchedContainer<typeof WrScrollable>
type StackProps = WretchedContainer<typeof WrStack>
type StyleProps = WretchedContainer<typeof TextStyle>
type TextProps = WretchedContainer<typeof TextProvider>
// "complex" containers

type AccordionProps = WretchedContainer<typeof WrAccordion>
type AccordionSectionProps = WretchedContainer<typeof WrAccordion.Section>
type DrawerProps = WretchedContainer<
  typeof WrDrawer,
  'content' | 'drawer' | 'children'
>
type TabsProps = WretchedContainer<typeof WrTabs>
type TabsSectionProps = WretchedContainer<typeof WrTabs.Section>

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      // views
      'wr-br': {}
      'wr-checkbox': CheckboxProps
      'wr-collapsible-text': CollapsibleTextProps
      'wr-console': ConsoleProps
      'wr-digits': DigitsProps
      'wr-input': InputProps
      'wr-separator': SeparatorProps
      'wr-slider': SliderProps
      'wr-space': SpaceProps

      'wr-tree': ViewProps

      // "simple" containers
      'wr-box': BoxProps
      'wr-button': ButtonProps
      'wr-collapsible': CollapsibleProps

      'wr-scrollable': ScrollableProps
      'wr-stack': StackProps
      'wr-style': StyleProps
      'wr-text': TextProps

      // "complex" containers
      'wr-accordion': AccordionProps
      'wr-accordion-section': AccordionSectionProps
      'wr-drawer': DrawerProps

      'wr-tabs': TabsProps
      'wr-tabs-section': TabsSectionProps
    }
  }
}

function createView(type: string, props: Props): any {
  switch (type) {
    case 'text':
      return new TextLiteral(String(props.text) ?? '')
    case 'br':
    case 'wr-br':
      return new TextLiteral('\n')
    case 'wr-checkbox':
      return new WrCheckbox(props as any)
    case 'wr-collapsible-text':
      return new WrCollapsibleText(props as any)
    case 'wr-console':
      return new WrConsoleLog(props as any)
    case 'wr-digits':
      return new WrDigits(props as any)
    case 'wr-input':
      return new WrInput(props as any)
    case 'wr-literal':
      return new TextLiteral(props.text ?? '')
    case 'wr-separator':
      return new WrSeparator(props as any)
    case 'wr-slider':
      return new WrSlider(props as any)
    case 'wr-space':
      return new WrSpace(props as any)
    // case 'Tree':
    //   return
    case 'wr-box':
      return new WrBox(props as any)
    case 'wr-button':
      return new WrButton(props as any)
    case 'wr-collapsible':
      return new WrCollapsible(props as any)
    case 'wr-scrollable':
      return new WrScrollable(props as any)
    case 'wr-stack':
      return new WrStack(props as any)
    case 'wr-style':
      return new TextStyle(props as any)
    case 'wr-text':
      return new TextProvider(props as any)
    case 'wr-accordion':
      return new WrAccordion(props as any)
    case 'wr-accordion-section':
      return new WrAccordion.Section(props as any)
    case 'wr-drawer':
      return new WrDrawer(props as any)
    case 'wr-tabs':
      return new WrTabs(props as any)
    case 'wr-tabs-section':
      return new WrTabs.Section(props as any)
    case 'wr-window':
      return new WrWindow(props)
    default:
      throw Error(`Unknown type ${type}`)
  }
}

////
/// Views
//

export function Br(): JSX.Element {
  return <wr-br />
}
export function Checkbox(reactProps: CheckboxProps): JSX.Element {
  return <wr-checkbox {...reactProps} />
}
export function CollapsibleText(reactProps: CollapsibleTextProps): JSX.Element {
  return <wr-collapsible-text {...reactProps} />
}
export function ConsoleLog(reactProps: ConsoleProps): JSX.Element {
  return <wr-console {...reactProps} />
}
export function Digits(reactProps: DigitsProps): JSX.Element {
  return <wr-digits {...reactProps} />
}
export function Input(reactProps: InputProps): JSX.Element {
  return <wr-input {...reactProps} />
}

interface Separator {
  (reactProps: SeparatorProps): JSX.Element
  horizontal(reactProps: Omit<SeparatorProps, 'direction'>): JSX.Element
  vertical(reactProps: Omit<SeparatorProps, 'direction'>): JSX.Element
}
export const Separator: Separator = function Separator(
  reactProps: SeparatorProps,
): JSX.Element {
  return <wr-separator {...reactProps} />
}
Separator.horizontal = function SeparatorHorizontal(
  reactProps: Omit<SeparatorProps, 'direction'>,
) {
  return <wr-separator direction="horizontal" {...reactProps} />
}
Separator.vertical = function SeparatorHorizontal(
  reactProps: Omit<SeparatorProps, 'direction'>,
) {
  return <wr-separator direction="vertical" {...reactProps} />
}

interface Slider {
  (reactProps: SliderProps): JSX.Element
  horizontal(reactProps: Omit<SliderProps, 'direction'>): JSX.Element
  vertical(reactProps: Omit<SliderProps, 'direction'>): JSX.Element
}
export const Slider: Slider = function Slider(
  reactProps: SliderProps,
): JSX.Element {
  return <wr-slider {...reactProps} />
}
Slider.horizontal = function SliderHorizontal(
  reactProps: Omit<SliderProps, 'direction'>,
) {
  return <wr-slider direction="horizontal" {...reactProps} />
}
Slider.vertical = function SliderHorizontal(
  reactProps: Omit<SliderProps, 'direction'>,
) {
  return <wr-slider direction="vertical" {...reactProps} />
}

export function Space(reactProps: SpaceProps): JSX.Element {
  return <wr-space {...reactProps} />
}

interface TreeProps<T> extends ViewProps {
  data: T[]
  render: (datum: T) => React.ReactNode
  getChildren?: (datum: T) => T[] | undefined
  title: React.ReactNode | string
}
export function Tree<T>(reactProps: TreeProps<T>): JSX.Element {
  const {title, ...props} = reactProps
  const titleView = useMemo(() => {
    if (typeof title === 'string') {
      return <wr-text>{title}</wr-text>
    }
    return title
  }, [title])
  return <wr-tree {...props}>{titleView}</wr-tree>
}

////
/// "Simple" containers
//

export function Box(reactProps: BoxProps): JSX.Element {
  const {children, ...props} = reactProps
  return <wr-box {...props}>{children}</wr-box>
}
export function Button(reactProps: ButtonProps): JSX.Element {
  const {children, ...props} = reactProps
  return <wr-button {...props}>{children}</wr-button>
}
export function Collapsible(reactProps: CollapsibleProps): JSX.Element {
  const {collapsed, expanded, ...props} = reactProps
  return (
    <wr-collapsible {...props}>
      {collapsed}
      {expanded}
    </wr-collapsible>
  )
}

interface Stack {
  (reactProps: StackProps): JSX.Element
  down(reactProps: Omit<StackProps, 'direction'>): JSX.Element
  up(reactProps: Omit<StackProps, 'direction'>): JSX.Element
  left(reactProps: Omit<StackProps, 'direction'>): JSX.Element
  right(reactProps: Omit<StackProps, 'direction'>): JSX.Element
}
export const Stack: Stack = function Stack(reactProps: StackProps) {
  const {children, ...props} = reactProps
  return <wr-stack {...props}>{children}</wr-stack>
}
Stack.down = function StackLeft(reactProps: Omit<StackProps, 'direction'>) {
  const {children, ...props} = reactProps
  return (
    <wr-stack direction="down" {...props}>
      {children}
    </wr-stack>
  )
}
Stack.up = function StackLeft(reactProps: Omit<StackProps, 'direction'>) {
  const {children, ...props} = reactProps
  return (
    <wr-stack direction="up" {...props}>
      {children}
    </wr-stack>
  )
}
Stack.right = function StackLeft(reactProps: Omit<StackProps, 'direction'>) {
  const {children, ...props} = reactProps
  return (
    <wr-stack direction="right" {...props}>
      {children}
    </wr-stack>
  )
}
Stack.left = function StackLeft(reactProps: Omit<StackProps, 'direction'>) {
  const {children, ...props} = reactProps
  return (
    <wr-stack direction="left" {...props}>
      {children}
    </wr-stack>
  )
}
export function Scrollable(reactProps: ScrollableProps): JSX.Element {
  const {children, ...props} = reactProps
  return <wr-scrollable {...props}>{children}</wr-scrollable>
}
/**
 * <Style /> is similar to <Text/> but only allows inline styles (bold, etc).
 * Does not support align or wrap (block styles). Does not support 'font', because
 * font is not encodable via SGR codes (and that's how I'm styling and
 * concatenating the text nodes).
 */
export function Style(reactProps: StyleProps): JSX.Element {
  return <wr-style {...reactProps} />
}
/**
 * <Text /> is a container that sets the text properties of child TextLiterals
 * (font, style) and TextContainers (wrap, alignment)
 */
export function Text(reactProps: TextProps): JSX.Element {
  return <wr-text {...reactProps} />
}

////
/// "Complex" containers
//

interface Accordion {
  (reactProps: AccordionProps): JSX.Element
  Section(reactProps: Omit<AccordionSectionProps, 'direction'>): JSX.Element
}
export const Accordion: Accordion = function Accordion(
  reactProps: AccordionProps,
): JSX.Element {
  const {children, ...props} = reactProps
  return <wr-accordion {...props}>{children}</wr-accordion>
}
Accordion.Section = function SliderHorizontal(
  reactProps: Omit<AccordionSectionProps, 'direction'>,
) {
  const {children, ...props} = reactProps
  return <wr-accordion-section {...props}>{children}</wr-accordion-section>
}

interface Drawer {
  (reactProps: DrawerProps): JSX.Element
  top(reactProps: Omit<DrawerProps, 'location'>): JSX.Element
  right(reactProps: Omit<DrawerProps, 'location'>): JSX.Element
  bottom(reactProps: Omit<DrawerProps, 'location'>): JSX.Element
  left(reactProps: Omit<DrawerProps, 'location'>): JSX.Element
}
export const Drawer: Drawer = function Drawer(
  reactProps: DrawerProps,
): JSX.Element {
  const {children, content, drawer, ...props} = reactProps
  return (
    <wr-drawer {...props}>
      {content}
      {drawer}
      {children}
    </wr-drawer>
  )
}
Drawer.top = function DrawerLeft(reactProps: Omit<DrawerProps, 'location'>) {
  const {children, content, drawer, ...props} = reactProps
  return (
    <wr-drawer location="top" {...props}>
      {content}
      {drawer}
      {children}
    </wr-drawer>
  )
}
Drawer.right = function DrawerLeft(reactProps: Omit<DrawerProps, 'location'>) {
  const {children, content, drawer, ...props} = reactProps
  return (
    <wr-drawer location="right" {...props}>
      {content}
      {drawer}
      {children}
    </wr-drawer>
  )
}
Drawer.bottom = function DrawerLeft(reactProps: Omit<DrawerProps, 'location'>) {
  const {children, ...props} = reactProps
  return (
    <wr-drawer location="bottom" {...props}>
      {children}
    </wr-drawer>
  )
}
Drawer.left = function DrawerLeft(reactProps: Omit<DrawerProps, 'location'>) {
  const {children, ...props} = reactProps
  return (
    <wr-drawer location="left" {...props}>
      {children}
    </wr-drawer>
  )
}

interface Tabs {
  (reactProps: TabsProps): JSX.Element
  Section(reactProps: Omit<TabsSectionProps, 'direction'>): JSX.Element
}
export const Tabs: Tabs = function Tabs(reactProps: TabsProps): JSX.Element {
  const {children, ...props} = reactProps
  return <wr-tabs {...props}>{children}</wr-tabs>
}
Tabs.Section = function SliderHorizontal(
  reactProps: Omit<TabsSectionProps, 'direction'>,
) {
  const {children, ...props} = reactProps
  return <wr-tabs-section {...props}>{children}</wr-tabs-section>
}

type Props = Record<string, any>

interface Renderer<Node> {
  create(type: string, props: Props): Node
  insert(parent: Node, node: Node, before?: Node): void
  update(node: Node, props: Props): void
  remove(parent: Node, node: Node): void
}

const defer = Promise.prototype.then.bind(Promise.resolve())

function removeFromTextContainer(container: Container, child: View) {
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

    textContainer.add(child)
    return
  }

  let index: number | undefined = before
    ? parentInstance.children.indexOf(before)
    : -1
  if (index === -1) {
    index = undefined
  }

  parentInstance.add(child, index)
}

class RendererElement<T> {
  parentNode: RendererElement<T> | null = null
  nextSibling: RendererElement<T> | null = null
  previousSibling: RendererElement<T> | null = null
  firstChild: RendererElement<T> | null = null
  lastChild: RendererElement<T> | null = null
  props: Props = {}
  prevProps?: Props
  node?: any
  nodeType = ''

  constructor(
    private renderer: Renderer<T>,
    public localName: string,
  ) {
    this._commit = this._commit.bind(this)
  }
  set data(text: any) {
    this.setAttribute('text', String(text))
  }
  addEventListener(event, func) {
    console.log('=========== preact.tsx at line 530 ===========')
    console.log({event, func})
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
    return (this.node ||= this.renderer.create(this.localName, this.props))
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

  function createElementNS(_: unknown, type: string) {
    return new RendererElement(renderer, type)
  }

  function createTextNode(text: any) {
    const node = createElement('text')
    node.props.text = String(text)
    return node
  }

  function createRoot() {
    return createElement('wr-window')
  }

  return {createElement, createElementNS, createTextNode, createRoot}
}

const dom = createRendererDom({
  create(type, props) {
    return createView(type, props)
  },
  insert(parent, node, before) {
    if (!(parent instanceof Container)) {
      return
    }
    appendChild(parent, node, before)
  },
  remove(parent, node) {
    if (!(parent instanceof Container)) {
      return
    }
    removeChild(parent, node)
  },
  update(node, props) {
    node.update(props)
  },
})

Object.assign(global, {document: {}})
Object.assign(document, dom)

function Demo() {
  const [height, setHeight_] = useState(10)
  const [hello, leave] = useReducer<string, void>(
    state => (state === 'hello' ? 'goodbye' : 'hello'),
    'hello',
  )
  const [showExtra, toggleExtra] = useReducer<boolean, void>(
    state => !state,
    false,
  )
  const [debug, toggleDebug] = useReducer(state => !state, false)
  const [accordionMultiple, toggleAccordionMultiple] = useReducer(
    state => !state,
    false,
  )
  const [border, switchBorder] = useReducer<Border, void>((border: Border) => {
    borders.unshift(border)
    return borders.pop() as Border
  }, 'single')

  const setHeight = (height: number) => {
    if (debug) {
      console.debug({height})
    }
    setHeight_(height)
  }

  return (
    <Drawer.bottom>
      <Stack.right>
        <Box border="double" flex={1}>
          <Stack.down gap={1}>
            <Stack.right>
              <Space width={1} />
              <Slider
                direction="horizontal"
                range={[0, 20]}
                value={height}
                buttons
                step={1}
                border
                onChange={setHeight}
              />
              <Space width={1} />
              <Slider
                flex={1}
                direction="horizontal"
                range={[0, 20]}
                value={height}
                buttons
                step={1}
                border
                onChange={setHeight}
              />
              <Space width={1} />
            </Stack.right>
            <Separator.horizontal />
            <Stack.down>
              <Stack.right gap={1}>
                <Button text="-" onClick={() => setHeight(height - 1)} />
                <Button text="+" onClick={() => setHeight(height + 1)} />
                <Checkbox
                  text="Show Console Log"
                  onChange={toggleDebug}
                  value={debug}
                  hotKey="C-d"
                />
                <Checkbox
                  text="Accordion: multiple"
                  onChange={toggleAccordionMultiple}
                  value={debug}
                  hotKey="C-m"
                />
              </Stack.right>

              <Digits text={String(height)} />
            </Stack.down>
            <Tabs border>
              <Tabs.Section title="Text Example" height={height}>
                <Style bold foreground="blue">
                  {hello}{' '}
                  <Style italic foreground="green">
                    world
                  </Style>
                  , I hope you are doing well,{' '}
                  <Style italic>
                    all things <Style underline>considered</Style>
                  </Style>
                </Style>
                <br />
                world @ {height}
                <Br />
                👍{'\n'}
                👋
              </Tabs.Section>
              <Tabs.Section title="Another Example"></Tabs.Section>
            </Tabs>
            <Input
              wrap
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam interdum, magna eu pellentesque scelerisque, dui sodales enim, et vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit."
            />
            <Button
              text={hello === 'hello' ? 'Leave' : 'Enter'}
              onClick={leave}
            />
            <Stack.right>
              <Space flex={1} />
              <Button flex={3} text="Border" onClick={switchBorder} />
              <Space flex={1} />
            </Stack.right>
            <Button text={showExtra ? 'Hide' : 'Show'} onClick={toggleExtra} />
            {showExtra ? (
              <Scrollable height={3}>
                <Stack.down>
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (1)</Text>}
                    expanded={<Text bold>bye (1)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (2)</Text>}
                    expanded={<Text bold>bye (2)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (3)</Text>}
                    expanded={<Text bold>bye (3)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (4)</Text>}
                    expanded={<Text bold>bye (4)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (5)</Text>}
                    expanded={<Text bold>bye (5)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (6)</Text>}
                    expanded={<Text bold>bye (6)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (7)</Text>}
                    expanded={<Text bold>bye (7)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (8)</Text>}
                    expanded={<Text bold>bye (8)</Text>}
                  />
                  <Collapsible
                    isCollapsed
                    collapsed={<Text italic>HI (9)</Text>}
                    expanded={<Text bold>bye (9)</Text>}
                  />
                </Stack.down>
              </Scrollable>
            ) : null}
            {debug ? <ConsoleLog /> : null}
          </Stack.down>
        </Box>
        <Accordion multiple={accordionMultiple}>
          <Accordion.Section title="A">
            Yup, this is section A
          </Accordion.Section>
          <Accordion.Section title="B">You get the idea</Accordion.Section>
          <Accordion.Section title="C" width="shrink">
            <Stack.down>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              consectetur molestie faucibus. Phasellus iaculis pellentesque
              felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris
              tortor. Nam interdum, magna eu pellentesque scelerisque, dui ipsum
              adipiscing ante, vel ullamcorper nisl sapien id arcu. Nullam
              egestas diam eu felis mollis sit amet cursus enim vehicula.
              Quisque eu tellus id erat pellentesque consequat. Maecenas
              fermentum faucibus magna, eget dictum nisi congue sed.
              <CollapsibleText text="Quisque a justo a nisi eleifend facilisis sit amet at augue. Sed a sapien vitae augue hendrerit porta vel eu ligula. Proin enim urna, faucibus in vestibulum tincidunt, commodo sit amet orci. Vestibulum ac sem urna, quis mattis urna. Nam eget ullamcorper ligula. Nam volutpat, arcu vel auctor dignissim, tortor nisi sodales enim, et vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit." />
            </Stack.down>
          </Accordion.Section>
        </Accordion>
      </Stack.right>
      <Text alignment="center">Not much to see here</Text>
    </Drawer.bottom>
  )
}

interceptConsoleLog()

export async function run() {
  const root = dom.createRoot()

  render(<Demo />, root as any)
  const window = root.node
  const start = await Screen.start(window)
  const [screen, _] = start
}

run()
