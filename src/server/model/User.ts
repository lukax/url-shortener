import {Column, Entity, PrimaryGeneratedColumn, ObjectIdColumn, ObjectID} from "typeorm";

@Entity()
export class User {

    @ObjectIdColumn()
    _id: ObjectID;

    @Column()
    name: string;

    @Column()
    sub: string;

    @Column()
    registrationDate: number;
}
