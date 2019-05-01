// http://a.tile.stamen.com/toner/${z}/${x}/${y}.png
// http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet/dist/leaflet.js'
import * as d3 from 'd3'
import 'd3-selection-multi'
import { withPrefix } from 'gatsby'

const getIndexForUuid = (uuid, data) => {
  return data.map(d => d.uuid).indexOf(uuid)
}
const zoomScaleRadius = zoom => Math.pow(zoom, 4) / 5000
const zoomScaleRadiusGrouped = zoom => Math.pow(zoom, 4) / 2000
const zoomScaleText = zoom => Math.pow(zoom, 4) / 2000
const parisCenterC = [48.8591, 2.349]
const initialZoom = 12

class Map extends Component {
  state = {}

  componentDidMount() {
    const map = L.map('map').setView(parisCenterC, initialZoom)
    L.tileLayer('http://a.tile.stamen.com/toner/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(map)
    L.svg().addTo(map)

    const svg = d3.select('#map').select('svg')
    const g = svg.append('g')

    // STATIONS http://127.0.0.1:5000/stations/
    const updateStationsElementsPositions = elements => {
      elements
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
    }
    d3.json(withPrefix('stations.json')).then(data => {
      data = data.data.stations

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
        .style('stroke', 'red')
        .style('fill', 'red')
        .attr('r', zoomScaleRadius(initialZoom))

      map.on('load movestart zoom viewreset', () => {
        updateStationsElementsPositions(stationsElements)
      })
      updateStationsElementsPositions(stationsElements)
    })
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
