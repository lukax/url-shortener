import {EntityRepository, Repository, MongoRepository} from "typeorm";
import {User} from "../model/User";

@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {

}