import { Hono } from 'hono'
import blog from './routes/blog'
import user from './routes/user'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/v1/blog', blog)
app.route('/api/v1/user', user)

export default app
