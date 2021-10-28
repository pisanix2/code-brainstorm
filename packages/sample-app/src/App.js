import './App.css';
import React from 'react'
import { Table } from '@pisanix/brainstorm-ui'

function App() {
  const editRow = (value) => {
    console.log('Editar: ', value)
  }
  const columns = [
    {
      Header: 'Código',
      accessor: 'id'
    },
    {
      Header: 'Tenante',
      accessor: 'id_tenant'
    },
    {
      Header: 'Login',
      accessor: 'login'
    },
    {
      Header: 'Password',
      accessor: 'password'
    },
    {
      id: 'edit',
      accessor: 'id',
      Cell: ({value}) => (<button onClick={() => editRow(value)}>Editar</button>)
    }
  ]

  const loadMore = async ({ page, rowsPerPage, sortBy }) => {
    const loginHeaders = new Headers()
    loginHeaders.append("Content-Type", 'application/json')
    const loginOptions = {
      method: 'POST',
      headers: loginHeaders,
      body: JSON.stringify({
        login: "teste",
        password: "teste"
      })
    }
    const dataLogin = await fetch('http://localhost:8080/login', loginOptions)
    const loginJson = await dataLogin.json()

    const myHeaders = new Headers()
    myHeaders.append("Authorization", `${loginJson.type} ${loginJson.access_token}`)
    const myInit = { method: 'GET', headers: myHeaders }

    const url = `http://localhost:8080/user?page=${page}&rowsPerPage=${rowsPerPage}&sortBy=${JSON.stringify(sortBy)}`
    const response = await fetch(url, myInit);
    return await response.json();
  }

  return (
    <div className="App">
      <Table
        loadMore={loadMore}
        columns={columns}
      />
    </div>
  );
}

export default App;
