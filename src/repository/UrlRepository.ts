import {EntityRepository, Repository} from "typeorm";
import {Url} from "../model/Url";

@EntityRepository(Url)
export class UrlRepository extends Repository<Url> {

}