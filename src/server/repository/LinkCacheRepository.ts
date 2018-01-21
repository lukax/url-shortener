import {MongoRepository} from "typeorm/repository/MongoRepository";
import {EntityRepository} from "typeorm";
import {LinkCache} from "../model/LinkCache";

@EntityRepository(LinkCache)
export class LinkCacheRepository extends MongoRepository<LinkCache> {

}
