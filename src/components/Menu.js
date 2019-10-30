import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Button } from 'semantic-ui-react'
const MenuNoHistory = (props) => {
  const padding = {
    paddingRight: 5
  }

  const handlelogout =() => {
    props.onlogout()
    props.history.push('/')

  }
  return (
    <Menu>
      <Menu.Item link>
        <Link style={padding} to="/">blogs</Link>
      </Menu.Item>
      <Menu.Item>
        <Link style={padding} to="/users">users</Link>
      </Menu.Item>
      <Menu.Item>
        {props.username} logged in<Button onClick={handlelogout} >logout</Button>
      </Menu.Item>
    </Menu>
  )
}

export default withRouter(MenuNoHistory)