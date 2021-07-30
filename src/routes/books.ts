import { MikroORM, EntityManager, QueryOrder, wrap } from '@mikro-orm/core'
import Router from 'koa-router'
import { DI } from 'src/main'
import { Book } from 'src/entities/Book'
import { Context } from 'vm'

export const bookRouter = new Router({ prefix: '/books' })

bookRouter.get('/',async (ctx: Context) => {
  //ctx.body = await DI.bookRepository.findAll( ['author','tags'], { title: QueryOrder.DESC }, 20, );
  const books = await DI.bookRepository.findAll();
  ctx.body = books
  await DI.bookRepository.populate(books,['author'])
  await DI.bookRepository.populate(books,['tags'])
 // ctx.body = await DI.bookRepository.findAll( ['tags'], { tags: QueryOrder.DESC }, 20, );
})

bookRouter.get('/:id', async (ctx: Context) => {
  try {
    const book = await DI.bookRepository.findOne(ctx.params.id, ['author']);
   // const book = await DI.em.findOneOrFail(Book, ctx.params.id, ['author']) xwris repository an ithela
    if (!book) {
      return ctx.throw(404, { message: 'Book not found' });
    }
    ctx.body = book;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});


bookRouter.post('/', async (ctx: Context) => {
  console.log(ctx.request.body)
  if (!ctx.request.body.title || !ctx.request.body.author) {
    ctx.throw(400, { message: 'One of `title or author` is missing' });
  }
  try {
    const book = DI.bookRepository.create(ctx.request.body);
    await DI.bookRepository.persist(book).flush();

    ctx.body = book;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

bookRouter.put('/:id', async (ctx: Context) => {
  try {
    const book = await DI.bookRepository.findOne(ctx.params.id);

    if (!book) {
      return ctx.throw(404, { message: 'Book not found' });
    }

    wrap(book).assign(ctx.request.body);
    await DI.bookRepository.persist(book).flush();

    ctx.body = book;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

bookRouter.delete('/:id', async (ctx: Context) => {
  
    const book = await DI.bookRepository.findOne(ctx.params.id);

    if (!book) {
      return ctx.throw(404, { message: 'Book not found' });
    }

    await DI.bookRepository.removeAndFlush(book);
    ctx.body = "Successfully removed"
    console.log("Book Removed");
  
});