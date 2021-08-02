import { Entity, ManyToMany, ManyToOne, PrimaryKey, Property ,Collection,Cascade} from "@mikro-orm/core";
import { Author } from "./Author";
import { Publisher } from "./Publisher";


@Entity()
export class Book{

  @PrimaryKey()
  id: number;

  @Property()
  title: string;

  @ManyToOne(()=>Author)
  author: Author

  @ManyToMany(()=>Publisher,p=>p.books, {cascade: [Cascade.ALL]})
  publishers = new Collection<Publisher>(this);


  constructor(id: number,title:string, author: Author) {
    this.id=id;
    this.title=title;
    this.author=author
  }


}