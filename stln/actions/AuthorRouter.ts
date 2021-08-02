import { QueryOrder } from '@mikro-orm/core';
import { Context } from 'koa';
import Router from 'koa-router';

import { DI } from '../server';
import { Author } from '../entities/Author';

const router = new Router();

router.get('/', async (ctx: Context) => {
  ctx.body = await DI.authorRepository.findAll(['books'], { name: QueryOrder.DESC }, 20);
});

router.get('/:id', async (ctx: Context) => {

  const author = await DI.authorRepository.findOne(ctx.params,['books'])

  if (!author) {
    return ctx.throw(404, { message: 'Author not found' });
  }
  ctx.body = author
});

router.post('/', async (ctx: Context) => {
  console.log(ctx.request.body)
  if (!ctx.request.body.name) {
    return ctx.throw(400, { message: 'name,  is missing' });
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

router.delete('/:id', async (ctx) => {
  const auth = await DI.authorRepository.findOne(ctx.params,['books'])
  if(auth){
    await DI.authorRepository.remove(auth).flush();
    ctx.body = "author deleted";

  }
  else {
    ctx.body = "Author not found"
  }
})

router.put('/:id', async (ctx) => {
  const auth = await DI.authorRepository.findOne(ctx.params,['books'])
  console.log(auth)
  if(auth){
    DI.em.assign(auth,ctx.request.body)
    await DI.authorRepository.persist(auth).flush();
    ctx.body = auth
  }
  else {
    ctx.body = "Author not found"
  }
})

export const AuthorRouter = router;
