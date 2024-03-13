import { REACT_ELEMENT } from './constants'
function render(VNode, containerDOM) {
  mount(VNode, containerDOM)
}
function mount(VNode, containerDOM) {
  let newDOM = createDOM(VNode)
  newDOM && containerDOM.appendChild(newDOM)
}
function getDomByFunctionComponent(vNode) {
  let { type, props } = vNode
  let renderNode = type(props)
  if (!renderNode) return null
  return createDOM(renderNode)
}
function getDomByClassComponent(vNode) {
  let { type, props } = vNode
  let renderNode = new type(props).render()
  if (!renderNode) return null
  return createDOM(renderNode)
}
function createDOM(VNode) {
  const { type, props } = VNode
  let dom
  if (
    typeof type === 'function' &&
    type.IS_CLASS_COMPONENT &&
    VNode.$$typeof === REACT_ELEMENT
  ) {
    return getDomByClassComponent(VNode)
  } else if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT) {
    return getDomByFunctionComponent(VNode)
  } else if (type && VNode.$$typeof === REACT_ELEMENT) {
    dom = document.createElement(type)
  }
  // 递归创建节点
  if (props) {
    if (typeof props.children === 'object' && props.children.type) {
      mount(props.children, dom)
    } else if (Array.isArray(props.children)) {
      mountArray(props.children, dom)
    } else if (typeof props.children === 'string') {
      dom.appendChild(document.createTextNode(props.children))
    }
  }
  // 给dom添加属性
  setPropsForDom(dom, props)
  return dom
}
function mountArray(children, parent) {
  if (!Array.isArray(children)) return
  for (let i = 0; i < children.length; i++) {
    if (typeof children[i] == 'string') {
      parent.appendChild(document.createTextNode(children[i]))
    } else {
      mount(children[i], parent)
    }
  }
}
function setPropsForDom(dom, VNodeProps = {}) {
  if (!dom) return
  for (const key in VNodeProps) {
    // 忽略children
    if (key === 'children') continue
    if (Object.hasOwnProperty.call(VNodeProps, key)) {
      if (/^on[A-Z].*/.test(key)) {
        // 处理事件逻辑
      } else if (key === 'style') {
        Object.entries(VNodeProps[key]).forEach(([styleName, styleValue]) => {
          dom.style[styleName] = styleValue
        })
      } else {
        dom[key] = VNodeProps[key]
      }
    }
  }
}
export function findDomByVNode(VNode) {
  if (!VNode) return
  if (VNode.dom) return VNode.dom
}
export function updateDomTree(oldDOM, newVNode) {
  if (!oldDOM) return
  let parentNode = oldDOM.parentNode
  parentNode.removeChild(oldDOM)
  parentNode.appendChild(createDOM(newVNode))
}
const ReactDom = {
  render,
}
export default ReactDom
