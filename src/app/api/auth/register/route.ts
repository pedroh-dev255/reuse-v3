import prisma from "@/src/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { createLog } from "@/src/lib/logger";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            await createLog({
                action: "register_failed",
                description: "Campos incompletos no cadastro",
                ipAddress: req.headers.get("x-forwarded-for") || "",
                userAgent: req.headers.get("user-agent") || "",
            });
            return NextResponse.json({ error: "Preencha todos os campos" }, { status: 400 });
        }

        const userExists = await prisma.users.findUnique({ where: { email } });
        if (userExists) {
            await createLog({
                action: "register_failed",
                description: `Email já registrado: ${email}`,
                ipAddress: req.headers.get("x-forwarded-for") || "",
                userAgent: req.headers.get("user-agent") || "",
            });
            return NextResponse.json({ error: "Email já registrado" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: { name, email, password: hashedPassword },
        });

        await createLog({
            userId: user.id,
            action: "register_success",
            description: `Usuário criado: ${email}`,
            ipAddress: req.headers.get("x-forwarded-for") || "",
            userAgent: req.headers.get("user-agent") || "",
        });

        //reitira o password do retorno
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({ message: "Usuário criado com sucesso", user }, { status: 201 });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        await createLog({
            action: "register_error",
            description: "Erro ao registrar usuário",
            ipAddress: req.headers.get("x-forwarded-for") || "",
            userAgent: req.headers.get("user-agent") || "",
        });
        return NextResponse.json({ error: "Erro ao registrar usuário" }, { status: 500 });
    }
}
