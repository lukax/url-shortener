import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";

@Entity()
export class Link {

    @ObjectIdColumn()
    _id: ObjectID;

    @Column()
    name: string;

    @Column()
    pageUrl: string;

    @Column()
    hash: string;

    @Column()
    buttonUrl: string;

    @Column()
    buttonText: string;

    @Column()
    message: string;

    @Column()
    userId: ObjectID;

}

