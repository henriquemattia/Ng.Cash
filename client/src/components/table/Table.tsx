import React from 'react';


// import { Container } from './styles';

const TableTransfer: React.FC = (props: any) => {
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