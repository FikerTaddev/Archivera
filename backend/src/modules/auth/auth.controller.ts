import type { Request, Response } from "express";
import { RegsiterUser, login } from "./auth.service.ts";
import { validateRegister, validateLogin } from "./auth.validation.ts";
import { signToken } from "./auth.utils.ts";

export async function registerController(req: Request, res: Response) {
    try {
        validateRegister(req.body);

        const { name, email, password } = req.body;

        const user = await RegsiterUser(name, email, password);

        res.status(201).json(user);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function loginController(req: Request, res: Response) {
    try {
        validateLogin(req.body);

        const { email, password } = req.body;

        const user = await login(email, password);

        const token = signToken(user.id);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
        });

        res.json(user);
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
}

export async function logoutController(req: Request, res: Response) {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
}