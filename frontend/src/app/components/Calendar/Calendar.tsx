import type { ICalendar } from './Caldendar.props'
import { useRef, useEffect, useState } from 'react'
import { dayMs, getDateWeek, getLastMonday, roundToNearestMinute, trans, weekMs } from '@/lib/utils'
import { Stack, useTheme } from '@mui/material'
import CaptionTime from './CaptionTime'
import CaptionDay from './CaptionDay'
import Controls from './Controls'
import Slot from './Slot'
import useStore from '@/store/useStore'

function Calendar({
  meetings = [],
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  minutesPerSlot = 15,
  startHour = 8,
  endHour = 19,
  meetingStartKey = 'Start',
  meetingEndKey = 'End',
  sxConfig,
  dialogs,
  controls = 'top',
  notify
}: ICalendar) {
  const slotsOfDay = Array.from({ length: (endHour - startHour) * (60 / minutesPerSlot) }, (_, i) => (startHour + i * (minutesPerSlot / 60)).toFixed(2))
  const theme = useTheme()
  const scrollRef = useRef<HTMLButtonElement | null>(null)
  const currentDate = new Date()
  const currentDay = currentDate.getDay()
  const currentSlot = currentDate.getHours() + currentDate.getMinutes() / 60
  const [weekOffset, setWeekOffset] = useState(0)
  const [yearOffset, setYearOffset] = useState(0)
  const otherMeetings = useStore((state) => state.otherMeetings)
  const getMeetingForSlot = (slotDate: Date) => {
    return [...meetings, ...otherMeetings].find((meeting) => {
      if (!meeting[meetingStartKey] || !meeting[meetingEndKey] || !meetingStartKey || !meetingEndKey) {
        return false
      }
      const start = roundToNearestMinute(new Date(meeting[meetingStartKey]?.toString()))
      const end = roundToNearestMinute(new Date(meeting[meetingEndKey]?.toString()))
      return slotDate >= start && slotDate < end
    })
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'instant', block: 'center' })
  }, [])

  useEffect(() => {
    setYearOffset(Math.floor((getDateWeek() + weekOffset) / 53))
  }, [weekOffset])

  return (
    <div style={{ width: '1380px' }}>
      {controls === 'top' && (
        <Controls weekOffset={weekOffset} setWeekOffset={setWeekOffset} yearOffset={yearOffset} scrollRef={scrollRef} sx={sxConfig?.sxControls} />
      )}
      <Stack spacing={2} sx={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', padding: '0 1rem', position: 'relative', ...sxConfig?.sx }}>
        <Stack direction='row' spacing={1}>
          <Stack key='time' direction='column' spacing={0}>
            <div className='stickyHeader' style={{ background: theme.palette.background.paper, display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              {controls === 'left' && (
                <Controls
                  direction='column'
                  weekOffset={weekOffset}
                  setWeekOffset={setWeekOffset}
                  yearOffset={yearOffset}
                  scrollRef={scrollRef}
                  sx={sxConfig?.sxControls}
                />
              )}
            </div>
            <Stack direction='column' spacing={0} paddingTop={0} alignItems={'center'}>
              {slotsOfDay.map((slot, slotIndex) => (
                <CaptionTime key={slot} slot={slot} slotIndex={slotIndex} currentSlot={currentSlot} scrollRef={scrollRef} sx={sxConfig?.sxCaptionTime} />
              ))}
            </Stack>
          </Stack>

          {daysOfWeek.map((day, dayIndex) => (
            <Stack key={day} direction='column' spacing={0}>
              <div className='stickyHeader' style={{ background: theme.palette.background.paper }}>
                <CaptionDay
                  index={dayIndex}
                  currentDay={currentDay}
                  date={new Date(getLastMonday().getTime() + dayIndex * dayMs + weekOffset * weekMs)}
                  sx={sxConfig?.sxCaptionDay}
                />
              </div>
              <Stack direction='column' spacing={0} paddingTop={2}>
                {slotsOfDay.map((slot, slotIndex) => {
                  const slotDate = new Date(
                    new Date(new Date(new Date(getLastMonday().setHours(startHour)).setMinutes(slotIndex * minutesPerSlot)).setSeconds(0)).getTime() +
                      dayIndex * dayMs +
                      weekOffset * weekMs
                  )
                  const meeting = getMeetingForSlot(slotDate)
                  return (
                    <Slot
                      key={slot}
                      slot={slot}
                      slotIndex={slotIndex}
                      dayIndex={dayIndex}
                      currentDay={currentDay}
                      currentSlot={currentSlot}
                      date={slotDate}
                      meeting={meeting}
                      sx={sxConfig?.sxSlot}
                      addTitle={dialogs?.addTitle}
                      endHour={endHour}
                      minutesPerSlot={minutesPerSlot}
                      notify={notify}
                    />
                  )
                })}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </div>
  )
}

export default Calendar
