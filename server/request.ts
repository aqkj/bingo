/**
 * 请求
 */

import { ServerRequest } from 'https://deno.land/std@0.102.0/http/server.ts'
import { parseUrl, qs } from './url.ts'
export class BingoRequest {
  URL: URL
  constructor(public req: ServerRequest) {
    this.URL = parseUrl(this.get('referrer') || this.get('referer') || this.href)
  }
  get url() {
    return this.req.url
  }
  set url(val) {
    this.req.url = val
  }
  get headers() {
    return this.req.headers
  }
  set headers(val) {
    this.req.headers = val
  }
  get header() {
    return this.req.headers
  }
  set header(val) {
    this.req.headers = val
  }
  get method() {
    return this.req.method.toLowerCase()
  }
  set method(val) {
    this.req.method = val.toLowerCase()
  }
  get host() {
    return this.get('host') as string
  }
  get origin() {
    return `${this.protocol}://${this.host}`
  }
  get href() {
    return `${this.origin}${this.req.url}`
  }
  get protocol() {
    return 'http'
  }
  get path() {
    return this.URL.pathname
  }
  get search() {
    return this.URL.search
  }
  get hostname() {
    return this.URL.hostname
  }
  get length() {
    return ~~this.get('content-length')
  }
  get type() {
    return this.get('content-type').slice(0, -1)
  }
  get querystring() : string {
    return this.URL.search.slice(1)
  }
  get query() {
    return qs.parse(this.querystring)
  }
  /**
   * 获取headers对应field
   * @param {string} field 字段
   */
  get(field: string) {
    field = field.toLowerCase()
    return this.req.headers.get(field) || ''
  }
}