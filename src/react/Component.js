import { updateDomTree, findDomByVNode } from './react-dom'
export let updaterQueue = {
  isBatch: false,
  updaters: new Set(),
}

export function flushUpdaterQueue() {
  updaterQueue.isBatch = false
  // 使用forof 遍历Set集合
  for (const updater of updaterQueue.updaters) {
    updater.launchUpdate()
  }
  updaterQueue.updaters.clear()
}

class Updater {
  constructor(ClassComponentInstance) {
    this.ClassComponentInstance = ClassComponentInstance
    this.pendingStates = []
  }
  addState(partialState) {
    this.pendingStates.push(partialState)
    this.preHandleForUpdate()
  }
  preHandleForUpdate() {
    // 如果是批量更新
    if (updaterQueue.isBatch) {
      updaterQueue.updaters.add(this)
    } else {
      this.launchUpdate()
    }
  }
  launchUpdate() {
    const { ClassComponentInstance, pendingStates } = this
    if (pendingStates.length === 0) return
    ClassComponentInstance.status = this.pendingStates.reduce(
      (prev, next) => ({
        ...prev,
        ...next,
      }),
      this.ClassComponentInstance.state,
    )
    this.pendingStates.length = 0
    ClassComponentInstance.update()
  }
}
export default class Component {
  static IS_CLASS_COMPONENT = true
  constructor(props) {
    this.props = props
    this.state = {}
    this.updater = new Updater(this)
  }
  setState(partialState) {
    this.updater.addState(partialState)
  }
  update() {
    // 拿到旧的VNode
    let oldVNode = this.oldVNode
    // 获取旧的Dom
    let oldDOM = findDomByVNode(oldVNode)
    // 拿到新的
    let newVNode = this.render()
    // 更新
    updateDomTree(oldDOM, newVNode)
    this.oldVNode = newVNode
  }
}
