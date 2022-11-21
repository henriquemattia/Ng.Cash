import React, { useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import './registro.css'
import { useForm } from 'react-hook-form'

import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/Api';
import NavBar from '../../components/navbar/NavBar';
import { User } from '../../Types/User';



const Registro: React.FC = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<User>();
    const navigate = useNavigate()

    const createUser = async (data: User) => {
        try {
            const url = '/register'
            const res = await api.post(url, {
                username: data.username,
                password: data.password
            } as User)

            if (res.status == 200) {
                navigate('/')

            }

        } catch (err) {
            console.log(err);
        }
        reset()
    }

    return (
        <>
            <NavBar />
            <Container>
                <div className="register_container">
                <h1 className='title'> Cadastre-se</h1>
                <br />

                <Form>

                    {/* USERNAME */}

                    <Form.Group className="mb-3 asda" controlId="formGroupName">
                        <Form.Label className="label">Nome</Form.Label>
                        <Form.Control
                            className='input_form'
                            type="text"
                            placeholder="Nome"
                            {...register("username", { required: true, minLength: 3 })}
                        />
                        {errors.username && <small style={{ color: "red" }}>Nome é Obrigatório</small>}
                        {errors.username?.type === "minLength" && <p style={{ color: "red" }}><small>Nome deve conter no minimo 3 caracteres </small></p>}

                    </Form.Group>



                    {/* SENHA */}

                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label className="label">Senha</Form.Label>
                        <Form.Control
                            className='input_form'
                            type="password"
                            placeholder="Senha"
                            {...register("password", { required: true, pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/ })}
                        />
                        {errors.password && <span style={{ color: "red" }}> <small>Digite uma senha válida:</small></span>}
                        {errors.password?.type === "pattern" && <div style={{ color: "red" }}>
                            <ul>
                                <li>Senha válida deve conter no mínimo 8 caracteres</li>
                                <li>1 letra maiúscula</li>
                                <li>1 número</li>
                                <li>1 caractere especial</li>
                            </ul>
                        </div>}
                    </Form.Group>



                    <Form.Group>
                        <button className='login_button' type='submit' onClick={handleSubmit(createUser)}>Cadastrar-se</button>
                    </Form.Group>

                    <Form.Group>
                        <br />
                        <small className="supporting_text">Já possui uma conta? clique <Link to='/login'>aqui</Link> para entrar!</small>
                    </Form.Group>

                </Form>
                </div>
            </Container>
        </>
    );
}

export default Registro;