import { Grid } from '@mui/material'
import { IMeeting } from '@/types/meeting/IMeeting'
import Meeting from './Meeting'

const Meetings = ({ meetings, notify }: { meetings: IMeeting[]; notify?: () => void }) => {
  return (
    <Grid container spacing={2} width={'100%'}>
      {meetings.map((meeting) => (
        <Meeting key={meeting.id} meeting={meeting} notify={notify} />
      ))}
    </Grid>
  )
}

export default Meetings
