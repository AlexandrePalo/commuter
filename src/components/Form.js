import React, { Component } from 'react'
import { withPrefix } from 'gatsby'
import Autocomplete from 'react-autocomplete'

import './Form.css'

/*
    Form with source input and search button.
    Autocomplete with stations name.
*/

class Form extends Component {
  state = {
    source: false,
    stations: [],
    loading: true,
    source: {
      error: false,
      value: '',
      uuid: ''
    }
  }

  componentDidMount() {
    // Get stations name for autocomplete
    this.setState({ loading: true })
    fetch(withPrefix('stations.json'))
      .then(res => res.json())
      .then(data => {
        this.setState({ loading: false, stations: data.data.stations })
      })
  }

  render() {
    // TODO : limit number of results or limit height
    // TODO remark : the name shouldn't be hard coded but find in the array of stations by uuid.
    return (
      <div className="form-container">
        <label htmlFor="input-start">Départ</label>
        {!this.state.loading && (
          <Autocomplete
            getItemValue={item => item.uuid}
            items={this.state.stations}
            shouldItemRender={(item, value) => {
              if (value === '') {
                return false
              }
              return item.name.toLowerCase().includes(value.toLowerCase()) > 0
            }}
            renderItem={(item, isHighlighted) => (
              <div
                style={{ background: isHighlighted ? 'lightgray' : 'white' }}
                key={item.uuid}
              >
                {item.name}
              </div>
            )}
            value={this.state.source.value}
            onChange={e =>
              this.setState({ source: { error: false, value: e.target.value } })
            }
            onSelect={value => {
              // TODO: may be refactored to find the name ?
              this.setState({
                source: {
                  error: false,
                  uuid: value,
                  value: this.state.stations.find(s => s.uuid === value).name
                }
              })
            }}
            autoHighlight
          />
        )}
      </div>
    )
  }
}

export default Form
