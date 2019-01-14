import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet/dist/leaflet.js'

class Map extends Component {
  state = {}

  componentDidMount() {
    var mymap = L.map('mapid').setView([51.505, -0.09], 13)
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(mymap)
  }

  render() {
    return (
      <div style={styles.container}>
        <h1>Hello world</h1>
        <div id="mapid" style={styles.map} />
      </div>
    )
  }
}

const styles = {
  container: { height: 500, width: '100%', display: 'flex' },
  map: {
    flex: 1
  }
}

export default Map
