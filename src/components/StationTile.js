import React, { Component } from 'react'
import './StationTile.scss'
import { humanizeLatLngDDToDMS_NW } from '../utils/geographical'

class StationTile extends Component {
    displayLine(line) {
        if (line.slice(0, 1) === 'M') {
            return line.slice(1, line.length)
        }
        if (line.slice(0, 1) === 'T') {
            return line.slice(1, line.length)
        }
        if (line.slice(0, 3) === 'RER') {
            return line.slice(3, line.length)
        }
    }

    render() {
        const { station, tileStyle } = this.props
        return (
            <div className="tile" style={{ ...tileStyle }}>
                <div style={{ position: 'absolute', right: 0, top: 0 }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="icon-close icon"
                    >
                        <path
                            className="i-secondary"
                            fillRule="evenodd"
                            d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"
                        />
                    </svg>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="icon h icon-flag"
                        >
                            <g>
                                <path
                                    className="i-secondary"
                                    d="M4 15a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7a1 1 0 0 1 .7.3L13.42 5H21a1 1 0 0 1 .9 1.45L19.61 11l2.27 4.55A1 1 0 0 1 21 17h-8a1 1 0 0 1-.7-.3L10.58 15H4z"
                                />
                                <rect
                                    width="2"
                                    height="20"
                                    x="2"
                                    y="2"
                                    className="i-primary"
                                    rx="1"
                                />
                            </g>
                        </svg>
                        <span className="subtitle" style={{ marginLeft: 20 }}>
                            {station.name}
                        </span>
                    </div>
                    <div className="divider" />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}
                    >
                        {station.lines.map((l, i) => (
                            <div key={i} className={l}>
                                {this.displayLine(l)}
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginTop: 20
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="icon s icon-location-pin"
                        >
                            <g>
                                <path
                                    className="i-secondary"
                                    d="M12 1v6a3 3 0 0 0 0 6v9.31a1 1 0 0 1-.7-.29l-5.66-5.66A9 9 0 0 1 12 1z"
                                />
                                <path
                                    className="i-secondary"
                                    d="M12 1a9 9 0 0 1 6.36 15.36l-5.65 5.66a1 1 0 0 1-.71.3V13a3 3 0 0 0 0-6V1z"
                                />
                            </g>
                        </svg>
                        <span
                            className="secondary-text"
                            style={{ marginLeft: 20 }}
                        >
                            {humanizeLatLngDDToDMS_NW(station.latlng)}
                        </span>
                    </div>
                    <div className="divider" />
                    <button className="primary">PARTIR D'ICI</button>
                </div>
            </div>
        )
    }
}

export default StationTile
