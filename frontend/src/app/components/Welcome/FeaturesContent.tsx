import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Button, List, ListItem, ListItemIcon, Stack } from '@mui/material'
import { CheckCircleOutline } from '@mui/icons-material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div role='tabpanel' hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const FeatureContent = ({
  title,
  subtitle,
  points,
  links,
  value,
  index
}: {
  title: string
  subtitle: string
  points: string[]
  links?: { name: string; url: string }[]
  value?: number
  index?: number
}) => (
  <TabPanel value={value || 99} index={index || 99}>
    <Typography variant='h4' mb={0}>
      {title}
    </Typography>
    <Typography variant='subtitle1' style={{ color: 'grey', marginBottom: '1rem' }}>
      {subtitle}
    </Typography>
    <Typography variant='subtitle1' style={{ fontSize: '1.2rem', fontWeight: 100 }}>
      {title} provides:
    </Typography>
    <List>
      {points.map((point, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <CheckCircleOutline color='primary' />
          </ListItemIcon>
          <Typography variant='subtitle1' style={{ fontSize: '1.2rem', fontWeight: 100 }}>
            {point}
          </Typography>
        </ListItem>
      ))}
    </List>
    <Typography variant='subtitle1' style={{ fontSize: '1.2rem', fontWeight: 100, marginTop: '0rem', marginBottom: '2rem' }}>
      Explore more about {title} and unlock its full potential.
    </Typography>
    <Stack direction='row' spacing={2}>
      {links &&
        links.length > 0 &&
        links.map((l) => (
          <Button key={l.name} variant='contained' color='primary' sx={{ mt: 2 }} onClick={() => window.open(l.url, '_blank', 'noopener,noreferrer')}>
            {l.name || 'Learn More'}
          </Button>
        ))}
    </Stack>
  </TabPanel>
)

export default FeatureContent
