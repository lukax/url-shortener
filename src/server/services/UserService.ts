import {User} from "../model/User";
import {OrmRepository} from "typeorm-typedi-extensions";
import {Service} from "typedi";
import {UserRepository} from "../repository/UserRepository";
import axios from "axios";
import {IUserJwt} from "../dtos/IUser";

@Service()
export class UserService {

    @OrmRepository(User)
    private repo: UserRepository;


    public async getAll(): Promise<User[]> {
        return this.repo.find();
    }

    public async persist(user: User): Promise<User> {
        return this.repo.save(user);
    }

    public async getUserInfo(accessToken: string): Promise<IUserJwt> {
      const res = await axios.get(`https://jeitin.auth0.com/userinfo`,
        {timeout: 5000, headers: { 'Authorization': `Bearer ${accessToken}`} });
      return res.data;
    }

    public async findByToken(decoded: IUserJwt) {
      if(!decoded) return null;
      let usr = await this.repo.findOne({ sub: decoded.sub });
      if(!usr) {
        usr = new User();
        usr.sub = decoded.sub;
        usr.registrationDate = +new Date();
        usr = await this.repo.save(usr);
      }
      return usr;
    }

}
