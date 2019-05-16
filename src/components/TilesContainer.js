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
            selectedPath,
            loadingSelectedPath,
            setSelectedStation,
            loadingHeatmap
        } = this.props
        return (
            <div className="tiles-container">
                {source && (
                    <SourceTile
                        source={source}
                        close={() => setSource(null)}
                        loading={loadingHeatmap}
                        tileStyle={{ marginBottom: 20 }}
                    />
                )}
                {selectedStation && (
                    <StationTile
                        station={selectedStation}
                        close={() => setSelectedStation(null)}
                        setSource={source => {
                            setSelectedStation(null)
                            setSource(source)
                        }}
                        path={selectedPath}
                        pathLoading={loadingSelectedPath}
                    />
                )}
            </div>
        )
    }
}

export default TilesContainer
