import { QueryOrder } from '@mikro-orm/core';
import { Context } from 'koa';
import Router from 'koa-router';

import { DI } from '../server';
import { Book } from '../entities/Book'
//import { Author } from '../entities/Author';

const router = new Router();

router.get('/', async (ctx: Context) => {
  const books = await DI.bookRepository.findAll();
  ctx.body = books
  await DI.bookRepository.populate(books,['author'])
  await DI.bookRepository.populate(books,['publishers'])
});

router.get('/:id', async (ctx: Context) => {

  const book = await DI.bookRepository.findOne(ctx.params)
  console.log(book)
  if (book) {
    ctx.body = book
    await DI.bookRepository.populate(book,['author'])
    await DI.bookRepository.populate(book,['publishers'])
  }
  else {
    return ctx.throw(404, { message: 'book not found' });
  }
});

router.post('/', async (ctx: Context) => {
  console.log(ctx.request.body)
  if (!ctx.request.body.title) {
    return ctx.throw(400, { message: 'name,  is missing' });
  }

  try {
    const book = DI.em.create(Book, ctx.request.body);
    await DI.bookRepository.persist(book).flush();

    ctx.body = book;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.delete('/:id', async (ctx) => {
  const book = await DI.bookRepository.findOne(ctx.params)
  if(book){
    await DI.authorRepository.remove(book).flush();
    ctx.body = "book deleted";

  }
  else {
    ctx.body = "book not found"
  }
})

router.put('/:id', async (ctx) => {
  const book = await DI.bookRepository.findOne(ctx.params)

  if(book){
    DI.em.assign(book,ctx.request.body)
    await DI.bookRepository.persist(book).flush();
    ctx.body = book
  }
  else {
    ctx.body = "Book not found"
  }
})

export const BookRouter = router;
