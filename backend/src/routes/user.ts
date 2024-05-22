import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context, Hono } from "hono";
import { sign } from "hono/jwt";
import { signupInput, signinInput } from '@vinaydevs/medium-common'

interface jwtType {
    id: string
}
const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()


userRouter.post('/signup', async (c: Context) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const bodyParsed = await c.req.json();
    const { success } = signupInput.safeParse(bodyParsed);
    if (!success) {
        return c.json({
            message: "Inputs are not correct"
        })
    }
    console.log(bodyParsed)
    const user = await prisma.user.create({
        data: {
            name: bodyParsed.name,
            email: bodyParsed.email,
            password: bodyParsed.password
        }
    })

    const payload: jwtType = {
        id: user.id
    }
    const token: string = await sign(payload, c.env.JWT_SECRET)
    return c.json({
        token: token
    })
})

userRouter.post("/signin", async (c: Context) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    try {
        const bodyParsed = await c.req.json();
        const { success } = signinInput.safeParse(bodyParsed);
        if (!success) {
            return c.json({
                message: "Inputs are not correct"
            })
        }
        const user = await prisma.user.findUnique({
            where: {
                email: bodyParsed.email,
                password: bodyParsed.password

            }
        })
        if (!user) {
            return c.json({
                message: "User Not Found"
            })
        }
        const payload: jwtType = {
            id: user.id
        }
        const token = await sign(payload, c.env.JWT_SECRET)
        return c.json({
            token: token
        })
    } catch (error) {
        return c.json({
            message: "Error while Sign In"
        })
    }


})

export default userRouter;