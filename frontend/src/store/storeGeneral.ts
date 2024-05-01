import type { IStore } from './useStore'
import { produce } from 'immer'
import { deleteMeeting, getAllMeetings, getMe, getMeetings, getOtherMeetings } from '@/app/actions'
import { IMeeting } from '@/types/meeting/IMeeting'
import { IMe } from '@/types/meeting/IMe'

const storeGeneral = (set: any) => ({
  me: {} as IMe,
  setMe: (me: IMe): void =>
    set(
      produce((state: IStore) => {
        state.me = me
      }),
      false,
      'general/setDarkMode'
    ),
  fetchMe: async (strapiToken: string) => {
    const me = await getMe(strapiToken)
    delete me.meetings
    set(
      produce((state: IStore) => {
        state.me = me
      }),
      false,
      'general/getMe'
    )
    return me
  },
  meetings: [] as IMeeting[],
  setMeetings: (meetings: IMeeting[]): void =>
    set(
      produce((state: IStore) => {
        state.meetings = meetings
      }),
      false,
      'general/setMeetings'
    ),
  fetchMeetings: async (strapiToken: string) => {
    const meetings = await getMeetings(strapiToken)
    set(
      produce((state: IStore) => {
        state.meetings = meetings
      }),
      false,
      'general/getMeetings'
    )
    return meetings
  },
  removeMeeting: async (id: number, strapiToken: string) => {
    await deleteMeeting({ id, strapiToken })
    set(
      produce((state: IStore) => {
        state.meetings = state.meetings.filter((meeting) => meeting.id !== id)
      }),
      false,
      'general/removeMeeting'
    )
  },
  otherMeetings: [] as IMeeting[],
  setOtherMeetings: (meetings: IMeeting[]): void =>
    set(
      produce((state: IStore) => {
        state.otherMeetings = meetings.map((meeting) => {
          const { attributes, ...rest } = meeting
          const data = { ...attributes, ...rest }
          delete data.user
          return data
        })
      }),
      false,
      'general/setOtherMeetings'
    ),
  fetchOtherMeetings: async (strapiToken: string) => {
    const otherMeetings = await getOtherMeetings(strapiToken)
    set(
      produce((state: IStore) => {
        state.otherMeetings = otherMeetings.map((meeting: any) => {
          const { attributes, ...rest } = meeting
          const data = { ...attributes, ...rest }
          delete data.user
          delete data.title
          delete data.description
          return data
        })
      }),
      false,
      'general/getOtherMeetings'
    )
    return otherMeetings
  },
  fetchAllMeetings: async (strapiToken: string) => {
    const meetings = await getAllMeetings(strapiToken)
    // console.log(meetings)
    set(
      produce((state: IStore) => {
        state.meetings = meetings.map((meeting: any) => {
          const { attributes, ...rest } = meeting
          const data = { ...attributes, ...rest }
          return data
        })
      }),
      false,
      'general/getAllMeetings'
    )
    return meetings
  }
})

export default storeGeneral
