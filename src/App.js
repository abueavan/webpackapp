import React, { useState, useEffect } from 'react'
import loginService from './services/login'
import blogsService from './services/blogs'
import usersService from './services/users'
import Blog from './components/Blog'
import BlogLink from './components/BlogLink'
import User from './components/User'
import Users from './components/Users'
import Menu from './components/Menu'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import  { useField } from './hooks'
import { BrowserRouter as Router, Route  } from 'react-router-dom'
import { Container, Message } from 'semantic-ui-react'

function App(props) {

  const [username, resetUsername] = useField('text')
  const [password, resetPassword] = useField('password')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [users, setUsers] = useState([])
  const [title, resetTitle] = useField('text')
  const [author, resetAuthor] = useField('text')
  const [url,  resetUrl] = useField('text')
  const [comment, resetComment] = useField('text')
  const [info, setInfo] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    blogsService
      .getAll()
      .then(initialBlogs => setBlogs(initialBlogs.sort((a, b) => a.likes - b.likes)))
    usersService
      .getAll()
      .then(data => {
        setUsers(data)
      })
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogsService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    setBlogs(blogs.sort((a, b) => a.likes - b.likes))
  }, [blogs])

  const blogFormRef = React.createRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        'username': username.value,
        'password': password.value,
      })

      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      blogsService.setToken(user.token)
      setUser(user)
      resetUsername()
      resetPassword()
    } catch (exception) {
      setError('wrong username or password')
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  const handlelogout = () => {
    window.localStorage.clear()
    setUser(null)
    setInfo('You have logged out successfully')
    setTimeout(() => {
      setInfo(null)
    }, 5000)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()
    const blogObject = {
      'title': title.value,
      'author': author.value,
      'url': url.value,
    }

    const newBlog = await blogsService.create(blogObject)
    newBlog.user = user
    setBlogs(blogs.concat(newBlog))
    setInfo(`a new blog ${newBlog.title} by ${newBlog.author} add`)
    setTimeout(() => {
      setInfo(null)
    }, 5000)
    resetTitle()
    resetAuthor()
    resetUrl()
  }

  const addLikes = async (oldBlog) => {
    const newObject = {
      user: oldBlog.user._id,
      likes: oldBlog.likes + 1,
      author: oldBlog.author,
      title: oldBlog.title,
      url: oldBlog.url
    }
    const newBlog = await blogsService.put(oldBlog.id, newObject)
    setBlogs(blogs.map(blog => blog.id === newBlog.id ? newBlog : blog))
  }

  const delelteBlog = async (blog) => {
    if(window.confirm(`remove blog ${blog.title} by ${blog.author}`)){
      await blogsService.del(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setInfo(`Removed blog ${blog.title} by ${blog.author}`)
      setTimeout(() => {
        setInfo(null)
      }, 5000)
    }
  }

  const addComment = async (event, blogId) => {
    event.preventDefault()
    const newObject = {
      'content': comment.value
    }
    const newComment = await blogsService.createComment(blogId, newObject)
    const oldBlog = blogById(blogId)
    const newBlog = {
      ...oldBlog,
      'comments': oldBlog.comments.concat(newComment)
    }
    setBlogs(blogs.map(blog => blog.id === newBlog.id ? newBlog : blog))
    resetComment()
  }

  const userById = (id) =>
    users.find(a => a.id === id)

  const blogById = (id) =>
    blogs.find(a => a.id === id)

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      {(info &&
        <Message success>
          {info}
        </Message>
      )}
      {(error &&
        <Message error>
          {error}
        </Message>
      )}
      <Togglable buttonLabel='login'>
        <LoginForm
          username={username}
          password={password}
          handleSubmit={handleLogin}
        />
      </Togglable>
    </div>
  )

  const blogForm = () => (
    <div>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm
          title={title}
          author={author}
          url={url}
          handleSubmit={addBlog}
        />
      </Togglable>
      {blogs.map((blog) =>
        <BlogLink key={blog.id} blog={blog} />
      )}
    </div>
  )

  const renderBlog = (match) => {
    const blog = blogById(match.params.id)

    return (
      <Blog blog={blog} user={user} handleLike={() => addLikes(blog)} history={props.history}
        handleDelete={() => delelteBlog(blog)} addComment={(event) => addComment(event, match.params.id)}
        comment={comment}
      />
    )
  }

  if(user === null) return loginForm()

  return (
    <Container>
      <Router>
        <div>
          <Menu username={user.name} onlogout={handlelogout} />
          <h2>blog app</h2>
          {(info &&
            <Message success>
              {info}
            </Message>
          )}
          {(error &&
            <Message error>
              {error}
            </Message>
          )}
          <Route exact path="/" render={() => blogForm()} />
          <Route exact path="/blogs/:id" render={({ match }) => renderBlog(match)} />
          <Route exact path="/users" render={() => <Users users={users} /> }/>
          <Route exact path="/users/:id" render={({ match }) =>
            <User user={userById(match.params.id)} />
          } />
        </div>
      </Router>
    </Container>
  )
}

export default App
