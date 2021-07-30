/**
 * context
 */

import { ServerRequest } from 'https://deno.land/std@0.102.0/http/server.ts'
import { BingoApp } from './app.ts'
import { BingoRequest } from './request.ts'
import { BingoResponse } from './response.ts'
import { HttpError } from '../error.ts'
export class BingoContext {
  /**
   * app
   */
  app!: BingoApp
  /**
   * 请求对象
   */
  request: BingoRequest
  /**
   * 响应对象
   */
  response: BingoResponse
  constructor(req: ServerRequest) {
    this.request = new BingoRequest(req)
    this.response = new BingoResponse()
  }
  /**
   * 清除response头部信息
   * @param name 头部名称
   */
  remove(name: string) {
    this.response.remove(name)
  }
  /**
   * 设置response头部信息
   * @param name 头部名称
   * @param value 内容
   */
  set(name: string, value: string) {
    this.response.set(name, value)
  }
  /**
   * 获取request下的header
   * @param name 头部名称
   */
  get(name: string) {
    return this.request.get(name)
  }
  /**
   * 获取/设置返回结果
   */
  get body() {
    return this.response.body
  }
  set body(val) {
    this.response.body = val
  }
  /**
   * 获取/设置响应状态码
   */
  get status() {
    return this.response.status
  }
  set status(value) {
    this.response.status = value
  }
  /**
   * 获取/设置响应状态信息
   */
  get message() {
    return this.response.message
  }
  set message(value) {
    this.response.message = value
  }
  /**
   * 获取/设置响应内容类型
   */
  get type() {
    return this.response.type
  }
  set type(value) {
    this.response.type = value
  }
  /**
   * 获取/设置请求方法
   */
  get method() {
    return this.request.method
  }
  set method(value) {
    this.request.method = value
  }
  /**
   * 获取/设置请求url
   */
  get url() {
    return this.request.url
  }
  set url(value) {
    this.request.url = value
  }
  /**
   * 获取请求query字符串格式
   */
  get querystring() {
    return this.request.querystring
  }
  /**
   * 获取请求query对象格式
   */
  get query() {
    return this.request.query
  }
  /**
   * 获取请求search参数
   */
  get search() {
    return this.request.search
  }
  /**
   * 获取请求path参数
   */
  get path() {
    return this.request.path
  }
  /**
   * 获取请求origin参数
   */
  get origin() {
    return this.request.origin
  }
  /**
   * 获取请求href参数
   */
  get href() {
    return this.request.href
  }
  /**
   * 获取请求protocol参数
   */
  get protocol() {
    return this.request.protocol
  }
  /**
   * 获取请求host参数
   */
  get host() {
    return this.request.host
  }
  /**
   * 获取请求hostname参数
   */
  get hostname() {
    return this.request.hostname
  }
  /**
   * 获取请求URL参数
   */
  get URL() {
    return this.request.URL
  }
  /**
   * 获取请求header参数
   */
  get header() {
    return this.request.header
  }
  /**
   * 获取请求headers参数
   */
  get headers() {
    return this.request.headers
  }
  /**
   * 抛出错误
   * @param status 状态ma码
   * @param msg 信息
   */
  throw(status: number, msg: string = '') {
    throw new HttpError(status, msg)
  }
}
