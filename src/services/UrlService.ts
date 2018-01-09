import {OrmRepository} from "typeorm-typedi-extensions";
import {Service} from "typedi";
import { UrlRepository } from "../repository/UrlRepository";
import { Url } from "../model/Url";

/**
 * Default service for the users.
 */
@Service()
export class UrlService {

    @OrmRepository(Url)
    private repo: UrlRepository;

    public async getAll(): Promise<Url[]> {
        return this.repo.find();
    }

    public async findOneByHash(hash: string): Promise<Url> {
        return this.repo.findOne(<any>{ _hash: hash });
    }

    public async persist(url: Url): Promise<any> {
        return this.repo.save(url);
    }

}