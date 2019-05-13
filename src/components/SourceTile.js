import React, { Component } from 'react'
import './SourceTile.scss'

// TODO : change source format in index.js ...

class SourceTile extends Component {
    render() {
        const { source } = this.props
        return (
            <div className="tile search-tile-c">
                <div className="left-border-supporting" />
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
                        flexDirection: 'row',
                        padding: '20px'
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="icon h icon-location-pin"
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
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: 20
                        }}
                    >
                        <label>Départ</label>
                        <span className="subtitle">{source.name}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default SourceTile
