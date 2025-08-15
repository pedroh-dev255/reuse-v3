import prisma from "./prisma";

interface LogOptions {
  userId?: number;
  action: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function createLog({
  userId,
  action,
  description,
  ipAddress,
  userAgent,
}: LogOptions) {
  try {
    await prisma.system_logs.create({
      data: {
        user_id: userId,
        action,
        description,
        ip_address: ipAddress,
        user_agent: userAgent,
      },
    });
  } catch (error) {
    console.error("Erro ao criar log:", error);
  }
}
