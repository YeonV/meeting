import { motion } from "framer-motion"

import MuiStack, { StackProps } from "@mui/material/Stack"
import { forwardRef } from 'react'

const StackComponent = forwardRef((props: StackProps, ref: any) => (
  <MuiStack {...props} ref={ref} />
))

const Stack = motion(StackComponent)

StackComponent.displayName = 'Stack'

export default Stack