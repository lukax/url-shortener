import {Column, Entity, PrimaryGeneratedColumn, ObjectID, ObjectIdColumn} from "typeorm";

@Entity()
export class Link {

    @ObjectIdColumn()
    private _id: ObjectID;

    @Column()
    private _title: string;

    @Column({length: 3000})
    private _url: string;

    @Column({length: 6})
    private _hash: string;

    @Column()
    private _cache: string;

    @Column()
    private _cacheTime: number;

    get id(): ObjectID {
        return this._id;
    }

    set id(value: ObjectID) {
        this._id = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }
    
    get hash(): string {
        return this._hash;
    }

    set hash(value: string) {
        this._hash = value;
    }

    get cache(): string {
        return this._cache;
    }

    set cache(value: string) {
        this._cache = value;
    }

    get cacheTime(): number {
        return this._cacheTime;
    }

    set cacheTime(value: number) {
        this._cacheTime = value;
    }

}