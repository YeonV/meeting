export type FetchOptionsType = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE'
  headers?: {
    'Authorization'?: string
    'Content-Type'?: string
  }
  body?: string
  next?: {
    tags?: string[]
  }
}
