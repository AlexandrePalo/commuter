import React, { Component } from 'react'
import Map from '../components/Map'
import TilesContainer from '../components/TilesContainer'

export default class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stations: [],
            loadingStations: true,
            source: null,
            heatmap: null,
            loadingHeatmap: false,
            selectedStation: null,
            selectedPath: null,
            loadingSelectedPath: false
        }
        this.setSource = this.setSource.bind(this)
        this.setSelectedStation = this.setSelectedStation.bind(this)
        this.handleHeatmapGeneration = this.handleHeatmapGeneration.bind(this)
        this.handleSelectedPathGeneration = this.handleSelectedPathGeneration.bind(
            this
        )
    }

    componentDidMount() {
        // Get stations name for autocomplete
        this.setState({ loadingStations: true })
        fetch('http://localhost:5000/stations/')
            .then(res => res.json())
            .then(data => {
                this.setState({
                    loadingStations: false,
                    stations: data.data.stations
                })
            })
    }

    setSource(source) {
        this.setState({
            source,
            heatmap: !source ? null : this.state.heatmap,
            selectedPath: !source ? null : this.state.selectedPath
        })
    }

    setSelectedStation(station) {
        this.setState({
            selectedStation: station,
            selectedPath: !station ? null : this.state.selectedPath
        })
    }

    handleHeatmapGeneration() {
        this.setState({ loadingHeatmap: true })
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
                    },
                    loadingHeatmap: false
                })
            })
    }

    pathReducer(path, stations) {
        const pathReduced = []

        path.forEach(p => {
            if (pathReduced.length > 0) {
                if (pathReduced[pathReduced.length - 1].by === p.by) {
                    pathReduced[pathReduced.length - 1] = {
                        ...pathReduced[pathReduced.length - 1],
                        duration:
                            pathReduced[pathReduced.length - 1].duration +
                            p.duration,
                        to: {
                            ...p.to,
                            station: stations.find(s => s.uuid === p.to.station)
                        },
                        nbStops: pathReduced[pathReduced.length - 1].nbStops + 1
                    }
                } else {
                    pathReduced.push({
                        ...p,
                        from: {
                            ...p.from,
                            station: stations.find(
                                s => s.uuid === p.from.station
                            )
                        },
                        to: {
                            ...p.to,
                            station: stations.find(s => s.uuid === p.to.station)
                        },
                        nbStops: 1
                    })
                }
            } else {
                pathReduced.push({
                    ...p,
                    from: {
                        ...p.from,
                        station: stations.find(s => s.uuid === p.from.station)
                    },
                    to: {
                        ...p.to,
                        station: stations.find(s => s.uuid === p.to.station)
                    },
                    nbStops: 1
                })
            }
        })

        return pathReduced
    }

    handleSelectedPathGeneration() {
        this.setState({ loadingSelectedPath: true })

        // Force 1 s loading
        new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, 1000)
        }).then(() => {
            fetch(
                'http://localhost:5000/path/' +
                    this.state.source.uuid +
                    '/' +
                    this.state.selectedStation.uuid +
                    '/'
            )
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        selectedPath: this.pathReducer(
                            data.data.path,
                            this.state.stations
                        ),
                        loadingSelectedPath: false
                    })
                })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.source !== this.state.source) {
            if (this.state.source) {
                this.handleHeatmapGeneration()
            }
        }

        if (prevState.selectedStation !== this.state.selectedStation) {
            if (
                this.state.source &&
                this.state.heatmap !== [] &&
                !this.state.loadingHeatmap &&
                this.state.selectedStation
            ) {
                this.handleSelectedPathGeneration()
            }
        }
    }

    render() {
        if (!this.state.loadingStations) {
            return (
                <div>
                    <TilesContainer
                        source={this.state.source}
                        setSource={this.setSource}
                        selectedStation={this.state.selectedStation}
                        setSelectedStation={this.setSelectedStation}
                        loadingHeatmap={this.state.loadingHeatmap}
                        selectedPath={this.state.selectedPath}
                        loadingSelectedPath={this.state.loadingSelectedPath}
                    />
                    <Map
                        stations={this.state.stations}
                        heatmap={this.state.heatmap}
                        source={this.state.source}
                        selectedStation={this.state.selectedStation}
                        setSelectedStation={this.setSelectedStation}
                    />
                </div>
            )
        }
        return null
    }
}
