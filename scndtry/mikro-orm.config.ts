import { Options } from '@mikro-orm/core';
import { Author  } from './entities/Author';
import { Book } from './entities/Book';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Publisher } from './entities/Publisher';

const config: Options = {
  type: 'sqlite',
  dbName: 'test.db',
  entities: [Author, Book,Publisher],
  highlighter: new SqlHighlighter(),
  debug: true,
};

export default config;