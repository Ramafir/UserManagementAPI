import { Entity, Column } from 'typeorm';

import { Base } from './Base';

@Entity('users')
export class User extends Base {
    @Column({ unique: true, nullable: false })
    email!: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: false })
    role: string;
}
