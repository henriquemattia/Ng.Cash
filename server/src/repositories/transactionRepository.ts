import { AppDataSource } from '../data-source'
import { Transaction } from '../entities/Transaction'


export const transactionRepository = AppDataSource.getRepository(Transaction)