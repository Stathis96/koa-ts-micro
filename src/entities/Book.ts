import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { Author } from '../entities/Author';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Book extends BaseEntity {

  @Property()
  title: string;

  @ManyToOne(() => Author)
  author: Author;


  constructor(title: string, author: Author) {
    super();
    this.title = title;
    this.author = author;
  }

}
