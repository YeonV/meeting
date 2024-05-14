import { Typography } from '@mui/material'

const NotifyDoc = ({
  notifyPayload = {
    message: 'Hello World',
    variant: 'success'
  }
}: {
  notifyPayload?: {
    message: string
    variant: string
  }
}) => {
  return (
    <>
      <Typography variant='h2' mt={16}>
        Notify
      </Typography>
      <table style={{ textAlign: 'left' }}>
        <tbody>
          <tr>
            <td valign='top' style={{ paddingRight: '3rem', paddingTop: '1rem' }}>
              Method
            </td>
            <td style={{ paddingTop: '1rem' }}>
              <span style={{ color: '#ce9178', paddingLeft: '1rem' }}>POST</span>
            </td>
          </tr>
          <tr>
            <td valign='top' style={{ paddingRight: '3rem', paddingTop: '1rem' }}>
              Path
            </td>
            <td style={{ paddingTop: '1rem' }}>
              <span style={{ color: '#ce9178', paddingLeft: '1rem' }}>/api/notify</span>
            </td>
          </tr>
          <tr>
            <td valign='top' style={{ paddingRight: '3rem', paddingTop: '1rem' }}>
              Body
            </td>
            <td style={{ paddingTop: '1rem' }}>
              {' '}
              <pre style={{ textAlign: 'left', backgroundColor: '#000', color: '#fff', padding: '1rem' }}>
                <code>
                  {'{'}
                  <br />
                  <span style={{ color: '#dcdcaa', paddingLeft: '1rem' }}>&quot;message&quot;:</span>
                  <span style={{ color: '#ce9178', paddingLeft: '1rem' }}>&nbsp;&quot;{notifyPayload.message}&quot;,</span>
                  <br />
                  <span style={{ color: '#dcdcaa', paddingLeft: '1rem' }}>&quot;variant&quot;: </span>
                  <span style={{ color: '#ce9178', paddingLeft: '1rem' }}>&quot;{notifyPayload.variant}&quot;</span>
                  <br />
                  {'}'}
                </code>
              </pre>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default NotifyDoc
