import Router from 'koa-router'
import { DI } from 'src/main'

import { Author } from 'src/entities/Author'
import { Context } from 'vm'
import { QueryOrder, wrap } from '@mikro-orm/core'

export const authorRouter = new Router({ prefix: '/author' })

authorRouter.get('/',async (ctx: Context) => {
  ctx.body = await DI.authorRepository.findAll(['books'], { name: QueryOrder.DESC }, 20);
})

authorRouter.get('/:id', async (ctx: Context) => {
  try {
    const author = await DI.authorRepository.findOne(ctx.params.id, ['books']);
   // const book = await DI.em.findOneOrFail(Book, ctx.params.id, ['author'])
    if (!author) {
      return ctx.throw(404, { message: 'author not found' });
    }
    ctx.body = author;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

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

authorRouter.put('/:id', async (ctx: Context) => {
  try {
    const author = await DI.authorRepository.findOne(ctx.params.id);

    if (!author) {
      return ctx.throw(404, { message: 'Author not found' });
    }

    wrap(author).assign(ctx.request.body);
    await DI.authorRepository.persist(author).flush();

    ctx.body = author;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

authorRouter.delete('/:id', async (ctx: Context) => {
  
    const author = await DI.authorRepository.findOne(ctx.params.id);

    if (!author) {
      return ctx.throw(404, { message: 'Author not found' });
    }

    await DI.authorRepository.removeAndFlush(author);
    ctx.body = "Successfully removed"
    console.log("Author Removed");
  
});