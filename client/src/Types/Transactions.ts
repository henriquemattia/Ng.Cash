export type Transactions = [{
    id: number
    creditedAccountId: number,
    debitedAccountId: number,
    value: number,
    created_At: string,
  }]

  export  type MakeTransaction = {
    username: string,
    value: number
  }