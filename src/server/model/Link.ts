import {Column, Entity, PrimaryGeneratedColumn, ObjectID, ObjectIdColumn} from "typeorm";

@Entity()
export class Link {

    @ObjectIdColumn()
    public _id: ObjectID;

    @Column()
    public name: string;

    @Column({length: 3000})
    public pageUrl: string;

    @Column({length: 6})
    public hash: string;

    @Column()
    public pageCache: string;

    @Column()
    public pageCacheTime: number;

    @Column({length: 3000})
    public buttonUrl: string;

    @Column()
    public buttonText: string;

    @Column()
    public message: string;

    @Column()
    public userId: string;


}
