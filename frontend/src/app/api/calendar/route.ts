import { createEvent } from 'ics'
import { NextApiResponse } from 'next'
import { pipeline } from 'stream/promises'
import { Readable, Writable } from 'stream'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest, res: NextApiResponse<any>) {
  if (req.method === 'POST') {
    let data = ''
    await pipeline(
      (req as any).body as Readable,
      new Writable({
        write(chunk, encoding, callback) {
          data += chunk
          callback()
        }
      })
    )
    const meeting = JSON.parse(data)

    const event = {
      start: meeting.Start.split('T')[0].split('-').map(Number),
      startInputType: 'local' as 'local' | 'utc' | undefined,
      startOutputType: 'utc' as 'local' | 'utc' | undefined,
      end: meeting.End.split('T')[0].split('-').map(Number),
      title: process.env.NEXT_PUBLIC_MEETING_TITLE || 'Meeting with YZ',
      description: `${meeting.title}

${meeting.description}

${process.env.NEXT_PUBLIC_FOOTER || 'Created by YeonV'}`,
      location: meeting.location || 'Karolingerring 21, 50678 Köln',
      url: process.env.NEXT_PUBLIC_MEETING_URL || 'https://meeting.yeonv.com',
      organizer: { name: 'Yeon', email: 'dev@yeonv.com' }
    }

    const { error, value } = createEvent(event)

    if (error) {
      console.log(error)
      return res.status(500).json({ error: 'Failed to create event.' })
    }
    return new Response(value, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': `attachment; filename=meeting-${meeting.id}.ics`
      }
    })
  } else {
    // Handle other types of requests
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405
    })
  }
}
