import { Options } from '@mikro-orm/core';
import { Book } from './src/entities/Book';
import { Author } from './src/entities/Author';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { BookTag } from './src/entities/BookTag';

const config: Options = {
  type: 'sqlite',
  dbName: 'test.db',
  // as we are using class references here, we don't need to specify `entitiesTs` option
  entities: [Author, Book,BookTag],
  highlighter: new SqlHighlighter(),
  debug: true,
};

export default config;
