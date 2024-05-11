import moment from 'moment'
import CardLine from './CardLine'
import useStore from '@/store/useStore'
import { Card, CardActions, CardContent, CardHeader, Divider, Grid, IconButton, TextField, Typography } from '@mui/material'
import { addToCalendar, renderDate, renderDuration, renderTime } from '@/lib/utils'
import { CalendarToday, Delete, Edit, MoreVert, Save } from '@mui/icons-material'
import { deleteMeeting, updateMeeting } from '@/app/actions'
import { useSession } from 'next-auth/react'
import { IMeeting } from '@/types/meeting/IMeeting'
import { useRef, useState } from 'react'

const Meeting = ({ meeting, notify }: { meeting: IMeeting; notify?: () => void }) => {
  const { data: session } = useSession()
  const fetchMeetings = useStore((state) => state.fetchMeetings)
  const [edit, setEdit] = useState(false)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const language = useStore((state) => state.language)

  return (
    <Grid item key={meeting.id}>
      <Card sx={{ width: 350 }}>
        <CardHeader title={meeting.title} subheader={moment(meeting.Start).fromNow()} />
        <CardContent sx={{ pt: 0 }}>
          <Divider sx={{ mb: 2 }} />
          <CardLine label='Datum' value={renderDate(meeting.Start, language)} />
          <CardLine label='Dauer' value={renderDuration(meeting.Start, meeting.End, language)} />
          <CardLine label='Start' value={renderTime(meeting.Start, language)} />
          <CardLine label='Ende' value={renderTime(meeting.End, language)} />
          <Divider sx={{ my: 2 }} />
          <Typography color='text.secondary' sx={{ fontSize: 14, marginBottom: 0.5 }} component='div'>
            Beschreibung:
          </Typography>
          <TextField fullWidth multiline disabled={!edit} inputRef={descriptionRef} defaultValue={meeting.description} minRows={4} maxRows={4} />
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <IconButton
            onClick={async () => {
              if (meeting?.id) {
                addToCalendar(meeting)
              }
            }}
          >
            <CalendarToday />
          </IconButton>
          <IconButton
            onClick={async () => {
              if (session?.strapiToken && meeting?.id) {
                await deleteMeeting({
                  id: meeting.id,
                  strapiToken: session?.strapiToken || ''
                })
                await fetchMeetings(session?.strapiToken || '')
                notify ? notify() : null
              }
            }}
          >
            <Delete />
          </IconButton>
          <IconButton
            onClick={() => {
              if (edit && session?.strapiToken && meeting?.id && descriptionRef.current && descriptionRef.current.value !== meeting.description) {
                updateMeeting({
                  id: meeting.id,
                  strapiToken: session?.strapiToken || '',
                  description: descriptionRef.current.value
                })
              }
              setEdit(!edit)
            }}
          >
            {edit ? <Save /> : <Edit />}
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default Meeting
