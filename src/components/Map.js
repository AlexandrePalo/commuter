import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet/dist/leaflet.js'
import * as d3 from 'd3'
import 'd3-selection-multi'
import { withPrefix } from 'gatsby'

const getIndexForUuid = (uuid, data) => {
  return data.map(d => d.uuid).indexOf(uuid)
}

// http://a.tile.stamen.com/toner/${z}/${x}/${y}.png
// http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

const zoomScale = zoom => Math.pow(zoom, 4) / 5000

/*
stopsData.forEach((d, i) => {
  stopsData[i].push(new L.LatLng(d[2], d[3]))
})
*/
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

    const updateDetailedStopsElementsPositions = elements => {
      elements.attr(
        'transform',
        d =>
          'translate(' +
          map.latLngToLayerPoint(d.latlng).x +
          ',' +
          map.latLngToLayerPoint(d.latlng).y +
          ')'
      )
      elements.attr('r', zoomScale(map.getZoom()))
    }

    const updateDirectLinksElementsPositions = elements => {
      elements.attrs(d => {
        return {
          x1: map.latLngToLayerPoint(d[0]).x,
          y1: map.latLngToLayerPoint(d[0]).y,
          x2: map.latLngToLayerPoint(d[1]).x,
          y2: map.latLngToLayerPoint(d[1]).y
        }
      })
    }

    d3.dsv(';', withPrefix('detailedStops.csv'), d => {
      const latitude = +d.LATITUDE.replace(',', '.')
      const longitude = +d.LONGITUDE.replace(',', '.')
      return {
        uuid: d.UUID,
        name: d.NAME,
        latitude,
        longitude,
        line: d.LINE,
        latlng: new L.LatLng(latitude, longitude),
        directLinks: d.DIRECT_LINK.split('/')
      }
    }).then(data => {
      // Build directLinks
      data = data.map(d => {
        return {
          ...d,
          directLinksObj: d.directLinks.map(
            dL => data[getIndexForUuid(dL, data)]
          )
        }
      })

      const directLinksCouples = []
      data.forEach((d, i) => {
        d.directLinksObj.forEach(dL => {
          directLinksCouples.push([d.latlng, dL.latlng])
        })
      })

      // DetailedStops
      const detailedStopElements = g
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .style('stroke', 'black')
        .style('opacity', 0.6)
        .style('fill', 'red')
        .attr('r', zoomScale(initialZoom))

      // DirectLink
      const directLinksElements = g
        .selectAll('line')
        .data(directLinksCouples)
        .enter()
        .append('line')
        .style('stroke', 'blue')
        .style('stroke-width', 2)

      map.on('load movestart zoom viewreset', () => {
        updateDetailedStopsElementsPositions(detailedStopElements)
        updateDirectLinksElementsPositions(directLinksElements)
      })
      updateDetailedStopsElementsPositions(detailedStopElements)
      updateDirectLinksElementsPositions(directLinksElements)
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
