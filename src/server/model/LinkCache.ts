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

  isAlive(): boolean {
    const seconds = ((+new Date()) - this.cacheTime) / 1000;
    const maxTimeAliveSeconds = 60 * 60 * 24;
    return this.cacheContent != null && seconds < maxTimeAliveSeconds;
  }

}
