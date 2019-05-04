import React from 'react'
import Map from '../components/Map'
import Form from '../components/Form'

export default () => (
  <div>
    <Form
      style={{
        position: 'absolute',
        top: 150,
        width: '100%',
        marginRight: 'auto',
        marginLeft: 'auto',
        left: 0,
        right: 0,
        zIndex: 500
      }}
    />
    <Map />
  </div>
)
