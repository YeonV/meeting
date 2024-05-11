import { Stack, Typography } from '@mui/material'
import { Emoji } from 'emoji-picker-react'
import moment from 'moment'

const Message = ({
  invert,
  author,
  content,
  time,
  group,
  onClick
}: {
  invert?: boolean
  author: string
  content: string
  time: number
  group?: boolean
  onClick?: () => void
}) => {
  const trimmedContent = content.trim()
  const contentArray = Array.from(trimmedContent)
  const formattedTime = moment(time).format('hh:mm')

  const regex_emoji = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/gu
  const onlyOneEmoji = contentArray.length === 1 && regex_emoji.test(trimmedContent)

  // const replacedContent = trimmedContent.split(regex_emoji).reduce((prev: any, curr, i, arr) => {
  //   if (regex_emoji.test(curr)) {
  //     const unified = Array.from(curr)
  //       .map((c) => c.codePointAt(0)!.toString(16))
  //       .join('-')
  //     prev.push(<Emoji unified={unified} size={onlyOneEmoji ? 100 : 18} key={i} />)
  //   } else {
  //     prev.push(curr)
  //   }

  //   return prev
  // }, [])

  return (
    <>
      {!invert && group && (
        <Typography
          color={'secondary'}
          fontSize={18}
          fontFamily={'Source Sans Pro, sans-serif'}
          sx={{ cursor: 'pointer' }}
          fontWeight={600}
          mb={0.5}
          onClick={onClick}
        >
          {author}
        </Typography>
      )}
      <Stack direction='row' spacing={2} justifyContent='flex-end' flexWrap={'wrap'} alignItems={'flex-end'}>
        {onlyOneEmoji ? (
          <Emoji unified={trimmedContent!.codePointAt(0)!.toString(16)} size={100} />
        ) : (
          <Typography style={{ marginRight: 'auto' }} fontSize={18} fontFamily={'Source Sans Pro, sans-serif'}>
            {trimmedContent}
          </Typography>
        )}

        <div>
          <Typography fontSize={14} fontFamily={'Source Sans Pro, sans-serif'} sx={{ opacity: 0.7 }}>
            {formattedTime}
          </Typography>
        </div>
      </Stack>
    </>
  )
}

export default Message
