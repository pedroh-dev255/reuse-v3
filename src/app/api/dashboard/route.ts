import prisma from "@/src/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: Request) {
  const token = (req.headers.get("cookie") || "")
    .split("; ")
    .find(row => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { id: number };
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, profile_picture: true }
    });

    const produtos = await prisma.produtos.findMany({
      where: {
        status: 0
      },
      select: { id: true, nome: true, fotos: true, descricao: true }
    });

    
    return NextResponse.json({ user, produtos });
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
