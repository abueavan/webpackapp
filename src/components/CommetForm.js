import React from 'react'
import { Form, Button } from 'semantic-ui-react'

const CommentForm = ({
  handleSubmit,
  comment
}) => {
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <input {...comment} />
        <Button type="submit">add comment</Button>
      </Form>
    </div>
  )
}

export default CommentForm