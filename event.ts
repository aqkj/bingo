/**
 * 事件分发
 */
interface IListener {
  eventName: string,
  callbacks: CallableFunction[]
}
export class Event {
  // 暂存监听事件
  private listeners: IListener[] = []
  /**
   * 分发事件
   * @param eventName 事件名称
   * @param values 传递值
   */
  emit(eventName: string, ...values: unknown[]): void {
    this.listeners.forEach((listener: IListener) => {
      // 找到方法并执行
      if (listener.eventName === eventName) {
        listener.callbacks.forEach(callback => {
          callback && callback(...values)
        })
      }
    })
  }
  /**
   * 事件监听
   * @param eventName 事件名称
   * @param fn 回调方法
   */
  on(eventName: string, fn: CallableFunction): void {
    const listener = this.listeners.find(item => item.eventName === eventName)
    if (listener) {
      listener.callbacks.push(fn)
    } else {
      // 新增
      this.listeners.push({
        eventName,
        callbacks: [fn]
      })
    }
  }
  /**
   * 解除监听
   * @param eventName 事件名称
   */
  off(eventName: string, fn?: CallableFunction): void {
    // 获取对应监听对象
    const listener = this.listeners.find(_listener => _listener.eventName === eventName)
    if (listener) {
      // 存在方法传入
      if (fn) {
        // 查找位置
        const index = listener.callbacks.indexOf(fn)
        // 移除
        if (index !== -1) listener.callbacks.splice(index, 1)
      } else {
        // 清空
        listener.callbacks = []
      }
    }
  }
}