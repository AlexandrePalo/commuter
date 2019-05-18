// http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png
// http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet/dist/leaflet.js'
import * as d3 from 'd3'
import 'd3-selection-multi'
import './Map.scss'

const parisCenterC = [48.8591, 2.349]
const initialZoom = 12

class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
            map: null,
            stationsElements: null,
            edgesElements: null,
            heatmapElements: null,
            zoom: null,
            heatmapDataChanged: false
        }
        this.handleHeatmapElementsChange = this.handleHeatmapElementsChange.bind(
            this
        )
        this.handleStationsElementsChange = this.handleStationsElementsChange.bind(
            this
        )
        this.generateStationsElements = this.generateStationsElements.bind(this)
    }

    generateStationsElements(stations) {
        const svg = d3.select('#map').select('svg')

        // Remove old stations elements
        svg.select('#stations').remove()

        const g = svg
            .append('g')
            .raise()
            .attr('id', 'stations')

        let data = stations
        data = data.map(d => ({
            ...d,
            latlng: new L.LatLng(d.latitude, d.longitude)
        }))

        const stationsElements = g
            .selectAll('circle.station')
            .data(data)
            .enter()
            .append('circle')

        stationsElements.attr('class', d => {
            if (this.props.source) {
                let shouldBeUndefined = true

                if (this.props.source && d.uuid === this.props.source.uuid) {
                    shouldBeUndefined = false
                }

                if (
                    this.props.selectedStation &&
                    d.uuid === this.props.selectedStation.uuid
                ) {
                    shouldBeUndefined = false
                }

                if (this.props.selectedPath) {
                    this.props.selectedPath.forEach(sp => {
                        if (
                            sp.passingBy.map(s => s.uuid).indexOf(d.uuid) >= 0
                        ) {
                            shouldBeUndefined = false
                        }
                    })
                }

                if (shouldBeUndefined) {
                    if (d.lines.length === 1) {
                        return d.lines[0] + ' MSecondary'
                    }
                    return 'MU MSecondary'
                } else {
                    if (d.lines.length === 1) {
                        return d.lines[0]
                    }
                    return 'MU'
                }
            } else {
                if (d.lines.length === 1) {
                    return d.lines[0]
                }
                return 'MU'
            }
        })

        // Pointer on mouseover
        stationsElements.on('mouseover', function(d) {
            d3.select(this).style('cursor', 'pointer')
        })

        // Set selected station on click
        const that = this
        function handleStationClick(d) {
            const targetOffsetted = that.state.map.unproject(
                that.state.map
                    .project(d.latlng, that.state.map.getZoom())
                    .subtract([100, 0]),
                that.state.map.getZoom()
            )
            that.state.map.setView(targetOffsetted)
            that.props.setSelectedStation(d)
        }
        stationsElements.on('click', handleStationClick)

        return stationsElements
    }

    // TODO : convert to path for performances
    // Easier with from-to step in selectedPath ...
    generateEdgesElements(edges, stations) {
        const svg = d3.select('#map').select('svg')

        // Remove old edges elements
        svg.select('#edges').remove()

        const g = svg
            .append('g')
            .lower()
            .attr('id', 'edges')

        let data = edges
        data = data.map(d => {
            const sFrom = stations.find(s => s.uuid === d.from)
            const sTo = stations.find(s => s.uuid === d.to)
            return {
                ...d,
                latlngFrom: new L.LatLng(sFrom.latitude, sFrom.longitude),
                latlngTo: new L.LatLng(sTo.latitude, sTo.longitude)
            }
        })

        const edgesElements = g
            .selectAll('line.edge')
            .data(data)
            .enter()
            .append('line')

        edgesElements.attr('class', e => {
            if (this.props.source) {
                let shouldBeUndefined = true

                if (this.props.selectedPath) {
                    this.props.selectedPath.forEach(sp => {
                        if (sp.by === e.by) {
                            if (
                                sp.passingBy.map(s => s.uuid).indexOf(e.from) >=
                                    0 &&
                                sp.passingBy.map(s => s.uuid).indexOf(e.to) >= 0
                            ) {
                                shouldBeUndefined = false
                            }
                        }
                    })
                }

                if (shouldBeUndefined) {
                    console.log('MU MSecondary')
                    return 'MU MSecondary'
                } else {
                    return e.by
                }
            } else {
                return e.by
            }
        })

        return edgesElements
    }

    generateHeatmapElements(heatmap) {
        const svg = d3.select('#map').select('svg')

        // Remove old heatmap elements
        svg.select('#heatmap').remove()

        const g = svg
            .append('g')
            .lower()
            .attr('id', 'heatmap') // lower to be under stations

        let data = heatmap.data
        data = data.map(d => ({
            ...d,
            latlng: new L.LatLng(d.latitude, d.longitude)
        }))

        const heatmapElements = g
            .selectAll('rect.heatmap')
            .data(data)
            .enter()
            .append('rect')

        return heatmapElements
    }

    handleStationsElementsChange(
        mapForced = null,
        stationsElementsForced = null
    ) {
        const map = mapForced || this.state.map
        const stationsElements =
            stationsElementsForced || this.state.stationsElements

        stationsElements.attr(
            'transform',
            d =>
                'translate(' +
                map.latLngToLayerPoint(d.latlng).x +
                ',' +
                map.latLngToLayerPoint(d.latlng).y +
                ')'
        )

        stationsElements.attr('r', d => {
            if (this.props.source) {
                if (d.uuid === this.props.source.uuid) {
                    return 7.5
                }
                if (this.props.selectedStation) {
                    if (d.uuid === this.props.selectedStation.uuid) {
                        return 7.5
                    }
                }
            }
            return 5
        })

        // Source and target tooltips
        if (!this.props.source) {
            d3.select('#sourceTooltip').style('display', 'none')
            d3.select('#targetTooltip').style('display', 'none')
        }
        if (!this.props.selectedStation) {
            d3.select('#targetTooltip').style('display', 'none')
        }

        stationsElements.each(d => {
            if (this.props.source && d.uuid === this.props.source.uuid) {
                d3.select('#sourceTooltip').style('display', 'flex')
                d3.select('#sourceTooltip').style(
                    'transform',
                    () =>
                        'translate(' +
                        map.latLngToContainerPoint(d.latlng).x +
                        'px,' +
                        map.latLngToContainerPoint(d.latlng).y +
                        'px)'
                )
                document.getElementById('sourceTooltipName').textContent =
                    d.name
            }
            if (
                this.props.source &&
                this.props.selectedStation &&
                d.uuid === this.props.selectedStation.uuid
            ) {
                d3.select('#targetTooltip').style('display', 'flex')
                d3.select('#targetTooltip').style(
                    'transform',
                    () =>
                        'translate(' +
                        map.latLngToContainerPoint(d.latlng).x +
                        'px,' +
                        map.latLngToContainerPoint(d.latlng).y +
                        'px)'
                )
                document.getElementById('targetTooltipName').textContent =
                    d.name
            }
        })
    }

    handleEdgesElementsChange(mapForced = null, edgesElementsForced = null) {
        const map = mapForced || this.state.map
        const edgesElements = edgesElementsForced || this.state.edgesElements

        edgesElements
            .attr('x1', e => map.latLngToLayerPoint(e.latlngFrom).x)
            .attr('y1', e => map.latLngToLayerPoint(e.latlngFrom).y)
            .attr('x2', e => map.latLngToLayerPoint(e.latlngTo).x)
            .attr('y2', e => map.latLngToLayerPoint(e.latlngTo).y)
    }

    handleHeatmapElementsChange(heatmapElementsForced = null) {
        // NOTA : zoom state is updated here and not in handleSationsElementsChange to be sure it's after that function call.

        const { map, zoom: lastZoom } = this.state
        const { latStep, lonStep } = this.props.heatmap
        const heatmapElements =
            heatmapElementsForced || this.state.heatmapElements

        heatmapElements.attr(
            'transform',
            d =>
                'translate(' +
                map.latLngToLayerPoint(d.latlng).x +
                ',' +
                map.latLngToLayerPoint(d.latlng).y +
                ')'
        )

        const shouldUpdateSizes =
            lastZoom !== map.getZoom() || heatmapElementsForced !== null

        if (shouldUpdateSizes) {
            let rWidth = heatmapElements
                .filter(function(d, i) {
                    return i === 0
                })
                .attr('width')
            let rHeight = heatmapElements
                .filter(function(d, i) {
                    return i === 0
                })
                .attr('height')
            if (lastZoom !== map.getZoom() || (!rWidth || !rHeight)) {
                // First case
                if (!rWidth || !rHeight) {
                    rWidth = Math.abs(
                        map.latLngToLayerPoint(new L.LatLng(0, 0)).x -
                            map.latLngToLayerPoint(new L.LatLng(0, lonStep)).x
                    )
                    rHeight =
                        Math.abs(
                            map.latLngToLayerPoint(new L.LatLng(0, 0)).y -
                                map.latLngToLayerPoint(new L.LatLng(latStep, 0))
                                    .y
                        ) *
                        (16 / 11) // correction ratio, OK only for initial zoom value
                }
                if (map.getZoom() - lastZoom > 0) {
                    rWidth = rWidth * 2
                    rHeight = rHeight * 2
                }
                if (map.getZoom() - lastZoom < 0) {
                    rWidth = rWidth / 2
                    rHeight = rHeight / 2
                }
                heatmapElements.attr('width', rWidth).attr('height', rHeight)
            }
        }

        const shouldUpdateColors = heatmapElementsForced !== null

        if (shouldUpdateColors) {
            var heatmapColour = d3
                .scaleLinear()
                .domain(d3.range(0, 1, 1.0 / (colours.length - 1)))
                .range(colours)
            var c = d3
                .scaleLinear()
                .domain(d3.extent(heatmapElements.data().map(d => d.duration)))
                .range([0, 1])
            heatmapElements.style('fill', d => heatmapColour(c(d.duration)))
            heatmapElements.style('fill-opacity', 0.35)
        }

        this.setState({ zoom: map.getZoom() })
    }

    componentDidMount() {
        const map = L.map('map').setView(parisCenterC, initialZoom)

        L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(map)
        L.svg({ updateWhileAnimating: false }).addTo(map)

        // Create, update and bind stations elements
        const stationsElements = this.generateStationsElements(
            this.props.stations
        )
        const edgesElements = this.generateEdgesElements(
            this.props.edges,
            this.props.stations
        )
        this.handleEdgesElementsChange(map, edgesElements)
        this.handleStationsElementsChange(map, stationsElements)
        const that = this
        map.on('move', function() {
            that.handleEdgesElementsChange()
            that.handleStationsElementsChange()
        })
        this.setState({
            map,
            stationsElements,
            edgesElements,
            zoom: map.getZoom()
        })
    }

    componentDidUpdate(prevProps, prevState) {
        const that = this

        // New heatmap
        if (
            this.props.heatmap &&
            JSON.stringify(this.props.heatmap) !==
                JSON.stringify(prevProps.heatmap)
        ) {
            // Create, update and bind heatmapElements
            const heatmapElements = this.generateHeatmapElements(
                this.props.heatmap
            )
            this.handleHeatmapElementsChange(heatmapElements)
            this.setState({ heatmapElements })
        }
        // Heatmap deletion
        if (!this.props.heatmap && this.state.heatmapElements) {
            d3.select('#map')
                .select('svg')
                .select('#heatmap')
                .remove()
            this.state.map.off('move')
            // Reset stations event listener as they aren't named
            this.state.map.on('move', function() {
                that.handleEdgesElementsChange()
                that.handleStationsElementsChange()
            })
        }

        // Change of source
        if (
            JSON.stringify(this.props.source) !==
            JSON.stringify(prevProps.source)
        ) {
            const stationsElements = this.generateStationsElements(
                this.props.stations
            )
            const edgesElements = this.generateEdgesElements(
                this.props.edges,
                this.props.stations
            )
            this.handleStationsElementsChange(this.state.map, stationsElements)
            this.handleEdgesElementsChange(this.state.map, edgesElements)
            this.setState({ stationsElements, edgesElements })
        }

        // Change of selectedStation
        if (
            JSON.stringify(this.props.selectedStation) !==
            JSON.stringify(prevProps.selectedStation)
        ) {
            const stationsElements = this.generateStationsElements(
                this.props.stations
            )
            const edgesElements = this.generateEdgesElements(
                this.props.edges,
                this.props.stations
            )
            this.handleStationsElementsChange(this.state.map, stationsElements)
            this.handleEdgesElementsChange(this.state.map, edgesElements)
            this.setState({ stationsElements, edgesElements })
        }

        // Change of selectedPath
        if (
            JSON.stringify(this.props.selectedPath) !==
            JSON.stringify(prevProps.selectedPath)
        ) {
            const stationsElements = this.generateStationsElements(
                this.props.stations
            )
            const edgesElements = this.generateEdgesElements(
                this.props.edges,
                this.props.stations
            )
            this.handleStationsElementsChange(this.state.map, stationsElements)
            this.handleEdgesElementsChange(this.state.map, edgesElements)
            this.setState({ stationsElements, edgesElements })
        }
    }

    render() {
        return (
            <div style={styles.container}>
                <div id="map" style={styles.map}>
                    <div id="sourceTooltip" className="tile">
                        <span className="secondary-text">Départ</span>
                        <span className="primary-text" id="sourceTooltipName" />
                        <span className="triangle" />
                    </div>
                    <div id="targetTooltip" className="tile">
                        <span className="secondary-text">Arrivée</span>
                        <span className="primary-text" id="targetTooltipName" />
                        <span className="triangle" />
                    </div>
                </div>
            </div>
        )
    }
}

export default Map

const styles = {
    container: {
        height: '100vh',
        width: '100%',
        display: 'flex',
        position: 'relative'
    },
    map: {
        flex: 1,
        position: 'relative'
    }
}

var colours = [
    '#6363FF',
    '#6373FF',
    '#63A3FF',
    '#63E3FF',
    '#63FFFB',
    '#63FFCB',
    '#63FF9B',
    '#63FF6B',
    '#7BFF63',
    '#BBFF63',
    '#DBFF63',
    '#FBFF63',
    '#FFD363',
    '#FFB363',
    '#FF8363',
    '#FF7363',
    '#FF6364'
]
