import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Url {

    @PrimaryGeneratedColumn()
    private _id: number;

    @Column()
    private _title: string;

    @Column({length: 3000})
    private _url: string;

    @Column({length: 6})
    private _hash: string;

    get id(): number {
        return this._id;
    }

    set id(value: number) {
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
}