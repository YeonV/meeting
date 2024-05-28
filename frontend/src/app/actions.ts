'use server'

import api from '@/lib/Strapi'
import CryptoJS from 'crypto-js'

export async function getMe(strapiToken: string) {
  'use server'
  const me = await api('/users/me?populate=role.Name', strapiToken)
  return me
}

export async function getOtherMeetings(strapiToken: string) {
  'use server'
  const me = await getMe(strapiToken)
  const otherMeetings = await api(
    `/meetings?populate=user.username&filters[user][username][$nei]=${me.username}`,
    strapiToken
  )
  return otherMeetings.data
}

export async function getAllMeetings(strapiToken: string) {
  'use server'
  const me = await getMe(strapiToken)
  const otherMeetings = await api(
    `/meetings?populate=user.username&filters[user][username][$nei]=${me.username}`,
    strapiToken
  )
  return otherMeetings.data
}

export async function getMeetings(strapiToken: string) {
  'use server'
  const { meetings } = await api(
    '/users/me?populate=meetings.Start',
    strapiToken
  )
  if (!meetings) return []
  return meetings
}
export async function encrypt(data: any) {
  'use server'
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.NEXT_PUBLIC_CRYPTO_KEY || 'yz'
  ).toString()
}

export async function decrypt(data: string) {
  'use server'
  const bytes = CryptoJS.AES.decrypt(
    data,
    process.env.NEXT_PUBLIC_CRYPTO_KEY || 'yz'
  )
  return bytes.toString(CryptoJS.enc.Utf8)
}

// export async function encrypt(data: any) {
//   'use server'
//   const key = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_CRYPTO_KEY || 'yz');
//   const iv = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_CRYPO_IV || '1234567890123456');
//   const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, { iv: iv });
//   return encrypted.toString();
// }

// export async function decrypt(data: string) {
//   'use server'
//   const key = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_CRYPTO_KEY || 'yz');
//   const iv = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_CRYPO_IV || '1234567890123456');
//   const decrypted = CryptoJS.AES.decrypt(data, key, { iv: iv });
//   return decrypted.toString(CryptoJS.enc.Utf8);
// }

const url = `${process.env.NEXT_PUBLIC_NEXTJS_URL_DOCKER}/api/meeting`

export const addMeeting = async ({
  start,
  end,
  strapiToken,
  user,
  title,
  description,
}: {
  start: string
  end: string
  strapiToken: string
  user: number | string
  title: string
  description: string
}) => {
  const meetingData = {
    strapiToken,
    start,
    end,
    user,
    title,
    description,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meetingData),
  })

  if (response.ok) {
    return true
  }
  return false
}

export const deleteMeeting = async ({
  id,
  strapiToken,
}: {
  id: number
  strapiToken: string
}) => {
  const meetingData = {
    strapiToken,
    id,
  }

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meetingData),
  })

  if (response.ok) {
    return true
  }
}

export const updateMeeting = async ({
  id,
  strapiToken,
  description,
}: {
  id: number
  strapiToken: string
  description: string
}) => {
  const meetingData = { strapiToken, id, description }

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meetingData),
  })

  if (response.ok) {
    return true
  }
  return false
}
