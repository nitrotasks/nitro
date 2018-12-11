import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
const style = { textDecoration: 'none' }

export const Link = props => {
  return <RouterLink {...props} style={style} />
}
export class LinkComponent extends React.Component {
  render = () => <RouterLink {...this.props} />
}
