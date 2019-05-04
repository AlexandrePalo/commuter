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
    },
    mode: 'start' // start, search, result ?
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

  render() {
    return (
      <div
        className="form-container"
        style={{
          maxWidth: this.state.mode === 'start' ? 800 : 400,
          ...this.props.style
        }}
      >
        {!this.state.loading && (
          <React.Fragment>
            <div
              className="inputs-container"
              style={{
                padding: this.state.mode === 'start' ? 0 : '30px 40px',
                borderRadius: this.state.mode === 'start' ? 20 : '5px 5px 0 0'
              }}
            >
              <label
                htmlFor="input-start"
                style={{
                  display: this.state.mode === 'start' ? 'none' : 'block'
                }}
              >
                Départ
              </label>

              <Autocomplete
                renderInput={props => (
                  <input
                    {...props}
                    placeholder={
                      this.state.mode === 'start'
                        ? 'Je travaille à Châtillon ...'
                        : ''
                    }
                    onFocus={() => this.setState({ mode: 'search' })}
                    style={{
                      padding: this.state.mode === 'start' ? 30 : 10,
                      fontSize: this.state.mode === 'start' ? 20 : 16,
                      borderRadius: this.state.mode === 'start' ? 20 : 5
                    }}
                  />
                )}
                getItemValue={item => item.uuid}
                items={this.state.stations}
                shouldItemRender={(item, value) => {
                  if (value === '') {
                    return false
                  }
                  return (
                    item.name.toLowerCase().includes(value.toLowerCase()) > 0
                  )
                }}
                renderItem={(item, isHighlighted) => (
                  <div
                    className="autocomplete-option"
                    key={item.uuid}
                    style={{ fontWeight: isHighlighted ? 'bold' : 'inherit' }}
                  >
                    <span>{item.name}</span>
                    <span>{item.lines.join(' ')}</span>
                  </div>
                )}
                value={this.state.source.value}
                onChange={e =>
                  this.setState({
                    source: { error: false, value: e.target.value }
                  })
                }
                onSelect={value => {
                  // TODO: may be refactored to find the name ?
                  this.setState({
                    source: {
                      error: false,
                      uuid: value,
                      value: this.state.stations.find(s => s.uuid === value)
                        .name
                    }
                  })
                }}
                autoHighlight
                menuStyle={{
                  borderRadius: '0 0 5px 5px',
                  boxShadow: '0 4px 6px hsla(0, 0%, 0%, 0.1)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '90%',
                  position: 'fixed',
                  marginTop: 2,
                  overflow: 'auto',
                  maxHeight: 43 * 5
                }}
              />
            </div>
            {this.state.mode === 'search' && (
              <button role="button">RECHERCHER</button>
            )}
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default Form
