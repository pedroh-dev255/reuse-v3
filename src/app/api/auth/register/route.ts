import prisma from "@/src/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { createLog } from "@/src/lib/logger";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("profilePicture") as File | null;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!file || !name || !email || !password) {
      return NextResponse.json({ error: "Campos incompletos" }, { status: 400 });
    }

    const userExists = await prisma.users.findUnique({ where: { email } });
    if (userExists) {
      return NextResponse.json({ error: "Email já registrado" }, { status: 400 });
    }

    // --- salvar a imagem ---
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "profile");
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // --- salvar usuário no banco ---
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profile_picture: fileName, // campo no banco
      },
    });

    await createLog({
      userId: user.id,
      action: "register_success",
      description: `Usuário criado: ${email}`,
      ipAddress: req.headers.get("x-forwarded-for") || "",
      userAgent: req.headers.get("user-agent") || "",
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ message: "Usuário criado com sucesso", user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json({ error: "Erro ao registrar usuário" }, { status: 500 });
  }
}
