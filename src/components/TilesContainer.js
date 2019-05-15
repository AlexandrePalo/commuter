import React, { Component } from 'react'
import './TilesContainer.scss'
import SourceTile from './SourceTile'
import StationTile from './StationTile'

class TilesContainer extends Component {
    render() {
        const {
            source,
            setSource,
            selectedStation,
            setSelectedStation
        } = this.props
        return (
            <div className="tiles-container">
                {source && (
                    <SourceTile source={source} close={() => setSource(null)} />
                )}
                {selectedStation && (
                    <StationTile
                        station={selectedStation}
                        tileStyle={{ marginTop: 20 }}
                        close={() => setSelectedStation(null)}
                        setSource={source => {
                            setSelectedStation(null)
                            setSource(source)
                        }}
                    />
                )}
            </div>
        )
    }
}

export default TilesContainer
