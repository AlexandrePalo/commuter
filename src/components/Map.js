import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet/dist/leaflet.js'
import * as d3 from 'd3'
import stopsData from '../data/stops'

const zoomScale = zoom => Math.pow(zoom, 4) / 5000

stopsData.forEach((d, i) => {
  stopsData[i].push(new L.LatLng(d[2], d[3]))
})
const parisCenterC = [48.8591, 2.349]
const initialZoom = 12

class Map extends Component {
  state = {}

  componentDidMount() {
    const updateStopsPositions = () => {
      stops.attr(
        'transform',
        d =>
          'translate(' +
          map.latLngToLayerPoint(d[4]).x +
          ',' +
          map.latLngToLayerPoint(d[4]).y +
          ')'
      )
      stops.attr('r', zoomScale(map.getZoom()))
      console.log(map.getZoom(), zoomScale(map.getZoom()))
    }
    // http://a.tile.stamen.com/toner/${z}/${x}/${y}.png
    // http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
    const map = L.map('map').setView(parisCenterC, initialZoom)
    L.tileLayer('http://a.tile.stamen.com/toner/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(map)
    L.svg().addTo(map)

    const svg = d3.select('#map').select('svg')
    const g = svg.append('g')
    const stops = g
      .selectAll('circle')
      .data(stopsData)
      .enter()
      .append('circle')
      .style('stroke', 'black')
      .style('opacity', 0.6)
      .style('fill', 'red')
      .attr('r', zoomScale(initialZoom))

    map.on('load movestart zoom viewreset', updateStopsPositions)
    updateStopsPositions()
  }

  render() {
    return (
      <div style={styles.container}>
        <div id="map" style={styles.map} />
      </div>
    )
  }
}

const styles = {
  container: { height: '98vh', width: '100%', display: 'flex' },
  map: {
    flex: 1
  }
}

export default Map
