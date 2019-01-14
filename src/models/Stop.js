import React, { Component } from 'react'

class Stop extends Component {
  render() {
    return (<div/>)
  }
}

// Example Stop Model
const StopModel = {
  name: "Invalides", // String
  latitude: 48.8629018442, // Float
  longitude: 2.31390890638, // Float
  lines: {
    M8: 9,
    M13: 10,
    RERC: 18
  }
}
