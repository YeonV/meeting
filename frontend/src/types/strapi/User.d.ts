export type StrapiUserT = {
  id: number
  username: string
  email: string
  blocked: boolean
  provider: 'local' | 'google' | 'github' | 'spotify' | 'twitter' | 'discord'
  role?: string
}

export type StrapiLoginResponseT = {
  jwt: string
  user: StrapiUserT
}
