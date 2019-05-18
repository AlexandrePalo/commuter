import React, { Component } from 'react'
import './Splash.scss'

class Splash extends Component {
    render() {
        const { close } = this.props

        return (
            <div className="splash-container">
                <div className="tile splash-tile" key="alpha">
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
                            <span className="title" style={{ marginLeft: 20 }}>
                                Commuter
                            </span>
                        </div>
                        <div className="divider" />
                        <div className="splash-description">
                            <span className="logo">Commuter</span> permet de
                            chercher les zones accessibles le plus rapidement en
                            transport, depuis une station en région parisienne.
                        </div>
                        <div className="splash-description">
                            Par exemple, tu peux sélectionner la station la plus
                            proche de ton lieu de travail, et trouver les
                            meilleurs endroits pour habiter à Paris !
                        </div>
                        <div className="divider" />
                        <button
                            className="primary splash-button"
                            onClick={() => close()}
                        >
                            ESSAYER !
                        </button>
                    </div>
                </div>
                <div className="splash-background" onClick={() => close()} />
            </div>
        )
    }
}

export default Splash
