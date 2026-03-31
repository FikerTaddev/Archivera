import bcrypt from "bcrypt"
import { prisma } from "../../config/prisma.ts";

export async function RegsiterUser(name: string, email: string, password: string) {

    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) throw new Error("User Already Exists")

    const HashedPassword = await bcrypt.hash(password, 12)

    const User = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: HashedPassword,

        }
    })
    return {
        id: User.id,
        name: User.name,
        email: User.email
    }

}

export async function login(email: string, password: string) {

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) throw new Error("Invalid Credentials")

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) throw new Error("Invalid Credentials")

    return {
        id: user.id,
        name: user.name,
        email: user.email
    }

}