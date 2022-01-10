import './App.css';
import React, { useEffect } from 'react'
import { Table } from '@pisanix/brainstorm-ui'
import { SchemaForm } from '@pisanix/brainstorm-ui'

let loginJson = null
const getToken = async () => {
  if (!loginJson) {
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
    loginJson = await dataLogin.json()
  }
  return loginJson.access_token
}

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
      Cell: ({ value }) => (<button onClick={() => editRow(value)}>Editar</button>)
    }
  ]

  const loadMore = async ({ page, rowsPerPage, sortBy }) => {
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${await getToken()}`)
    const myInit = { method: 'GET', headers: myHeaders }

    const url = `http://localhost:8080/user?page=${page}&rowsPerPage=${rowsPerPage}&sortBy=${JSON.stringify(sortBy)}`
    const response = await fetch(url, myInit);

    // return await doHttpRequest({ url, method: 'GET' })
    return await response.json();
  }

  const [schema, setSchema] = React.useState({})
  const [uiSchema, setSiSchema] = React.useState({})
  useEffect(() => {
    if (!schema.$id) {
      const fn = async () => {
        const myHeaders = new Headers()
        myHeaders.append("Authorization", `Bearer ${await getToken()}`)
        const myInit = { method: 'GET', headers: myHeaders }

        const url = `http://localhost:8080/schema/User`
        const response = await fetch(url, myInit);
        const schema = await response.json();

        setSiSchema({
          password: {
            "ui:widget": "password"
          }
        })
        setSchema(schema)
      }
      fn()
    }
  })

  const onSubmit = ({ data }) => {
    console.log(data)
  }
  const onValidate = (formData, errors) => {
    console.log('validate')
    // errors.addError('Deu ruim!')
    // errors.password.addError("PWD incorreto!")
    return errors
  }
  const formData = { login: 'valor inicial' }
  return (
    <div className="App">
      <Table
        loadMore={loadMore}
        columns={columns}
      />
      
      <SchemaForm
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        validate={onValidate}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default App;
