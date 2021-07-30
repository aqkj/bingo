/**
 * 错误
 */
import { status } from "https://deno.land/x/status@0.1.0/status.ts";
/**
 * http错误
 */
export class HttpError extends Error {
  status: number
  constructor(code: number, message?: string) {
    super(message || status(code) as string)
    Error.captureStackTrace && Error.captureStackTrace(this, HttpError)
    this.name = 'HttpError'
    this.status = code
  }
}