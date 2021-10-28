import React from 'react'
import Form from '@rjsf/core'

const App = ({ schema, uiSchema, formData, validate, onSubmit }) => {
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      validate={validate}
      // onChange={(e) => console.log('changed ', e)}
      onSubmit={(e) => onSubmit({ data: e.formData })}
      // onError={(e) => console.log('errors ', e)}
    />
  )
}

export default App
