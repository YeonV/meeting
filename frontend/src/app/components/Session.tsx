'use client'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import useStore from '@/store/useStore'

const Session = () => {
  const { data: session } = useSession()
  const me = useStore((state) => state.me)
  const meetings = useStore((state) => state.meetings)
  const otherMeetings = useStore((state) => state.otherMeetings)
  const fetchMe = useStore((state) => state.fetchMe)
  const fetchMeetings = useStore((state) => state.fetchMeetings)
  const fetchOtherMeetings = useStore((state) => state.fetchOtherMeetings)
  const fetchAllMeetings = useStore((state) => state.fetchAllMeetings)
  const dev = useStore((state) => state.dev)

  useEffect(() => {
    if (!session) return
    if (session && session.strapiToken) {
      fetchMe(session.strapiToken)
      fetchMeetings(session.strapiToken)
      fetchOtherMeetings(session.strapiToken)
      // getRole(session.strapiToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  useEffect(() => {
    // console.log(me, session)
    if (!session) return
    if (session && session.strapiToken && me && (me.role?.type === 'privileged' || me.role?.type === 'administrator')) {
      fetchAllMeetings(session.strapiToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me])

  return dev ? (
    <>
      session:
      <code>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </code>
      me:
      <code>
        <pre>{JSON.stringify(me, null, 2)}</pre>
      </code>
      meetings:
      <code>
        <pre>{JSON.stringify(meetings, null, 2)}</pre>
      </code>
      otherMeetings:
      <code>
        <pre>{JSON.stringify(otherMeetings, null, 2)}</pre>
      </code>
    </>
  ) : null
}

export default Session
