import {EntityRepository, Repository} from "typeorm";
import {Url} from "../model/Url";
import { MongoRepository } from "typeorm/repository/MongoRepository";

@EntityRepository(Url)
export class UrlRepository extends MongoRepository<Url> {

}