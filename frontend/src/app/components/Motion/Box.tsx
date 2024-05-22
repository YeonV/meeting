import { motion } from "framer-motion"

import MuiBox, { BoxProps } from "@mui/material/Box"
import { forwardRef } from 'react'

const BoxComponent = forwardRef((props: BoxProps, ref: any) => (
  <MuiBox {...props} ref={ref} />
))

const Box = motion(BoxComponent)

BoxComponent.displayName = 'Box'

export default Box