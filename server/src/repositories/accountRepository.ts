import { AppDataSource } from '../data-source'
import { Account } from '../entities/Account'

export const accountRepository = AppDataSource.getRepository(Account)