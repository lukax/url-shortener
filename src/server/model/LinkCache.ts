import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";
import { PageMetadata } from "../dtos/PageMetadata";

@Entity()
export class LinkCache {

  @ObjectIdColumn()
  public _id: ObjectID;

  @Column()
  public pageUrl: string;

  @Column()
  public fileKey: string;

  @Column()
  public cacheTime: number;

  @Column()
  metadata: PageMetadata;

  isExpired(): boolean {
    const seconds = ((+new Date()) - this.cacheTime) / 1000;
    const maxTimeAliveSeconds = 60 * 60 * 24;
    return !this.fileKey || seconds > maxTimeAliveSeconds;
  }

}
