import { createRouter } from "./context";
import { z } from "zod";
import users from "../../seeds/users.json";

export const SeedRouter = createRouter().mutation("users", {
  async resolve({ ctx }) {
    const Users = ctx.prisma.user;

    await Users.deleteMany();

    await Users.createMany({
      data: users,
    });

    return { msg: `Users Seeded` };
  },
});
