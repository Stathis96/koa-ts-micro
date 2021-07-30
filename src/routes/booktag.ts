import { MikroORM, EntityManager, QueryOrder, wrap } from '@mikro-orm/core'
import Router from 'koa-router'
import { DI } from 'src/main'
import { BookTag } from 'src/entities/BookTag'
import { Context } from 'vm'

export const bookTagRouter = new Router({ prefix: '/booktags' })

bookTagRouter.get('/',async (ctx: Context) => {
  ctx.body = await DI.bookTagRepository.findAll( ['books'], { name: QueryOrder.DESC }, 20, );
})

bookTagRouter.get('/:id', async (ctx: Context) => {
  try {
    const booktag = await DI.bookTagRepository.findOne(ctx.params.id, ['books']);
   // const book = await DI.em.findOneOrFail(Book, ctx.params.id, ['author']) xwris repository an ithela
    if (!booktag) {
      return ctx.throw(404, { message: 'Booktag not found' });
    }
    ctx.body = booktag;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});


bookTagRouter.post('/', async (ctx: Context) => {
  console.log(ctx.request.body)
  if (!ctx.request.body.name) {
    ctx.throw(400, { message: 'Name is missing' });
  }
  try {
    const booktag = DI.bookTagRepository.create(ctx.request.body);
    await DI.bookTagRepository.persist(booktag).flush();

    ctx.body = booktag;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

bookTagRouter.put('/:id', async (ctx: Context) => {
  try {
    const booktag = await DI.bookTagRepository.findOne(ctx.params.id);

    if (!booktag) {
      return ctx.throw(404, { message: 'Booktag not found' });
    }

    wrap(booktag).assign(ctx.request.body);
    await DI.bookTagRepository.persist(booktag).flush();

    ctx.body = booktag;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

bookTagRouter.delete('/:id', async (ctx: Context) => {
  
    const booktag = await DI.bookTagRepository.findOne(ctx.params.id);

    if (!booktag) {
      return ctx.throw(404, { message: 'Book not found' });
    }

    await DI.bookTagRepository.removeAndFlush(booktag);
    ctx.body = "Successfully removed"
    console.log("Book Removed");
  
});