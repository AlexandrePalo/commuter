import React, { Component } from 'react'
import './TilesContainer.scss'
import SearchTile from './SearchTile'

class TilesContainer extends Component {
    render() {
        return (
            <div className="tiles-container">
                <SearchTile />
            </div>
        )
    }
}

export default TilesContainer
