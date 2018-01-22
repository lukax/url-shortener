import {Column, Entity, PrimaryGeneratedColumn, ObjectIdColumn, ObjectID} from "typeorm";

@Entity()
export class User {

    @ObjectIdColumn()
    private _id: ObjectID;

    @Column()
    private _name: string;

    @Column({length: 128})
    private _token: string;

    get id(): ObjectID {
        return this._id;
    }

    set id(value: ObjectID) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get token(): string {
        return this._token;
    }

    set token(value: string) {
        this._token = value;
    }
}