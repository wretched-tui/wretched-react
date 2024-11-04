export function childToText(child: any) {
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
  } else if (child.type === 'br' || child.type === 'wr-br') {
    return '\n'
  } else if (child.type instanceof Function) {
    return childToText(child.type({}))
  } else {
    return `<${child.type} />`
  }
}

export function childrenToText(children: string | any[]) {
  if (Array.isArray(children)) {
    return children.map(childToText).join('')
  }

  return childToText(children)
}
