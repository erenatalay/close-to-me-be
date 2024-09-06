import { AuthController } from 'src/auth/auth.controller';
import { InferContextType } from 'trpc-nestjs-adapter';
import { z } from 'zod';
import { initTRPC } from '@trpc/server';

type CtxType = InferContextType<typeof createContext>;
const createContext = () => ({});
const trpc = initTRPC.context<CtxType>().create({});

const { router } = trpc;
const procedure = trpc.procedure;

export const appRouter = router({
  login: procedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = await ctx.resolveNestDependency(AuthController);
      return service.login(input as never);
    }),
  register: procedure
    .input(
      z.object({
        firstname: z.string(),
        lastname: z.string(),
        email: z.string(),
        password: z.string(),
        provider: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = await ctx.resolveNestDependency(AuthController);
      return service.register(input as never);
    }),
});
