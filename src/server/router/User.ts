import { createRouter } from "./context";
import { z } from "zod";

export const UserRouter = createRouter()
  .query("me", {
    async resolve({ ctx }) {
      const User = ctx.prisma.user;
      const session = ctx.session;
      if (session?.user) {
        try {
          const user = await User.findUnique({
            where: { id: session.user.id },
          });
          return user;
        } catch (err) {
          if (err) console.error(err);
        }
      }
    },
  })
  .mutation("makeAdmin", {
    input: z.object({
      password: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      const User = ctx.prisma.user;
      if (ctx.session?.user && input.password === "deeznuts, gottem!") {
        try {
          const user = await User.update({
            where: { id: ctx.session.user.id },
            data: { role: "admin" },
          });
          return `User ${user.name} is now role ${user.role}`;
        } catch (err) {}
      }
    },
  });
