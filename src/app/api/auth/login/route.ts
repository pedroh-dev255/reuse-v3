// src/app/api/auth/login/route.ts
import prisma from "@/src/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { createLog } from "@/src/lib/logger";

const SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      await createLog({ action: "login_failed", description: "Campos incompletos no login",
        ipAddress: req.headers.get("x-forwarded-for") || "", userAgent: req.headers.get("user-agent") || "" });
      return NextResponse.json({ error: "Preencha todos os campos" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      await createLog({ action: "login_failed", description: `Usuário não encontrado: ${email}`,
        ipAddress: req.headers.get("x-forwarded-for") || "", userAgent: req.headers.get("user-agent") || "" });
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      await createLog({ userId: user.id, action: "login_failed", description: "Senha incorreta",
        ipAddress: req.headers.get("x-forwarded-for") || "", userAgent: req.headers.get("user-agent") || "" });
      return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "7d" });

    await createLog({ userId: user.id, action: "login_success", description: "Login realizado",
      ipAddress: req.headers.get("x-forwarded-for") || "", userAgent: req.headers.get("user-agent") || "" });

    const res = NextResponse.json({
      message: "Login bem-sucedido",
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    res.cookies.set("userData", JSON.stringify({ id: user.id, name: user.name, email: user.email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    await createLog({ action: "login_error", description: "Erro ao fazer login",
      ipAddress: req.headers.get("x-forwarded-for") || "", userAgent: req.headers.get("user-agent") || "" });
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}
