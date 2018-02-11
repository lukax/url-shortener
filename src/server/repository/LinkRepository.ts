import {EntityRepository, Repository} from "typeorm";
import {Link} from "../model/Link";
import { MongoRepository } from "typeorm/repository/MongoRepository";

@EntityRepository(Link)
export class LinkRepository extends MongoRepository<Link> {

}
