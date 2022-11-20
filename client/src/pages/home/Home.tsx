import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { useForm } from 'react-hook-form'
import axios from 'axios'

// Styles
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './home.css'

// TYPES
import { Transactions, MakeTransaction } from '../../Types/Transactions'
import { UserFinal } from '../../Types/User';



const Home: React.FC = () => {

  const [user, setUser] = useState<UserFinal>()
  const [transactions, setTransactions] = useState<Transactions>()

  const [reqError, setReqError] = useState<boolean>(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MakeTransaction>();

  // Requisiçao inicial, verificando a existencia do token
  const navigate = useNavigate()

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


  // Efetuar Transferencia
  const makeTransfer = async (data: MakeTransaction) => {
    try {
      const url = '/transfer'
      const res = await safeApi.post(url, {
        username: data.username,
        value: data.value
      } as MakeTransaction)
      console.log(res);

      if (res.status !== 200) {
        alert('Erro ao efetuar a transferencia')
        setReqError(true)
      }
      setReqError(false)
    } catch (err) {
      console.log(err);
      setReqError(true)
    }
  }



  return (
    <>
      <NavBar />
      <header>
        <h4>Bem vindo, {user?.username}!</h4>
        <p>Seu saldo é de: {user?.balance},00 R$</p>
      </header>

      <section>
        <h4>Trasnferir</h4>

        <div className='dd'>
          <Row>
            <Col>
              <Form.Label>Para: </Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Nome:</InputGroup.Text>
                <Form.Control
                  className='input_form'
                  placeholder="Nome do destinatário"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  {...register("username", { required: true, minLength: 3 })}
                  {...errors.username && <small style={{ color: "red" }}>Nome é Obrigatório</small>}
                  {...errors.username?.type === "minLength" && <p style={{ color: "red" }}><small>Nome deve conter no minimo 3 caracteres </small></p>}
                />
              </InputGroup>

            </Col>

            <Col>
              <Form.Label>valor: </Form.Label>
              <InputGroup className="mb-3 ">
                <InputGroup.Text>R$</InputGroup.Text>
                <Form.Control
                  type='number'
                  placeholder="Ex: 50"
                  className='input_form'
                  aria-label="Amount (to the nearest dollar)"
                  {...register("value", { required: true, })}
                  {...errors.username && <small style={{ color: "red" }}>Valor é Obrigatório</small>}
                />
                <InputGroup.Text>,00</InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
        </div>

        <Form.Group>
          <div className='area-button'>
            <button className='submit_button' type='submit' onClick={handleSubmit(makeTransfer)}>Enviar</button>
          </div>
        </Form.Group>
        {reqError ? <small style={{ color: "red" }}>Algo deu Errado!</small> : null}



      </section>

    </>
  )
}

export default Home;