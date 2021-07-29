import {  Cascade, Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';

import { Book } from '../entities/Book';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Author extends BaseEntity {

  @Property()
  name: string;

  @Property()
  @Unique()
  email: string;

  @Property({ nullable: true })
  age?: number;

  @OneToMany(() => Book, b => b.author, { cascade: [Cascade.ALL] })
  books = new Collection<Book>(this);


  constructor(name: string, email: string) {
    super();
    this.name = name;
    this.email = email;
  }

}
