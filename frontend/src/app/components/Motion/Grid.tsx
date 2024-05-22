import { motion } from "framer-motion"

import MuiGrid, { GridProps } from "@mui/material/Grid"
import { forwardRef } from 'react'

const GridComponent = forwardRef(({children, ...props}: GridProps, ref: any) => (
  <MuiGrid {...props} ref={ref}>
    { children }
  </MuiGrid>
))

const Grid = motion(GridComponent)

GridComponent.displayName = 'Grid'

export default Grid