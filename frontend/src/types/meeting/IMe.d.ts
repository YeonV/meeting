export interface IMe {
  id: number
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  meetings: IMeeting[]
  role: {
    id: number
    name: string
    description: string
    type: string
  }
}
