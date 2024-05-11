import { IMeeting } from '@/types/meeting/IMeeting'
import moment from 'moment'
import 'moment/locale/de'

export function renderDate(dateString: string, locale = window.navigator.language) {
  let date = new Date(dateString)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function renderTime(dateString: string, locale = window.navigator.language) {
  let date = new Date(dateString)
  return (
    date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    }) + 'Uhr'
  )
}

export function renderDuration(dateStringStart: string, dateStringEnd: string, locale = window.navigator.language) {
  // Set the locale to German
  moment.locale(locale)

  // Parse the date strings into moment objects
  const start = moment(dateStringStart)
  const end = moment(dateStringEnd)

  // Calculate the duration between the two dates
  const duration = moment.duration(end.diff(start))

  // Calculate hours and minutes
  const hours = Math.floor(duration.asHours())
  const minutes = Math.floor(duration.asMinutes()) - hours * 60

  // Localize and humanize the duration
  const localizedDuration = `${hours > 0 ? `${hours} ${hours === 1 ? 'Stunde' : 'Stunden'} ` : ''}${minutes > 0 ? `${minutes} Minuten` : ''}`

  return localizedDuration
}

export function formatTime(hour: string, minutes: number | '00', locale = window.navigator.language) {
  const paddedHour = hour.padStart(2, '0')
  const paddedMinute = String(minutes).padStart(2, '0')
  const date = new Date(`2022-01-01T${paddedHour}:${paddedMinute}`)
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric' }).format(date)
}
export const formatTimeFromString = (time: string, locale = window.navigator.language) => {
  //2022-01-01T08:00:00.000Z
  const date = new Date(time)
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric' }).format(date)
}
export const formatMeetingTime = (meeting: IMeeting, locale = window.navigator.language) => {
  const start = formatTimeFromString(meeting.Start, locale)
  const end = formatTimeFromString(meeting.End, locale)
  return `${start} - ${end}`
}

export function formatTimeRange(
  hourStart: string,
  minutesStart: number | '00',
  hourEnd: string,
  minutesEnd: number | '00',
  locale = window.navigator.language
) {
  const startTime = formatTime(hourStart, minutesStart, locale)
  const endTime = formatTime(hourEnd, minutesEnd, locale)
  return `${startTime} - ${endTime}`
}

export function getLastMonday() {
  const date = new Date()
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is Sunday
  return new Date(date.setDate(diff))
}

export function getDateWeek(date?: Date) {
  const currentDate = typeof date === 'object' ? date : new Date()
  const januaryFirst = new Date(currentDate.getFullYear(), 0, 1)
  const daysToNextMonday = januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7
  const nextMonday = new Date(currentDate.getFullYear(), 0, januaryFirst.getDate() + daysToNextMonday)

  return currentDate < nextMonday ? 52 : currentDate > nextMonday ? Math.ceil((Number(currentDate) - Number(nextMonday)) / (24 * 3600 * 1000) / 7) : 1
}

export const roundToNearestMinute = (date: Date) => {
  date.setSeconds(0, 0)
  return date
}
export const trans = (translate: string, locale = window.navigator.language) => {
  return new Intl.DisplayNames(locale, { type: 'dateTimeField' }).of(translate)
}

export const dayMs = 24 * 60 * 60 * 1000

export const weekMs = 7 * dayMs

export const calculateEndSlot = (startSlot: string, slotsToAdd: number, minutesPerSlot: number) => {
  const [wholeEnd, fractionEnd] = (parseFloat(startSlot) + (slotsToAdd * minutesPerSlot) / 60).toFixed(2).toString().split('.')
  return [wholeEnd, fractionEnd]
}

export const addToCalendar = async (meeting: IMeeting) => {
  const res = await fetch(process.env.NEXT_PUBLIC_NEXTJS_URL + '/api/calendar', {
    method: 'POST',
    body: JSON.stringify(meeting),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Read the response body as text
  const data = await res.text()

  // Create a Blob from the data
  const blob = new Blob([data], { type: 'text/calendar' })

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob)

  // Create a link and trigger a download
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `meeting-${meeting.id}.ics`)
  document.body.appendChild(link)
  link.click()
}

export function transformData(data: any) {
  return data.map((item: any) => {
    const { attributes, ...rest } = item
    return { ...attributes, ...rest }
  })
}

export function formatedDayDate(date: any, t: (message: keyof typeof messages.en) => string) {
  const diff = moment().startOf('day').diff(moment(date).startOf('day'), 'days')
  switch (diff) {
    case 0:
      return t('Today')
    case 1:
      return t('Yesterday')
    case 2:
      return t('Day before yesterday')
    default:
      return moment(date).format('D.M.YYYY')
  }
}

import { useState, useEffect, use } from 'react'
import messages, { LanguageCode } from './translations' // Import your translations
import { ValueOf } from 'next/dist/shared/lib/constants'

function useTranslation(language = 'en' as LanguageCode) {
  // Set default language
  const [translatedMessages, setTranslatedMessages] = useState({} as ValueOf<typeof messages>)

  useEffect(() => {
    const translationData = messages[language] || messages.en // Fallback to default
    setTranslatedMessages(translationData)
  }, [language])

  const t = (message: keyof typeof messages.en) => translatedMessages[message] || message

  return { t }
}

export default useTranslation
