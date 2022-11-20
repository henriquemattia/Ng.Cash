import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import NavBar from '../../components/NavBar';

import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

type UserFinal = {
  id: number,
  username: string
  accountId: number,
  balance: number,
}

type Transactions = [{
  id: number
  creditedAccountId: number,
  debitedAccountId: number,
  value: number,
  created_At: string,
}]


const Home: React.FC = () => {

  const navigate = useNavigate()

  const [user, setUser] = useState<UserFinal>()
  const [transactions, setTransactions] = useState<Transactions>()

  const token = localStorage.getItem("token")
  const safeApi = axios.create({
    baseURL: 'http://localhost:3030',
    headers: { 'Authorization': `Bearer ${token}` }
  })

  const getUser = async () => {
    try {
      const url = '/profile'
      const res = await safeApi.get(url)
      setUser(res.data[0].user)
      setTransactions(res.data[1].allTransacions)

    } catch (err) {
      console.log(err);
    }
  }
  // console.log(transactions);


  useEffect(() => {
    if (!token) {
      return navigate('/login')
    }
    getUser()
    return
  }, [])



  return (
    <>
      <NavBar />
      <header>
        <h4>Bem vindo, {user?.username}!</h4>
        <p>Seu saldo é de: {user?.balance},00 R$</p>
      </header>

      <section>
        <h4>Trasnferir</h4>
        <Row>
          <Col>
            <Form.Label>Para: </Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
              <Form.Control
              className='input_form'
                placeholder="Nome do destinatário"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Col>

          <Col>
            <Form.Label>valor: </Form.Label>
            <InputGroup className="mb-3 ">
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control 
              placeholder="Ex: 50"
                className='input_form'
               aria-label="Amount (to the nearest dollar)" />
              <InputGroup.Text>,00</InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>


      </section>

    </>
  )
}

export default Home;