


export class BingoResponse {
  body: string | Record<string, unknown> = ''
  headers = new Headers({
    'content-type': 'text/plain;charset=utf-8'
  })
  message = ''
  status = 200
  get type() {
    const type = this.headers.get('content-type') || ''
    return type
  }
  set type(value: string) {
    this.headers.set('content-type', value)
  }
  get(name: string) {
    return this.headers.get(name.toLowerCase()) || ''
  }
  set(name: string, value: string) {
    this.headers.set(name, value)
  }
  remove(name: string) {
    this.headers.delete(name)
  }
}