import { Context, Env, Hono, Next } from 'hono'
import blogRouter from './routes/blog'
import userRouter from './routes/user'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>()

app.use('/api/v1/blog/*', async (c: Context, next: Next) => {
  const header = c.req.header('Authorization');
  const token = header?.split(" ")[1];
  if (!token) {
    return c.json({
      message: "Token Doesnt Exist"
    })
  }
  try {
    const decodedPayload = await verify(token, c.env.JWT_SECRET)
    if (decodedPayload.id) {
      c.set('userId', decodedPayload.id);
      await next();
    }
  } catch (error) {
    c.status(403)
    return c.json({
      message: "Token is not valid Please Login Again"
    })
  }
})
app.route('/api/v1/blog', blogRouter)
app.route('/api/v1/user', userRouter)

export default app
