import 'reflect-metadata'

import Koa, { Context } from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-body'
import Router from 'koa-router';
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core';
import { bookRouter } from './routes/books';
import { authorRouter } from './routes/author';
import { Author } from './entities/Author';
import { Book } from './entities/Book';
import { BookTag } from './entities/BookTag';
import { bookTagRouter } from './routes/booktag';


export const DI = {} as {
  orm: MikroORM,
  em: EntityManager,
   authorRepository: EntityRepository<Author>,
   bookRepository: EntityRepository<Book>,
   bookTagRepository: EntityRepository<BookTag>
};

export const app = new Koa();
const port = process.env.PORT || 3000;

const api = new Router();

app.use(cors())
.use(bodyParser())

api.get('/', (ctx: Context) => ctx.body = { message: 'Welcome to MikroORM Koa TS example' });

app.use(bookRouter.routes())
.use(bookRouter.allowedMethods())

app.use(authorRouter.routes())
  .use(authorRouter.allowedMethods())

 app.use(bookTagRouter.routes())
  .use(bookTagRouter.allowedMethods()) 

;(async () => {
  DI.orm = await MikroORM.init(); // CLI config will be used automatically
  DI.em = DI.orm.em;
   DI.authorRepository = DI.orm.em.getRepository(Author);
   DI.bookRepository = DI.orm.em.getRepository(Book);
   DI.bookTagRepository = DI.orm.em.getRepository(BookTag);
  
  app.use((ctx, next) => RequestContext.createAsync(DI.orm.em, next));

  app.use(api.routes())
  .use(api.allowedMethods());

  app.use((ctx, next) => {
    ctx.status = 404;
    ctx.body = { message: 'No route found' };
  });

  app.listen(port, () => {
    console.log(`MikroORM Koa TS example started at http://localhost:${port}`);
  });
})();