import React, { Component } from 'react'
import Map from '../components/Map'
import Form from '../components/Form'

export default class Index extends Component {
  state = {
    stations: [],
    loading: false,
    source: {
      error: false,
      value: '',
      uuid: ''
    }
  }

  componentDidMount() {
    // Get stations name for autocomplete
    this.setState({ loading: true })
    fetch('http://localhost:5000/stations/')
      .then(res => res.json())
      .then(data => {
        this.setState({ loading: false, stations: data.data.stations })
      })
  }

  setSource(source) {
    this.setState({ source })
  }

  handleSearchSubmit() {}

  render() {
    if (!this.state.loading) {
      return (
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
            stations={this.state.stations}
            source={this.state.source}
            setSource={this.setSource.bind(this)}
          />
          <Map stations={this.state.stations} source={this.state.source} />
        </div>
      )
    }
    return null
  }
}
