import 'reflect-metadata';

import Koa, { Context } from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-body';
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core';

import {AuthorRouter} from './actions/AuthorRouter'
import { Author } from './entities/Author';
import { Book } from './entities/Book';
import { BookRouter } from './actions/BookRouter';
import { Publisher } from './entities/Publisher';
import { PublisherRouter} from './actions/PublisherRouter'

export const DI = {} as {
  orm: MikroORM,
  em: EntityManager,
  authorRepository: EntityRepository<Author>,
  bookRepository: EntityRepository<Book>,
  publisherRepository: EntityRepository<Publisher>
};

export const app = new Koa();

// Entry point for all modules.
const api = new Router();
api.get('/', (ctx: Context) => ctx.body = { message: 'Welcome to MikroORM Koa TS example, try CRUD on /author and /book endpoints!' });
api.use('/author', AuthorRouter.routes());
api.use('/book', BookRouter.routes());
api.use('/publisher',PublisherRouter.routes())



const port = process.env.PORT || 3000;

(async () => {
  DI.orm = await MikroORM.init(); // CLI config will be used automatically
  DI.em = DI.orm.em;
  DI.authorRepository = DI.orm.em.getRepository(Author);
  DI.bookRepository = DI.orm.em.getRepository(Book);
  DI.publisherRepository = DI.orm.em.getRepository(Publisher);

  app.use(bodyParser());
  app.use((ctx, next) => RequestContext.createAsync(DI.orm.em, next));
  app.use(api.routes());
  app.use(api.allowedMethods());
  app.use((ctx, next) => {
    ctx.status = 404;
    ctx.body = { message: 'No route found' };
  });

  app.listen(port, () => {
    console.log(`MikroORM Koa TS example started at http://localhost:${port}`);
  });
})();