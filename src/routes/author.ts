import Router from 'koa-router'
import { DI } from 'src/main'

import { Author } from 'src/entities/Author'
import { Context } from 'vm'
import { QueryOrder } from '@mikro-orm/core'

export const authorRouter = new Router({ prefix: '/author' })

authorRouter.get('/',async (ctx: Context) => {
  ctx.body = await DI.authorRepository.findAll();
})

authorRouter.post('/', async (ctx: Context) => {
  if (!ctx.request.body.name || !ctx.request.body.email) {
    return ctx.throw(400, { message: 'One of `name, email` is missing' });
  }

  try {
    const author = DI.em.create(Author, ctx.request.body);
    await DI.authorRepository.persist(author).flush();

    ctx.body = author;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});