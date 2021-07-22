/**
 * context
 */

import { ServerRequest } from 'https://deno.land/std@0.102.0/http/server.ts'
import { BingoApp } from './app.ts'
import { BingoRequest } from './request.ts'
import { BingoResponse } from './response.ts'
export class BingoContext {
  app!: BingoApp
  request: BingoRequest
  response: BingoResponse
  constructor(req: ServerRequest) {
    this.request = new BingoRequest(req)
    this.response = new BingoResponse()
  }
  get body() {
    return this.response.body
  }
  set body(val) {
    this.response.body = val
  }
}
