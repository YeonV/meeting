/**
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
export interface IMeeting {
  id: number
  /**
   * ### Start
   *
   * #### example:
   *
   * `'2022-01-01T08:00:00.000Z'`
   */
  Start: string
  /**
   * ### End
   *
   * #### example:
   *
   * `'2022-01-01T09:00:00.000Z'`
   */
  End: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  user?: IUser
  title?: string
  description?: string
  [key: string]: string | number | IUser | undefined
}
