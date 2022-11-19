import { groupCollapsed } from "console";
import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Account } from "./Account";

@Entity('Users')
export class User{
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, type: 'text' })
    username: string

    @Column({type: 'text'})
    password: string

    @OneToOne(() => Account)
    @JoinColumn({ name: 'accountId', })
    accountId: number

}