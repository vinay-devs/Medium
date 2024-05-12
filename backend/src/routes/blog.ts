import { Context, Hono } from "hono";

const blog = new Hono();

blog.post('/', (c: Context) => {
    return c.text("Hey post blog")
})

blog.put('/', (c: Context) => {
    return c.text("Hey put blog")
})

blog.get('/:id', (c: Context) => {
    return c.text("Hey get id blog")
})
blog.get('/bulk', (c: Context) => {
    return c.text("Hey bulk blog")
})


export default blog;