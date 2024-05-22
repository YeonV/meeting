import { motion } from "framer-motion"

import MuiTypography, { TypographyProps } from "@mui/material/Typography"
import { forwardRef } from 'react'

const TypographyComponent = forwardRef((props: TypographyProps, ref: any) => (
  <MuiTypography {...props} ref={ref} />
))

const Typography = motion(TypographyComponent)

TypographyComponent.displayName = 'Typography'

export default Typography