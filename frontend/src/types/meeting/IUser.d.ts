export interface IUser {
  id: number
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  meetings: IMeeting[]
  data: any
}
