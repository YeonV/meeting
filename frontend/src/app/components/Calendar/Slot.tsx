import { addToCalendar, calculateEndSlot, formatMeetingTime, formatTime, formatTimeRange, roundToNearestMinute } from '@/lib/utils'
import {
  Card,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Popover,
  Slider,
  Stack,
  TextField,
  Typography,
  useTheme,
  CardHeader,
  CardContent
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { CSSProperties, useEffect, useState } from 'react'
import { DropzoneArea } from 'mui-file-dropzone'
import { IMeeting } from '@/types/meeting/IMeeting'
import useStore from '@/store/useStore'
import { addMeeting, deleteMeeting, updateMeeting } from '@/app/actions'

const Slot = ({
  slot,
  slotIndex,
  dayIndex,
  currentDay,
  currentSlot,
  date,
  meeting,
  hourGutter,
  sx,
  addTitle = 'Add Meeting',
  endHour = 19,
  minutesPerSlot = 15,
  notify
}: {
  slot: string
  slotIndex: number
  dayIndex: number
  currentDay: number
  currentSlot: number
  date: Date
  meeting?: IMeeting
  hourGutter?: boolean
  sx?: CSSProperties
  addTitle?: string
  editTitle?: string
  endHour?: number
  minutesPerSlot?: number
  notify?: () => void
}) => {
  const theme = useTheme()
  const { data: session } = useSession()

  const [files, setFiles] = useState<File[]>([])

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [whole, fraction] = slot.split('.')
  const [wholeEnd, setWholeEnd] = useState<string>('00')
  const [fractionEnd, setFractionEnd] = useState<string>('00')

  const minutes = fraction ? (parseInt(fraction) * 60) / 100 : '00'
  const minutesEnd = fractionEnd ? (parseInt(fractionEnd) * 60) / 100 : '00'
  const paddedHour = whole.padStart(2, '0')
  const paddedMinute = String(minutes).padStart(2, '0')
  const paddedHourEnd = wholeEnd.padStart(2, '0')
  const paddedMinuteEnd = String(minutesEnd).padStart(2, '0')
  const dateStr = date.toISOString().split('T')[0]
  const meetingStartDate = meeting ? roundToNearestMinute(new Date(new Date(meeting.Start).getTime())) : false
  const meetingEndDate = meeting ? roundToNearestMinute(new Date(new Date(meeting.End).getTime())) : false
  const [slotsToAdd, setSlotsToAdd] = useState(1)
  const slotStartDate = roundToNearestMinute(new Date(new Date(`${dateStr}T${paddedHour}:${paddedMinute}`).getTime()))
  const [slotEndDate, setSlotEndDate] = useState<Date>(new Date(new Date(`${dateStr}T${paddedHourEnd}:${paddedMinuteEnd}`).getTime()))
  const isMeetingStart = meeting && meetingStartDate && meetingStartDate.getTime() === slotStartDate.getTime()
  const isMeetingEnd = meeting && meetingEndDate && meetingEndDate.getTime() === slotEndDate.getTime()
  const [addMeetingOpen, setAddMeetingOpen] = useState(false)
  const [editMeetingOpen, setEditMeetingOpen] = useState(false)

  const fetchMeetings = useStore((state) => state.fetchMeetings)
  const removeMeeting = useStore((state) => state.removeMeeting)

  const handleFileChange = (newFile: File[]) => {
    setFiles(newFile)
    // console.log(files)
  }

  useEffect(() => {
    const [w, f] = calculateEndSlot(slot, slotsToAdd, minutesPerSlot)
    const minutesEnd = f ? (parseInt(f) * 60) / 100 : '00'
    const paddedHourEnd = w.padStart(2, '0')
    const paddedMinuteEnd = String(minutesEnd).padStart(2, '0')
    const slotEndDate = new Date(new Date(`${dateStr}T${paddedHourEnd}:${paddedMinuteEnd}`).getTime())
    setSlotEndDate(slotEndDate)
    setWholeEnd(w)
    setFractionEnd(f)
  }, [dateStr, slot, slotsToAdd, meeting, minutesPerSlot])

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const showInfo = Boolean(anchorEl)

  return (
    <>
      <Button
        onMouseEnter={(e) => (meeting ? handlePopoverOpen(e) : null)}
        onMouseLeave={() => (meeting ? handlePopoverClose() : null)}
        // disableElevation
        onClick={() => {
          if (meeting && session?.user?.strapiUserId) {
            setDescription(meeting.description || '')
            setEditMeetingOpen(true)
          } else {
            session?.user?.strapiUserId ? setAddMeetingOpen(true) : null
          }
        }}
        style={sx}
        sx={{
          ...{
            'pointerEvents': meeting && !meeting.title ? 'none' : 'auto',
            // 'borderRadius': `${isMeetingStart || !meeting ? '10px' : '0'} ${isMeetingStart || !meeting ? '10px' : '0'} ${
            //   isMeetingEnd || !meeting ? '10px' : '0'
            // } ${isMeetingEnd || !meeting ? '10px' : '0'}`,
            'borderRadius': 0,
            'padding': '0.2rem 0.5rem',
            'height': 57,
            'display': 'flex',
            'flexDirection': 'column',
            'justifyContent': 'flex-start',
            'alignItems': 'flex-start',
            'textAlign': 'left',
            'marginBottom': hourGutter && slotIndex % 4 === 3 ? 2 : 0,
            'width': 250,
            'wordBreak': 'break-all',
            'color': meeting && isMeetingStart ? theme.palette.getContrastText(theme.palette.text.primary) : 'transparent',
            '&:hover': !meeting
              ? {
                  color: theme.palette.text.primary
                  // borderRadius: '10px'
                }
              : { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light },
            'backgroundColor': meeting
              ? meeting.title
                ? theme.palette.primary.main
                : theme.palette.secondary.main
              : dayIndex === currentDay - 1 && Number(slot) <= currentSlot && Number(slot) + 0.25 > currentSlot
              ? 'rgba(128, 128, 128, 0.1)'
              : 'rgba(128, 128, 128, 0.02)'
          }
        }}
      >
        {meeting && isMeetingStart ? (
          <>{meeting.title?.substring(0, 35) || 'belegt'}</>
        ) : (
          <>
            {formatTime(whole, minutes)} - {formatTime(wholeEnd, minutesEnd)}
            <Typography variant='caption' sx={{ display: 'block' }}>
              {new Intl.DateTimeFormat(window.navigator.language, {}).format(new Date(date))}
            </Typography>
          </>
        )}
      </Button>
      <Dialog open={addMeetingOpen} onClose={() => setAddMeetingOpen(false)}>
        <DialogTitle>{addTitle}</DialogTitle>
        <DialogContent>
          <Stack direction='row' spacing={2} alignItems={'center'} pt={4}>
            <Typography sx={{ display: 'block' }}>Slots:</Typography>

            <Slider
              value={slotsToAdd}
              onChange={(_, value) => setSlotsToAdd(value as number)}
              valueLabelDisplay='auto'
              step={1}
              marks
              min={1}
              max={Math.min(8, (endHour - parseInt(whole)) * 4)}
            />
          </Stack>
          <Typography>
            Datum:{' '}
            {new Intl.DateTimeFormat(window.navigator.language, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }).format(new Date(date))}
          </Typography>
          <Typography sx={{ display: 'block' }}>
            Uhrzeit: {meeting ? formatMeetingTime(meeting) : formatTimeRange(whole, minutes, wholeEnd, minutesEnd)} Uhr
          </Typography>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
            margin='dense'
            id='name'
            name='title'
            label='Title'
            type='email'
            fullWidth
            variant='standard'
            inputProps={{ spellCheck: 'false', maxLength: 35 }}
          />
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            margin='dense'
            id='name'
            name='description'
            label='Beschreibung'
            type='email'
            fullWidth
            variant='standard'
            multiline
            maxRows={4}
            spellCheck='false'
          />
          <DropzoneArea
            fileObjects={files} // Add the fileObjects property with an empty array value
            onChange={handleFileChange}
            acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
            filesLimit={1}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMeetingOpen(false)}>Cancel</Button>
          <Button
            disabled={!(session?.user?.strapiUserId && session?.strapiToken && title && description)}
            onClick={async () => {
              if (session?.user?.strapiUserId && session?.strapiToken && title && description) {
                await addMeeting({
                  start: slotStartDate.toISOString(),
                  end: slotEndDate.toISOString(),
                  strapiToken: session?.strapiToken || '',
                  user: session?.user?.strapiUserId,
                  title: title,
                  description: description
                })
                await fetchMeetings(session?.strapiToken || '')
                notify ? notify() : null
                setAddMeetingOpen(false)
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!meeting && editMeetingOpen} onClose={() => setEditMeetingOpen(false)}>
        <DialogTitle>{meeting?.title}</DialogTitle>
        <DialogContent>
          <Stack direction='row' alignItems={'center'} pt={4}>
            <Typography sx={{ width: 80, display: 'block' }}>Datum:</Typography>
            <Typography sx={{ display: 'block' }}>
              {new Intl.DateTimeFormat(window.navigator.language, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }).format(new Date(meeting ? meeting.Start : date))}
            </Typography>
          </Stack>
          <Stack direction='row' alignItems={'center'} pt={1}>
            <Typography sx={{ width: 80, display: 'block' }}>Uhrzeit:</Typography>
            <Typography sx={{ display: 'block' }}>
              {meeting ? formatMeetingTime(meeting) : formatTimeRange(whole, minutes, wholeEnd, minutesEnd)} Uhr
            </Typography>
          </Stack>
          <TextField
            fullWidth
            value={description}
            sx={{ mt: 5, minWidth: 375 }}
            onChange={(e) => setDescription(e.target.value)}
            required
            margin='dense'
            id='name'
            name='description'
            label='Beschreibung'
            type='email'
            variant='outlined'
            multiline
            spellCheck='false'
            minRows={4}
            maxRows={4}
          />
        </DialogContent>
        <DialogActions sx={{ pl: 3, pr: 3, pb: 2 }}>
          <Button
            color='error'
            onClick={async () => {
              if (session?.strapiToken && meeting?.id) {
                await removeMeeting(meeting.id, session?.strapiToken || '')
                notify ? notify() : null
              }
              setEditMeetingOpen(false)
            }}
          >
            Delete
          </Button>
          <Button
            onClick={async () => {
              if (meeting?.id) {
                addToCalendar(meeting)
              }
            }}
          >
            Add to Calendar
          </Button>
          <Button onClick={() => setEditMeetingOpen(false)}>Cancel</Button>
          <Button
            color='primary'
            disabled={meeting?.description === description}
            onClick={() => {
              if (session?.strapiToken && meeting?.id) {
                updateMeeting({
                  id: meeting.id,
                  strapiToken: session?.strapiToken || '',
                  description: description
                })
              }
              setEditMeetingOpen(false)
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Popover
        id='mouse-over-popover'
        sx={{
          pointerEvents: 'none'
        }}
        open={showInfo}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Card sx={{ p: 1 }}>
          <CardHeader
            title={meeting?.title}
            subheader={`${new Intl.DateTimeFormat(window.navigator.language, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }).format(new Date(meeting ? meeting.Start : date))}, ${
              meeting ? formatMeetingTime(meeting) : formatTimeRange(whole, minutes, wholeEnd, minutesEnd)
            }`}
          />
          <CardContent>
            <TextField fullWidth multiline disabled value={meeting?.description} />
          </CardContent>
        </Card>
      </Popover>
    </>
  )
}

export default Slot
