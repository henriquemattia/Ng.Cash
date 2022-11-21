import React from 'react';


// import { Container } from './styles';

const TableTransfer: React.FC | any = (props: {data: string, userName: string, creditUsername:string, valor: number}) => {
  return (
    <>
          <tbody >
            <tr >
              <td>{props.userName}</td>
              <td>{props.creditUsername}</td>
              <td>{props.valor},00 R$</td>
              <td>{props.data}</td>
            </tr>
          </tbody>
    </>
  )
}

export default TableTransfer;