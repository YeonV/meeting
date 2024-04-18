'use server'

import api from '@/lib/Strapi'

export async function getMe(strapiToken: string) {
  'use server'
  const me = await api('/users/me?populate=role.Name', strapiToken)
  return me
}

export async function getOtherMeetings(strapiToken: string) {
  'use server'
  const me = await getMe(strapiToken)
  const otherMeetings = await api(`/meetings?populate=user.username&filters[user][username][$nei]=${me.username}`, strapiToken)
  return otherMeetings.data
}

export async function getAllMeetings(strapiToken: string) {
  'use server'
  const me = await getMe(strapiToken)
  const otherMeetings = await api(`/meetings?populate=user.username&filters[user][username][$nei]=${me.username}`, strapiToken)
  return otherMeetings.data
}

export async function getMeetings(strapiToken: string) {
  'use server'
  const { meetings } = await api('/users/me?populate=meetings.Start', strapiToken)
  if (!meetings) return []
  return meetings
}

export const addMeeting = async ({
  start,
  end,
  strapiToken,
  user,
  title,
  description
}: {
  start: string
  end: string
  strapiToken: string
  user: number
  title: string
  description: string
}) => {
  const meetingData = {
    strapiToken,
    start,
    end,
    user,
    title,
    description
  }

  const response = await fetch(process.env.NEXT_PUBLIC_NEXTJS_URL + '/api/meeting', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meetingData)
  })

  if (response.ok) {
    return true
  }
  return false
}

export const deleteMeeting = async ({ id, strapiToken }: { id: number; strapiToken: string }) => {
  const meetingData = {
    strapiToken,
    id
  }

  const response = await fetch(process.env.NEXT_PUBLIC_NEXTJS_URL + '/api/meeting', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meetingData)
  })

  if (response.ok) {
    return true
  }
}

export const updateMeeting = async ({ id, strapiToken, description }: { id: number; strapiToken: string; description: string }) => {
  const meetingData = {
    strapiToken,
    id,
    description
  }

  const response = await fetch(process.env.NEXT_PUBLIC_NEXTJS_URL + '/api/meeting', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meetingData)
  })

  if (response.ok) {
    return true
  }
  return false
}
