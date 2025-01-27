import { Entity, Column } from 'typeorm';

import { Base } from './Base';

@Entity('users')
export class User extends Base {
    @Column({ type: 'text', unique: true })
    email!: string;

    @Column({ type: 'text', nullable: true })
    firstName!: string | null;

    @Column({ type: 'text', nullable: true })
    lastName!: string | null;

    @Column({ type: 'text' })
    role!: string;
}
