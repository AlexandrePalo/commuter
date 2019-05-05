// http://a.tile.stamen.com/toner/${z}/${x}/${y}.png
// http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet/dist/leaflet.js'
import * as d3 from 'd3'
import 'd3-selection-multi'
import { withPrefix } from 'gatsby'
import './Map.css'

const getIndexForUuid = (uuid, data) => {
  return data.map(d => d.uuid).indexOf(uuid)
}
const zoomScaleRadius = zoom => Math.pow(zoom, 4) / 5000
const zoomScaleText = zoom => Math.pow(zoom, 4) / 2000
const parisCenterC = [48.8591, 2.349]
const initialZoom = 12

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = { map: null, stationsElements: null, isMapLoading: true }
    this.updateStationsElements = this.updateStationsElements.bind(this)
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

    // Heatmap
    if (this.props.heatmap) {
      const min = Math.min(
        ...Object.keys(this.props.heatmap).map(k => this.props.heatmap[k])
      )
      const max = Math.max(
        ...Object.keys(this.props.heatmap).map(k => this.props.heatmap[k])
      )
      stationsElements.style('fill', d => {
        const duration_mapped01 =
          (this.props.heatmap[d.uuid] - max) / (min - max) // inversé pour RdYlGn
        return d3.interpolateRdYlGn(duration_mapped01)
        //return d3.interpolateRdBu(duration_mapped01)
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
        var heatmapColour = d3
          .linearScale()
          .domain(d3.range(0, 1, 1.0 / (colours.length - 1)))
          .range(colours)
        var c = d3.scale
          .linear()
          .domain(
            d3.extent(
              Object.keys(this.props.heatmap).map(k => this.props.heatmap[k])
            )
          )
          .range([0, 1])
        return c(duration_mapped01)
      })
    }

    // Specific stroke for source
    stationsElements.style('stroke', d => {
      if (d.uuid === this.props.source.uuid) {
        return 'hsl(350, 95%, 40%)'
      }
      return '#03B5AA'
    })
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
    }
    return (
      <div style={styles.container}>
        <div id="map" style={styles.map} />
      </div>
    )
  }
}

const styles = {
  container: { height: '100vh', width: '100%', display: 'flex' },
  map: {
    flex: 1
  }
}

export default Map
