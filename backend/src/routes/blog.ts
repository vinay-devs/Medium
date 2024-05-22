import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context, Hono } from "hono";
import { createBlogInput, updateBlogInput } from '@vinaydevs/medium-common'

const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
    }
}>();

blogRouter.post('/', async (c: Context) => {
    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        return c.json({
            message: "Inputs are not correct"
        })
    }
    const blog = await prisma.post.create({
        data: {
            authorId: userId.toString(),
            title: body.title,
            content: body.content,
        }
    })
    return c.json({
        message: "Succesfully Created",
        blogId: blog.id
    })
})

blogRouter.put('/', async (c: Context) => {
    const userId = c.get('userId');
    const body = await c.req.json()
    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        return c.json({
            message: "Inputs are not correct"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    await prisma.post.update({
        where: {
            id: body.postId,
            authorId: userId
        },
        data: {
            title: body.title,
            content: body.content
        }
    })
    return c.json({
        message: "Post Updated"
    })
})
blogRouter.get('/bulk', async (c: Context) => {
    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const blogs = await prisma.post.findMany()
    console.table(blogs)
    return c.json(
        blogs
    )
})
blogRouter.get('/:id', async (c: Context) => {
    const id = c.req.param('id');
    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.findUnique({
        where: {
            id: id,
            authorId: userId
        }
    })
    return c.json({
        blog
    })
})



export default blogRouter;