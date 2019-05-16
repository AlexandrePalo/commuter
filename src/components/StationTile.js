import React, { Component, Fragment } from 'react'
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

    renderPath(loading, path) {
        if (loading) {
            return (
                <Fragment>
                    <div className="divider" />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div
                            style={{ width: '65%' }}
                            className="skeleton skeleton-title"
                        />
                        <div
                            style={{ width: '50%', marginTop: 20 }}
                            className="skeleton skeleton-subtitle"
                        />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginTop: 10
                            }}
                        >
                            <div
                                style={{
                                    marginRight: 10
                                }}
                                className="skeleton skeleton-circle"
                            />
                            <div
                                style={{
                                    width: '10%',
                                    marginRight: 10
                                }}
                                className="skeleton skeleton-subtitle"
                            />
                            <div
                                style={{
                                    marginRight: 10
                                }}
                                className="skeleton skeleton-circle"
                            />
                            <div
                                style={{ width: '50%' }}
                                className="skeleton skeleton-subtitle"
                            />
                        </div>
                        <div
                            style={{ width: '90%', marginTop: 10 }}
                            className="skeleton skeleton-subtitle"
                        />
                    </div>
                </Fragment>
            )
        }

        const changeLine = p => {
            return (
                <Fragment>
                    <div className={'metro-sm tooltipped ' + p.from.stop_line}>
                        {this.displayLine(p.from.stop_line)}
                        <span className="tooltiptext">
                            Métro ligne {this.displayLine(p.from.stop_line)}
                            <span className="triangle" />
                        </span>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="icon icon-arrow-thin-right-circle"
                    >
                        <path
                            className="i-primary"
                            d="M14.59 13H7a1 1 0 0 1 0-2h7.59l-2.3-2.3a1 1 0 1 1 1.42-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.42-1.4l2.3-2.3z"
                        />
                    </svg>
                    <div className={'metro-sm tooltipped ' + p.to.stop_line}>
                        {this.displayLine(p.to.stop_line)}
                        <span className="tooltiptext">
                            Métro ligne {this.displayLine(p.to.stop_line)}
                            <span className="triangle" />
                        </span>
                    </div>
                    <span className="secondary-text">, changement à </span>
                    <span className="primary-text" style={{ marginLeft: 5 }}>
                        {p.from.station.name}
                    </span>
                </Fragment>
            )
        }
        const transportLine = p => {
            return (
                <Fragment>
                    <span
                        className="primary-text"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        {p.from.station.name}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="icon icon-arrow-thin-right-circle"
                        >
                            <path
                                className="i-primary"
                                d="M14.59 13H7a1 1 0 0 1 0-2h7.59l-2.3-2.3a1 1 0 1 1 1.42-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.42-1.4l2.3-2.3z"
                            />
                        </svg>
                        {p.to.station.name}
                    </span>
                    <span className="secondary-text">
                        , {p.nbStops} station
                        {p.nbStops > 1 ? 's' : ''} avec{' '}
                    </span>
                    <div
                        className={'metro-sm tooltipped ' + p.by}
                        style={{ marginLeft: 5 }}
                    >
                        {this.displayLine(p.by)}
                        <span className="tooltiptext">
                            Métro ligne {this.displayLine(p.by)}
                            <span className="triangle" />
                        </span>
                    </div>
                </Fragment>
            )
        }

        if (path) {
            return (
                <Fragment>
                    <div className="divider" />
                    <span className="subtitle">
                        Environ{' '}
                        {path
                            .reduce((sum, p) => sum + p.duration, 0)
                            .toFixed(0)}{' '}
                        min de trajet jusqu'à cette station
                    </span>
                    <ul style={{ marginBottom: -10, marginTop: 10 }}>
                        {path.map((p, i) => {
                            return (
                                <li key={i}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {p.by === 'WALK'
                                            ? changeLine(p)
                                            : transportLine(p)}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </Fragment>
            )
        }
    }

    render() {
        const {
            station,
            setSource,
            tileStyle,
            close,
            path,
            pathLoading
        } = this.props
        return (
            <div className="tile" style={{ ...tileStyle }}>
                <div style={{ position: 'absolute', right: 0, top: 0 }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="icon-close icon"
                        onClick={() => close()}
                    >
                        <path
                            className="i-secondary hovered"
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
                            <div key={i} className={'metro tooltipped ' + l}>
                                {this.displayLine(l)}
                                <span className="tooltiptext">
                                    Métro ligne {this.displayLine(l)}
                                    <span className="triangle" />
                                </span>
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
                    {this.renderPath(pathLoading, path)}
                    <div className="divider" />
                    <button
                        className="primary"
                        onClick={() => setSource(station)}
                    >
                        PARTIR D'ICI
                    </button>
                </div>
            </div>
        )
    }
}

export default StationTile
