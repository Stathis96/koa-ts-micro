import { QueryOrder } from '@mikro-orm/core';
import { Context } from 'koa';
import Router from 'koa-router';

import { DI } from '../server';
import { Publisher } from '../entities/Publisher';

const router = new Router();

router.get('/', async (ctx: Context) => {
  ctx.body = await DI.publisherRepository.findAll(['books'], { name: QueryOrder.DESC }, 20);
});

router.get('/:id', async (ctx: Context) => {

  const publisher = await DI.publisherRepository.findOne(ctx.params,['books'])

  if (!publisher) {
    return ctx.throw(404, { message: 'publisher not found' });
  }
  ctx.body = publisher
});

router.post('/', async (ctx: Context) => {
  console.log(ctx.request.body)
  if (!ctx.request.body.name) {
    return ctx.throw(400, { message: 'name,  is missing' });
  }

  try {
    const publisher = DI.em.create(Publisher, ctx.request.body);
    await DI.publisherRepository.persist(publisher).flush();

    ctx.body = publisher;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.delete('/:id', async (ctx) => {
  const publisher = await DI.publisherRepository.findOne(ctx.params,['books'])
  if(publisher){
    await DI.publisherRepository.remove(publisher).flush();
    ctx.body = "author deleted";

  }
  else {
    ctx.body = "Author not found"
  }
})

router.put('/:id', async (ctx) => {
  const publisher = await DI.publisherRepository.findOne(ctx.params)
  console.log(publisher)
  if(publisher){
    DI.em.assign(publisher,ctx.request.body)
    await DI.publisherRepository.persist(publisher).flush();
    ctx.body = publisher
  }
  else {
    ctx.body = "Author not found"
  }
})

router.patch('/:id', async (ctx) => {
  const publisher = await DI.publisherRepository.findOne(ctx.params)
 console.log(ctx.body)
  console.log(publisher)
  if(publisher){
    publisher.books.add(ctx.request.body)
    ctx.body = publisher
  }
  else {
    ctx.body = "Author not found"
  }
})


export const PublisherRouter = router;
