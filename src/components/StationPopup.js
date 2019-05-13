import React, { Component } from 'react'
import './StationPopup.scss'

class StationPopup extends Component {
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
        const { station, onClose, onSelectSource } = this.props
        return (
            <div className="station-popup-container">
                <div className="popup-header">
                    <h2>{station.name}</h2>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="icon-close icon"
                        onClick={() => onClose()}
                    >
                        <path
                            className="secondary"
                            fillRule="evenodd"
                            d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"
                        />
                    </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="lines-container">
                        {station.lines.map((l, i) => (
                            <div key={i} className={l}>
                                {this.displayLine(l)}
                            </div>
                        ))}
                    </div>
                    <hr />
                    <div className="buttons-container">
                        <button
                            className="secondary"
                            onClick={() => onSelectSource(station)}
                        >
                            PARTIR D'ICI
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default StationPopup
