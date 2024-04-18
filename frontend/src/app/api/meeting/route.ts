import type { NextApiResponse } from 'next'
import api from '@/lib/Strapi'
import { pipeline } from 'stream/promises'
import { Readable, Writable } from 'stream'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
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
    const meetingData = JSON.parse(data)

    if (meetingData.strapiToken) {
      try {
        const response = await api(
          '/meetings',
          meetingData.strapiToken,
          {},
          {
            method: 'POST' as const,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${meetingData.strapiToken}`
            },
            body: JSON.stringify({
              data: { Start: meetingData.start, End: meetingData.end, user: meetingData.user, title: meetingData.title, description: meetingData.description }
            })
          }
        )

        if (response && response.data && response.data.id) {
          return new Response(response, {
            status: 200
          })
        } else {
          return new Response('An error occurred', {
            status: response.status
          })
        }
      } catch (err) {
        return new Response('err', {
          status: 500
        })
      }
    } else {
      return new Response('Unauthorized', {
        status: 401
      })
    }
  } else {
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405
    })
  }
}
export async function PUT(req: NextRequest, res: NextApiResponse<any>) {
  if (req.method === 'PUT') {
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
    const meetingData = JSON.parse(data)
    if (meetingData.strapiToken) {
      try {
        const response = await api(
          '/meetings/' + meetingData.id,
          meetingData.strapiToken,
          {},
          {
            method: 'PUT' as const,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${meetingData.strapiToken}`
            },
            body: JSON.stringify({
              data: { Start: meetingData.start, End: meetingData.end, user: meetingData.user, title: meetingData.title, description: meetingData.description }
            })
          }
        )
        if (response && response.data && response.data.id) {
          return new Response(response, {
            status: 200
          })
        } else {
          return new Response('An error occurred', {
            status: response.status
          })
        }
      } catch (err) {
        return new Response(JSON.stringify(err), {
          status: 500
        })
      }
    } else {
      return new Response('Unauthorized', {
        status: 401
      })
    }
  } else {
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405
    })
  }
}
export async function DELETE(req: NextRequest, res: NextApiResponse<any>) {
  if (req.method === 'DELETE') {
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
    const meetingData = JSON.parse(data)
    if (meetingData.strapiToken) {
      try {
        const response = await api(
          '/meetings/' + meetingData.id,
          meetingData.strapiToken,
          {},
          {
            method: 'DELETE' as const,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${meetingData.strapiToken}`
            }
          }
        )
        if (response && response.data && response.data.id) {
          return new Response(response, {
            status: 200
          })
        } else {
          return new Response('An error occurred', {
            status: response.status
          })
        }
      } catch (err) {
        return new Response(JSON.stringify(err), {
          status: 500
        })
      }
    } else {
      return new Response('Unauthorized', {
        status: 401
      })
    }
  } else {
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405
    })
  }
}
