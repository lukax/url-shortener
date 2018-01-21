import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";

@Entity()
export class LinkCache {

  @ObjectIdColumn()
  public _id: ObjectID;

  @Column()
  public pageUrl: string;

  @Column()
  public cacheContent: string;

  @Column()
  public cacheTime: number;

}
