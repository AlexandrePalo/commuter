// http://a.tile.stamen.com/toner/${z}/${x}/${y}.png
// http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet/dist/leaflet.js'
import * as d3 from 'd3'
import 'd3-selection-multi'
import { withPrefix } from 'gatsby'
import './Map.css'

import { interpolatedValue } from '../utils/gridding'

const getIndexForUuid = (uuid, data) => {
    return data.map(d => d.uuid).indexOf(uuid)
}
const zoomScaleRadius = zoom => Math.pow(zoom, 4) / 500 //5000
const zoomScaleText = zoom => Math.pow(zoom, 4) / 2000
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
            heatmapElements: null
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
            .style('stroke-width', 3)
            .attr('r', 10)

        return stationsElements
    }

    generateHeatmapElements(heatmap) {
        const svg = d3.select('#map').select('svg')
        const g = svg.append('g')

        let data = heatmap
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
        L.tileLayer('https://tile.openstreetmap.bzh/eu/{z}/{x}/{y}.png', {
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
            stationsElements
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
            // RESET HEATMAP ELEMENTS
            // STORE TO STATE.HEATMAPELEMENTS
            console.log('should create heatmap elements')
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
            this.setState({ heatmapElements })
        }
    }

    updatePositionOfElements() {
        const { map, stationsElements, heatmapElements } = this.state
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
            heatmapElements.attr(
                'transform',
                d =>
                    'translate(' +
                    map.latLngToLayerPoint(d.latlng).x +
                    ',' +
                    map.latLngToLayerPoint(d.latlng).y +
                    ')'
            )

            // Assuming nb is a perfect square and nb > 4
            const nb = heatmapElements.data().length // ex: 100, sqrt(100)=10
            const rWidth = Math.abs(
                map.latLngToLayerPoint(heatmapElements.data()[1].latlng).x -
                    map.latLngToLayerPoint(heatmapElements.data()[0].latlng).x
            )
            const rHeight = Math.abs(
                map.latLngToLayerPoint(
                    heatmapElements.data()[Math.sqrt(nb)].latlng
                ).y - map.latLngToLayerPoint(heatmapElements.data()[0].latlng).y
            )
            heatmapElements.attr('width', rWidth).attr('height', rHeight)
        }
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
