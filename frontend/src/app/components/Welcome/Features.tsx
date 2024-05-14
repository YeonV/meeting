import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Logo from './Logos/Logo'
import FeatureContent from './FeaturesContent'
import { useState } from 'react'

function a11yProps(index: number) {
  return {
    'id': `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  }
}

export default function Features() {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box
      sx={{
        'flexGrow': 1,
        'bgcolor': 'background.paper',
        'display': 'flex',
        'height': 500,
        'textAlign': 'left',
        '& div[role="tabpanel"]': {
          width: '950px'
        }
      }}
    >
      <Tabs orientation='vertical' variant='scrollable' value={value} onChange={handleChange} sx={{ borderRight: 1, borderColor: 'divider' }}>
        {['NextAuth', 'NextWs', 'MaterialUI', 'Zustand'].map((name, index) => (
          <Tab key={name} icon={<Logo name={name} text />} {...a11yProps(index)} sx={{ textTransform: 'none' }} />
        ))}
      </Tabs>
      <FeatureContent
        value={value}
        index={0}
        title='NextAuth'
        subtitle='Your Gateway to Secure Authentication'
        points={[
          'Support for a multitude of Auth Providers such as Github, Google, Discord, Spotify and more...',
          'Easy management of user sessions, enhancing the security and user experience of your application.',
          'Secured access to username and email via Session.'
        ]}
        links={['https://next-auth.js.org/']}
      />
      <FeatureContent
        value={value}
        index={1}
        title='NextWs'
        subtitle='Real-time Communication at Your Fingertips'
        points={[
          'Built-in WebSocket support, enabling real-time communication between client and server.',
          'Broadcasting capabilities, allowing messages to be sent to all connected clients simultaneously.',
          'Client-to-client messaging, facilitating direct communication between clients.'
        ]}
        links={['https://github.com/apteryxxyz/next-ws']}
      />

      <FeatureContent
        value={value}
        index={2}
        title='MaterialUI'
        subtitle='Your One-stop Solution for UI Design'
        points={[
          'Comprehensive UI library with a wide range of customizable components.',
          'Themeable designs that can be tailored to match your brand identity.',
          'Responsive layouts for a seamless user experience across devices.'
        ]}
        links={['https://mui.com/material-ui/all-components/']}
      />

      <FeatureContent
        value={value}
        index={3}
        title='Zustand'
        subtitle='Effortless State Management'
        points={[
          'Lightweight solution for managing your application state.',
          'Leverages React hooks for a more intuitive development experience.',
          'Supports asynchronous actions and middleware.'
        ]}
        links={['https://github.com/pmndrs/zustand']}
      />
    </Box>
  )
}
