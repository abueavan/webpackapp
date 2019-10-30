import React from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react'
const Blog = ({
  blog,
  user,
  comment,
  handleLike,
  handleDelete,
  addComment,
  history
}) => {

  if (blog === undefined) // 直接到达单独blog页面时，reactapp还未从后台拿到数据，可以使用条件渲染：
    return null

  const deleteBlog = () => {
    handleDelete()
    history.push('/')
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
        <p>{blog.likes}<Button onClick={handleLike}>like</Button></p>
        <p>added by {blog.user.name}</p>
        {user.username === blog.user.username &&<Button onClick={deleteBlog}>remove</Button> }
      </div>
      <h3>comments</h3>
      <Form onSubmit={addComment}>
        <input {...comment} />
        <Button type='submit'>add comment</Button>
      </Form>
      <ul>
        {blog.comments.map(comment => <li key={comment.id}>{comment.content}</li>)}
      </ul>
    </div>
  )}

export default withRouter(Blog)