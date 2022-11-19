import { useState, useEffect } from 'react';
import api from '../../services/Api';
type UserFinal = {
  id: Number,
  username: String
  accountId: Number,
  balance: Number,
}

type Transactions = [{
  id: Number
  creditedAccountId: Number ,
  debitedAccountId: Number,
  value: Number,
  created_At: Date,
}]

const Home: React.FC = () => {

    const [user, setUser] = useState<UserFinal>()
    const [ transactions, setTransactions ] = useState<Transactions>()

    const getUser = async () => {
      try {
        const url = '/profile'
        const res = await api.get(url)
       setUser(res.data[0].user)
       setTransactions(res.data[1].allTransacions)
        
      } catch (err) {
        console.log(err);
      }
    }
    console.log(transactions);
    
  
    useEffect(() => {
      getUser()
      return
    }, [])

  return (
    <>
    <div>{transactions?.map((tran, index)=>{
       
        return(
          
        <>
         <h1>ola mundo</h1>
        </>
      )
      })
    }</div>
   
    </>
  )
}

export default Home;