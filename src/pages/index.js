import React, { Component } from 'react'
import Map from '../components/Map'
import Form from '../components/Form'
import TilesContainer from '../components/TilesContainer'

export default class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stations: [],
            loading: true,
            heatmap: [],
            source: {
                error: false,
                value: 'Champ-Elysées - Clémenceau',
                uuid: 'fed8eabb-da75-43bd-8d4a-16728c9c1128'
            },
            selectedStation: null
        }
        this.setSource = this.setSource.bind(this)
        this.setSourceRaw = this.setSourceRaw.bind(this)
        this.setSelectedStation = this.setSelectedStation.bind(this)
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

    setSelectedStation(station) {
        this.setState({
            selectedStation: station
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
                    <TilesContainer
                        source={
                            this.state.source.uuid
                                ? this.state.stations.find(
                                      s => s.uuid === this.state.source.uuid
                                  )
                                : undefined
                        }
                        selectedStation={this.state.selectedStation}
                    />
                    <Map
                        stations={this.state.stations}
                        heatmap={this.state.heatmap}
                        source={this.state.source}
                        setSource={this.setSourceRaw}
                        setSelectedStation={this.setSelectedStation}
                    />
                </div>
            )
        }
        return null
    }
}

/*
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
*/
