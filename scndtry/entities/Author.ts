import { Cascade, Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Book } from "./Book";


@Entity()
export class Author{

  @PrimaryKey()
  id: number;

  @Property()
  age: number;

  @Property()
  name: string;

  @OneToMany(()=>Book,b=> b.author, {cascade: [Cascade.ALL]})
  books = new Collection<Book>(this);

  constructor(id: number, age: number,name:string) {
    this.id=id;
    this.name=name;
    this.age=age;
  }


}