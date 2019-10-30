import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'semantic-ui-react'

const LoginForm = ({
  handleSubmit,
  username,
  password
}) => {

  return (
    <div className='loginForm'>

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>username</label>
          <input {...username}  />
        </Form.Field>
        <div>
          <label>password</label>
          <input {...password} />
        </div>
        <Button type="submit">login</Button>
      </Form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  username: PropTypes.object.isRequired,
  password: PropTypes.object.isRequired
}

export default LoginForm
