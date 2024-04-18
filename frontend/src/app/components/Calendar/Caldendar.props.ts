import { IMeeting } from '@/types/meeting/IMeeting'
import { SxProps, Theme } from '@mui/material'
import { CSSProperties } from 'react'

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export interface SxConfig {
  sx?: SxProps<Theme>
  sxControls?: SxProps<Theme>
  sxCaptionTime?: SxProps<Theme>
  sxCaptionDay?: SxProps<Theme>
  sxSlot?: CSSProperties
}

export interface ICalendar {
  /**
   * ### Meetings
   *
   * #### default: []
   *
   * #### example IMeeting:
   *
   * ```typescript
   * {
   *  id: 1,
   *  Start: '2022-01-01T08:00:00.000Z',
   *  End: '2022-01-01T09:00:00.000Z',
   * }
   *
   * ```
   *
   */
  meetings?: IMeeting[]
  /**
   * ### Minutes per slot
   *
   * #### default: 15
   */
  minutesPerSlot?: number
  /**
   * ### Days of the week
   *
   *
   * #### default:
   *
   * `['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']`
   *
   * #### possible values:
   *
   * `Monday`
   * `Tuesday`
   * `Wednesday`
   * `Thursday`
   * `Friday`
   * `Saturday`
   * `Sunday`
   *
   */
  daysOfWeek?: Day[]
  /**
   * ### Starting hour
   *
   * #### default: 8
   */
  startHour?: number
  /**
   * ### Ending hour
   *
   * #### default: 19
   */
  endHour?: number
  /**
   * ### Meeting start key
   *
   * #### default: 'Start'
   */
  meetingStartKey?: string
  /**
   * ### Meeting end key
   *
   * #### default: 'End'
   */
  meetingEndKey?: string
  /**
   * ### style configuration
   */
  sxConfig?: SxConfig
  dialogs?: {
    addTitle?: string
    editTitle?: string
    deleteTitle?: string
  }
  controls?: 'top' | 'left'
  /**
   * ### Notify function
   */
  notify?: () => void
}
