import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { Author } from '../entities/Author';
import { BaseEntity } from './BaseEntity';
import { BookTag } from '../entities/BookTag';

@Entity()
export class Book extends BaseEntity {

  @Property()
  title: string;

  @ManyToOne(() => Author)
  author: Author;

   @ManyToMany(() => BookTag)
   tags = new Collection<BookTag>(this)

  constructor(title: string, author: Author) {
    super();
    this.title = title;
    this.author = author;
  }

}
