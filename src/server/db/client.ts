// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

(async () => {
  const { env } = await import("../../env/server.mjs");

  if (env.NODE_ENV !== "production") {
    global.prisma = prisma;
  }
})().catch((err) => console.error(err));
