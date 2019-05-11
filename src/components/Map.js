// http://a.tile.stamen.com/toner/${z}/${x}/${y}.png
// http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet/dist/leaflet.js'
import * as d3 from 'd3'
import 'd3-selection-multi'
import { withPrefix } from 'gatsby'
import './Map.css'

const parisCenterC = [48.8591, 2.349]
const initialZoom = 12

/*
class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
            map: null,
            stationsElements: null,
            heatmapElements: null,
            isMapLoading: true
        }
        this.updateStationsElements = this.updateStationsElements.bind(this)
        this.updateHeatmapElements = this.updateHeatmapElements.bind(this)
        this.generateHeatmap = this.generateHeatmap.bind(this)
    }

    updateHeatmapElements() {
        const { map, heatmapElements } = this.state

        // Position
        // TODO : rectangle width and height to be updated
        heatmapElements.attr(
            'transform',
            d =>
                'translate(' +
                map.latLngToLayerPoint(d.latlng).x +
                ',' +
                map.latLngToLayerPoint(d.latlng).y +
                ')'
        )
    }

    updateStationsElements() {
        const { map, stationsElements } = this.state

        // Position
        stationsElements
            .attr(
                'transform',
                d =>
                    'translate(' +
                    map.latLngToLayerPoint(d.latlng).x +
                    ',' +
                    map.latLngToLayerPoint(d.latlng).y +
                    ')'
            )
            .attr('r', zoomScaleRadius(map.getZoom()))

        // Specific stroke for source
        stationsElements.style('stroke', d => {
            if (d.uuid === this.props.source.uuid) {
                return 'hsl(350, 95%, 40%)'
            }
            return '#03B5AA'
        })
    }

    generateHeatmap() {
        const svg = d3.select('#map').select('svg')
        const g = svg.append('g')
        let data = this.props.heatmap

        // Build latlng
        data = data.map(d => ({
            ...d,
            latlng: new L.LatLng(d.latitude, d.longitude)
        }))

        const heatmapElements = g
            .selectAll('rect.station')
            .data(data)
            .enter()
            .append('rect')
            .style('fill', 'blue')
            .style('z-index', 2000)
            .style('height', 20)
            .style('width', 20)

        this.setState({ heatmapElements })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (extProps.heatmap !== []) {
            return { someState: nextProps.someValue }
        } else return null
    }

    componentDidMount() {
        const map = L.map('map').setView(parisCenterC, initialZoom)
        L.tileLayer('https://tile.openstreetmap.bzh/eu/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(map)
        L.svg().addTo(map)

        const svg = d3.select('#map').select('svg')

        const g = svg.append('g')

        let data = this.props.stations

        // Build latlng
        data = data.map(d => ({
            ...d,
            latlng: new L.LatLng(d.latitude, d.longitude)
        }))

        const stationsElements = g
            .selectAll('circle.station')
            .data(data)
            .enter()
            .append('circle')
            .style('stroke', '#03B5AA')
            .style('fill', '#03B5AA')
            .style('stroke-width', (2 * zoomScaleRadius(initialZoom)) / 3)
            .style('z-index', 2000)
            .attr('r', zoomScaleRadius(initialZoom))

        const that = this
        function handleMouseOver(d) {
            d3.select(this)
                .transition()
                .duration(250)
                .style('stroke', 'hsl(350, 95%, 40%)')
        }
        function handleMouseOut(d) {
            if (d.uuid !== that.props.source.uuid) {
                d3.select(this)
                    .transition()
                    .duration(250)
                    .style('stroke', '#03B5AA')
            } else {
                d3.select(this).style('stroke', 'hsl(350, 95%, 40%)')
            }
        }
        function handleClick(d) {
            that.props.setSource({ error: false, value: d.name, uuid: d.uuid })
        }
        stationsElements.on('mouseover', handleMouseOver)
        stationsElements.on('mouseout', handleMouseOut)
        stationsElements.on('click', handleClick)

        map.on('load movestart zoom viewreset', () => {
            this.updateStationsElements()
        })

        this.setState({ map, stationsElements, isMapLoading: false })
    }

    render() {
        if (!this.state.isMapLoading) {
            this.updateStationsElements()
            this.generateHeatmap()
        }
        return (
            <div style={styles.container}>
                <div id="map" style={styles.map} />
            </div>
        )
    }
}
*/

/* TODO
    - handle first height error
    - check performance
    - hover event
*/

const styles = {
    container: { height: '100vh', width: '100%', display: 'flex' },
    map: {
        flex: 1
    }
}

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
            .style('stroke', '#03B5AA')
            .style('fill', '#03B5AA')
            .style('stroke-width', 2)
            .attr('r', 5)

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
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(map)
        L.svg().addTo(map)

        const stationsElements = this.generateStationsElements(
            this.props.stations
        )

        map.on('movestart zoom viewreset', () => {
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
            heatmapDataChanged
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
