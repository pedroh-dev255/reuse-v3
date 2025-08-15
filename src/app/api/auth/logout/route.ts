// src/app/api/auth/logout/route.ts
import prisma from "@/src/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { createLog } from "@/src/lib/logger";

const SECRET = process.env.JWT_SECRET || "supersecret";

// Logout handler
export async function POST(req: Request) {
    try {
        const token = (req.headers.get("cookie") || "")
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];
        if (!token) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        // Verifica o token JWT
        const decoded = jwt.verify(token, SECRET) as { id: number };
        if (!decoded || !decoded.id) {
            return NextResponse.json({ error: "Token inválido" }, { status: 401 });
        }
        // Verifica se o usuário está ativo
        const user = await prisma.users.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true }
        });
        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }
        // Cria o log de logout
        await createLog({
            userId: user.id,
            action: "logout",
            description: `Usuário ${user.email} deslogou`,
            ipAddress: req.headers.get("x-forwarded-for") || "",
            userAgent: req.headers.get("user-agent") || "",
        });
        // Limpa os cookies de autenticação
        const res = NextResponse.json({ message: "Logout bem-sucedido" });
        res.cookies.delete("token");
        res.cookies.delete("userData");
        return res;
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        await createLog({
            action: "logout_error",
            description: "Erro ao fazer logout",
            ipAddress: req.headers.get("x-forwarded-for") || "",
            userAgent: req.headers.get("user-agent") || "",
        });
        return NextResponse.json({ error: "Erro ao fazer logout" }, { status: 500 });
    }
}