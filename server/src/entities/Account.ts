import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./Transaction";
import { User } from "./User";

@Entity('Accounts')
export class Account{
    @PrimaryGeneratedColumn()
    @OneToMany(() => Transaction, transaction => transaction.debitedAccount && transaction.creditedAccount)
    id: number

    @Column()
    balance: number

}