import { Cascade, Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Book } from "./Book";


@Entity()
export class Publisher{

  @PrimaryKey()
  id: number;

  @Property()
  age: number;

  @Property()
  name: string;

  @ManyToMany(()=>Book,b=> b.publishers, {cascade: [Cascade.ALL],owner: true },)
  books = new Collection<Book>(this);

  constructor(id: number, age: number,name:string) {
    this.id=id;
    this.name=name;
    this.age=age;
  }


}