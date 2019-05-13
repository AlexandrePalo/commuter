// http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png
// http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet/dist/leaflet.js'
import * as d3 from 'd3'
import 'd3-selection-multi'
import { withPrefix } from 'gatsby'
import './Map.scss'

const parisCenterC = [48.8591, 2.349]
const initialZoom = 12

class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
            map: null,
            stationsElements: null,
            heatmapElements: null,
            zoom: null,
            heatmapDataChanged: false
        }
        this.updatePositionOfElements = this.updatePositionOfElements.bind(this)
        this.generateStationsElements = this.generateStationsElements.bind(this)
    }

    generateStationsElements(stations) {
        const svg = d3.select('#map').select('svg')
        const g = svg.append('g')

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
            .attr('r', 5)
            .style('fill', 'blue')

        // Pointer on mouseover
        stationsElements.on('mouseover', function(d) {
            d3.select(this).style('cursor', 'pointer')
        })

        // Popup on click
        const that = this
        function handleStationClick(d) {
            that.state.map.setView(d.latlng)
            that.props.setSelectedStation(d)
        }
        stationsElements.on('click', handleStationClick)

        return stationsElements
    }

    generateHeatmapElements(heatmap) {
        const svg = d3.select('#map').select('svg')
        const g = svg.append('g')

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
            .style('fill', d => 'hsl(' + Math.random() * 360 + ',100%,50%)')

        return heatmapElements
    }

    componentDidMount() {
        const map = L.map('map').setView(parisCenterC, initialZoom)

        L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(map)
        L.svg({ updateWhileAnimating: true }).addTo(map)

        const stationsElements = this.generateStationsElements(
            this.props.stations
        )

        map.on('move', () => {
            this.updatePositionOfElements()
        })
        stationsElements.attr(
            'transform',
            d =>
                'translate(' +
                map.latLngToLayerPoint(d.latlng).x +
                ',' +
                map.latLngToLayerPoint(d.latlng).y +
                ')'
        )

        this.setState({
            map,
            stationsElements,
            zoom: map.getZoom()
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.stations &&
            JSON.stringify(this.props.stations) !==
                JSON.stringify(prevProps.stations)
        ) {
            // RESET STATIONS ELEMENTS
            // STORE TO STATE.STATIONSELEMENTS
            console.log('should create stations elements')
        }

        if (
            this.props.heatmap &&
            JSON.stringify(this.props.heatmap) !==
                JSON.stringify(prevProps.heatmap)
        ) {
            const heatmapElements = this.generateHeatmapElements(
                this.props.heatmap
            )
            heatmapElements.attr(
                'transform',
                d =>
                    'translate(' +
                    this.state.map.latLngToLayerPoint(d.latlng).x +
                    ',' +
                    this.state.map.latLngToLayerPoint(d.latlng).y +
                    ')'
            )
            this.setState({ heatmapElements, heatmapDataChanged: true })
        }
    }

    updatePositionOfElements() {
        const {
            map,
            stationsElements,
            heatmapElements,
            zoom: lastZoom,
            heatmapDataChanged,
            selectedStation
        } = this.state

        if (stationsElements) {
            stationsElements.attr(
                'transform',
                d =>
                    'translate(' +
                    map.latLngToLayerPoint(d.latlng).x +
                    ',' +
                    map.latLngToLayerPoint(d.latlng).y +
                    ')'
            )

            stationsElements
                .style('fill', d => {
                    if (d === selectedStation) {
                        return 'red'
                    }
                    return 'blue'
                })
                .attr('r', d => {
                    if (d === selectedStation) {
                        return 10
                    }
                    return 5
                })
        }

        if (heatmapElements) {
            /*
                Position: every time
                Width & height: only if zoom changed
                Color: only if data changed
            */

            // Positions
            heatmapElements.attr(
                'transform',
                d =>
                    'translate(' +
                    map.latLngToLayerPoint(d.latlng).x +
                    ',' +
                    map.latLngToLayerPoint(d.latlng).y +
                    ')'
            )

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
                    const { latStep, lonStep } = this.props.heatmap
                    rWidth = Math.abs(
                        map.latLngToLayerPoint(new L.LatLng(0, 0)).x -
                            map.latLngToLayerPoint(new L.LatLng(0, lonStep)).x
                    )
                    rHeight = Math.abs(
                        map.latLngToLayerPoint(new L.LatLng(0, 0)).y -
                            map.latLngToLayerPoint(new L.LatLng(latStep, 0)).y
                    )
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

            // Color
            if (heatmapDataChanged) {
                var heatmapColour = d3
                    .scaleLinear()
                    .domain(d3.range(0, 1, 1.0 / (colours.length - 1)))
                    .range(colours)
                var c = d3
                    .scaleLinear()
                    .domain(
                        d3.extent(heatmapElements.data().map(d => d.duration))
                    )
                    .range([0, 1])
                heatmapElements.style('fill', d => heatmapColour(c(d.duration)))
                heatmapElements.style('fill-opacity', 0.35)
            }
        }

        this.setState({ zoom: map.getZoom(), heatmapDataChanged: false })
    }

    render() {
        return (
            <div style={styles.container}>
                <div id="map" style={styles.map} />
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
        flex: 1
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
