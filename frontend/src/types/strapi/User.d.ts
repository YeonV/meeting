export type StrapiUserT = {
  id: number
  username: string
  email: string
  blocked: boolean
  provider: 'local' | 'google'
  role?: string
}

export type StrapiLoginResponseT = {
  jwt: string
  user: StrapiUserT
}
