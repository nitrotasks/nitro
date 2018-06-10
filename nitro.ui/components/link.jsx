import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

export const Link = props => {
  return <RouterLink {...props} style={{ textDecoration: 'none' }} />
}
