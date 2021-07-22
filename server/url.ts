

/**
 * url处理
 * @param {string} address 地址
 * @returns 
 */
export function parseUrl(address: string): URL {
  const url = new URL(address)
  return url
}
/**
 * 转换成qs
 */
export class qs {
  /**
   * querystring转对象
   * @param {string} querystring querystring
   */
  static parse(querystring: string) {
    // 暂存对象
    const query = Object.create(null)
    // 不存在则直接返回
    if (!querystring) return query
    // 遍历
    querystring.split('&').forEach(keyValue => {
      const [key, value] = keyValue.split('=')
      // 判断是否存在
      if (query[key]) {
        // 拼接
        query[key] = [query[key], value]
      } else query[key] = value
    })
    return query
  }
  /**
   * 对象转字符串
   * @param query query对象
   * @returns 
   */
  static stringify(query: Record<string, string[] | number[] | string>) {
    // 获取querystring
    const querystring = Object.keys(query).map(key => {
      // 获取内容
      const value = query[key]
      // 判断是否为数组
      if (Array.isArray(value)) {
        return value.map(v => `${key}=${v}`).join('&')
      } else {
        return `${key}=${value}`
      }
    }).join('&')
    return querystring
  }
}