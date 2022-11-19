import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Account } from "./Account"

@Entity('Transactions')
export class Transaction{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Account, account => account.id)
    debitedAccount: number

    @ManyToOne(() => Account, account => account.id)
    creditedAccount: number

    @Column()
    value: number

    @CreateDateColumn({ name: 'created_At' })
    createdAt: Date
}