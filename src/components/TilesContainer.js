import React, { Component } from 'react'
import './TilesContainer.scss'
import SourceTile from './SourceTile'

class TilesContainer extends Component {
    render() {
        const { source } = this.props
        return (
            <div className="tiles-container">
                <SourceTile source={source} />
            </div>
        )
    }
}

export default TilesContainer
