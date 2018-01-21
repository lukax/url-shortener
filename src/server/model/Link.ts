import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";

@Entity()
export class Link {

    @ObjectIdColumn()
    public _id: ObjectID;

    @Column()
    public name: string;

    @Column()
    public pageUrl: string;

    @Column()
    public hash: string;

    @Column()
    public buttonUrl: string;

    @Column()
    public buttonText: string;

    @Column()
    public message: string;

    @Column()
    public userId: string;

}

