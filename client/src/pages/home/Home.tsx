import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Table from 'react-bootstrap/Table'

// Components
import NavBar from '../../components/navbar/NavBar';
import TableTransfer from '../../components/table/Table';

// Styles
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './home.css'
// TYPES
import { Transactions, MakeTransaction } from '../../Types/Transactions'
import { UserFinal } from '../../Types/User';
import Footer from '../../components/footer/Footer';

type credUser = {
  accountId: number,
  balance: number,
  id: number,
  password: string,
  username: string,
  index: number
}


const Home: React.FC = () => {

  const [user, setUser] = useState<UserFinal>()
  const [transactions, setTransactions] = useState<Transactions>()
  const [credUser, setCredUser] = useState<any>()
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
      setCredUser(res.data[2])
    } catch (err) {
      console.log(err);
    }
  }

  // console.log(transactions)


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
      } else {
        alert('Transferencia efetuada com sucesso')

        setReqError(false)
      }
    } catch (err) {
      console.log(err);
      setReqError(true)
    }
    reset()
  }



  return (
    <>
      <NavBar />
      <header>
        <div className="title_zone">
          <h4 className="user_title">Bem vindo, {user?.username}!</h4>
          <p className="balance_title">Seu saldo é de: {user?.balance},00 R$</p>
        </div>
      </header>

      <section>
        <div className="transfer_zone">
          <h4 className="transfer-title">Transferir:</h4>
          <div className='dd'>
            <Row>
              <div className="inputs">
                <Col>

                  <Form.Label className="input_title">Para: </Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Nome:</InputGroup.Text>
                    <Form.Control
                      className='input_form'
                      placeholder="Nome do destinatário"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      {...register("username", { required: true, minLength: 3 })}
                    />
                  </InputGroup>

                </Col>

                <Col>
                  <Form.Label className="input_title">Valor: </Form.Label>
                  <InputGroup className="mb-3 ">
                    <InputGroup.Text>R$</InputGroup.Text>
                    <Form.Control
                      type='number'
                      placeholder="Ex: 50"
                      className='input_form'
                      aria-label="Amount (to the nearest dollar)"
                      {...register("value", { required: true, })}
                    />
                    <InputGroup.Text>,00</InputGroup.Text>
                  </InputGroup>
                </Col>
              </div>
            </Row>
          </div>

          <Form.Group>
            <div className='area-button'>
              <button className='submit_button' type='submit' onClick={handleSubmit(makeTransfer)}>Enviar</button>
            </div>
          </Form.Group>
          {reqError ? <small style={{ color: "red" }}>Algo deu Errado!</small> : null}
        </div>
      </section>

      {/* TABELA DE TRANSFERENCIAS */}
      <section>
        <div className="my_transfers">
          <div>
            <h4 className="mytransfers_title">Suas transferências: </h4>
            <div className="mytransfers_buttons">
                <Form>
                  <Form.Check
                    checked
                    type="switch"
                    id="custom-switch"
                    label="Enviadas"
                  />
                  <Form.Check
                    disabled
                    type="switch"
                    label="Recebidas"
                    id="disabled-custom-switch"
                  />
                </Form>

              </div>
              <Table className='mytransfers_table' striped bordered responsive='sm' hover variant="dark"  >
                <thead>
                  <tr>
                    <th>De:</th>
                    <th>Para:</th>
                    <th>Valor:</th>
                    <th>Data:</th>
                  </tr>
                </thead>

                {transactions?.map((tra, index) => {
                  const data = tra.created_At.split('T')[0] as string
                  return (
                    <>

                      <TableTransfer
                        key={tra.id}
                        data={data}
                        userName={user?.username}
                        creditUsername={credUser[index].username}
                        valor={tra.value}
                      // creditUsername={tra.creditedAccountId}
                      // valor={tra.value}
                      />
                    </>
                  )
                })}
              </Table>
              {transactions == null ? <p style={{ color: "red" }}>Você ainda nao efetuou nehuma transferencia!</p> : null}

            </div>
          </div>
      </section>
      <Footer />
    </>
  )
}

export default Home;