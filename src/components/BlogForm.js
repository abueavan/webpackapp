import React from 'react'
import { Form, Button } from 'semantic-ui-react'

const BlogForm = ({
  handleSubmit,
  title,
  author,
  url
}) => {
  return (
    <div>
      <Form onSubmit={handleSubmit} >
        <Form.Field>
          <label>title:</label>
          <input
            type={title.type}
            value={title.value}
            name="Title"
            onChange={title.onChange}
          />
        </Form.Field>
        <Form.Field>
          <label>author:</label>
          <input
            type={author.type}
            value={author.value}
            name="Author"
            onChange={author.onChange}
          />
        </Form.Field>
        <Form.Field>
          <label>url:</label>
          <input
            type={url.type}
            value={url.value}
            name="URL"
            onChange={url.onChange}
          />
        </Form.Field>
        <Button type="submit">create</Button>
      </Form>
    </div>
  )
}

export default BlogForm