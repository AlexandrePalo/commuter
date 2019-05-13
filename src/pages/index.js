import React, { Component } from 'react'
import Map from '../components/Map'
import Form from '../components/Form'

export default class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stations: [],
            loading: false,
            heatmap: [],
            source: {
                error: false,
                value: '',
                uuid: ''
            }
        }
        this.setSource = this.setSource.bind(this)
        this.setSourceRaw = this.setSourceRaw.bind(this)
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
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

    setSourceRaw(station) {
        this.setState({
            source: { error: false, value: station.name, uuid: station.uuid }
        })
    }

    handleSearchSubmit() {
        fetch(
            'http://localhost:5000/heatmap/interpolated/' +
                this.state.source.uuid +
                '/'
        )
            .then(res => res.json())
            .then(data => {
                this.setState({
                    heatmap: {
                        data: data.data.heatmap,
                        latStep: data.data.latStep,
                        lonStep: data.data.lonStep
                    }
                })
            })
    }

    render() {
        if (!this.state.loading) {
            return (
                <div>
                    <Form
                        style={{
                            position: 'absolute',
                            top: 50,
                            width: '100%',
                            marginRight: 'auto',
                            marginLeft: 'auto',
                            left: 0,
                            right: 0,
                            zIndex: 500
                        }}
                        stations={this.state.stations}
                        source={this.state.source}
                        setSource={this.setSource}
                        submit={this.handleSearchSubmit}
                    />
                    <Map
                        stations={this.state.stations}
                        heatmap={this.state.heatmap}
                        source={this.state.source}
                        setSource={this.setSourceRaw}
                    />
                </div>
            )
        }
        return null
    }
}
