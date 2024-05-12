import { Context, Hono } from "hono";

const user = new Hono();

user.post('/signup', (c: Context) => {
    return c.text("User Signup");
})

user.post("/signin", (c: Context) => {
    return c.text("User SignIn")
})

export default user;