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

    const updateDetailedStopsElementsPositions = elements => {
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
    const updateGroupedStopsTextsPositions = texts => {
      texts
        .attr(
          'transform',
          d =>
            'translate(' +
            map.latLngToLayerPoint(d.latlng).x +
            ',' +
            map.latLngToLayerPoint(d.latlng).y +
            ')'
        )
        .attr('font-size', zoomScaleText(map.getZoom()))
        .attr('dx', () => zoomScaleRadius(map.getZoom()) * 3)
    }
    const updateGroupedStopsElementsPositions = elements => {
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
        .attr('r', zoomScaleRadiusGrouped(map.getZoom()))
    }
    const updatelinkStopElementsPositions = elements => {
      elements.attr('transform', d => {
        const mid = {
          x:
            (map.latLngToLayerPoint(d.latlng1).x +
              map.latLngToLayerPoint(d.latlng2).x) /
            2,
          y:
            (map.latLngToLayerPoint(d.latlng1).y +
              map.latLngToLayerPoint(d.latlng2).y) /
            2
        }
        return 'translate(' + mid.x + ',' + mid.y + ')'
      })
    }

    // DETAILED STOPS
    d3.dsv(';', withPrefix('detailedStops.csv'), d => {
      const latitude = +d.LATITUDE.replace(',', '.')
      const longitude = +d.LONGITUDE.replace(',', '.')
      return {
        uuid: d.UUID,
        name: d.NAME,
        latitude,
        longitude,
        line: d.LINE,
        color: d.COLOR,
        latlng: new L.LatLng(latitude, longitude),
        directLinks: d.DIRECT_LINK.split('/'),
        changeSame: d.CHANGE_SAME.split('/'),
        changeDiff: d.CHANGE_DIFF.split('/')
      }
    }).then(data => {
      const detailedStopElements = g
        .selectAll('circle.detailedStop')
        .data(data)
        .enter()
        .append('circle')
        .style('stroke', d => d.color)
        .style('fill', d => d.color)
        .attr('r', zoomScaleRadius(initialZoom))

      map.on('load movestart zoom viewreset', () => {
        updateDetailedStopsElementsPositions(detailedStopElements)
      })
      updateDetailedStopsElementsPositions(detailedStopElements)
    })

    // GROUPED STOPS
    d3.dsv(';', withPrefix('groupedStops.csv'), d => {
      const latitude = +d.LATITUDE.replace(',', '.')
      const longitude = +d.LONGITUDE.replace(',', '.')
      return {
        uuid: d.UUID,
        name: d.NAME,
        latitude,
        longitude,
        latlng: new L.LatLng(latitude, longitude),
        grouped: d.GROUPED.split('/')
      }
    }).then(data => {
      const groupedStopElements = g
        .selectAll('circle.groupedStop')
        .data(data)
        .enter()
        .append('circle')
        .style('fill', 'red')
        .attr('opacity', 0.2)
        .attr('r', zoomScaleRadiusGrouped(initialZoom))
      const groupedStopsTexts = g
        .selectAll('text.groupedStopText')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('font-weight', 700)
        .attr('fill', 'black')

      map.on('load movestart zoom viewreset', () => {
        updateGroupedStopsElementsPositions(groupedStopElements)
        updateGroupedStopsTextsPositions(groupedStopsTexts)
      })
      updateGroupedStopsElementsPositions(groupedStopElements)
      updateGroupedStopsTextsPositions(groupedStopsTexts)
    })

    // LINKS
    d3.dsv(';', withPrefix('linkCouples.csv'), d => {
      const latitude1 = +d.LATITUDE1.replace(',', '.')
      const longitude1 = +d.LONGITUDE1.replace(',', '.')
      const latitude2 = +d.LATITUDE1.replace(',', '.')
      const longitude2 = +d.LONGITUDE1.replace(',', '.')
      return {
        latlng1: new L.LatLng(latitude1, longitude1),
        latlng2: new L.LatLng(latitude2, longitude2)
      }
    }).then(data => {
      const linkCouplesElements = g
        .selectAll('line.linkCouple')
        .data(data)
        .enter()
        .append('line')
        .style('stroke', d => 'red')
        .style('fill', d => 'red')
        .attr('x1', d => map.latLngToLayerPoint(d.latlng1).x)
        .attr('x2', d => map.latLngToLayerPoint(d.latlng2).x)
        .attr('y1', d => map.latLngToLayerPoint(d.latlng1).y)
        .attr('y2', d => map.latLngToLayerPoint(d.latlng2).y)

      map.on('load movestart zoom viewreset', () => {
        updatelinkStopElementsPositions(linkCouplesElements)
      })
      updatelinkStopElementsPositions(linkCouplesElements)
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
