const interpolatedValue = (x, heatmap, stations) => {
    const p = 1 // interpolating power
    const n = Object.keys(stations).length

    let nominator = 0
    let denominator = 0

    stations.forEach(s => {
        // TODO : check condition for singularities
        if (s !== x && heatmap[s.uuid]) {
            const d = geodesicalDistance(x, s) // distance between x and s
            nominator = nominator + heatmap[s.uuid] / Math.pow(d, p)
            denominator = denominator + 1 / Math.pow(d, p)
        }
    })

    return nominator / denominator
}

const geodesicalDistance = (x, y) => {
    const rEarth = 6378137.0
    const xLatRad = (x.latitude * Math.PI) / 180.0
    const yLatRad = (y.latitude * Math.PI) / 180.0
    const dLong = (Math.abs(x.longitude - y.longitude) * Math.PI) / 180.0

    if (x === y) {
        return 0.0
    }

    const geodesicalDistance =
        Math.acos(
            Math.sin(xLatRad) * Math.sin(yLatRad) +
                Math.cos(xLatRad) * Math.cos(yLatRad) * Math.cos(dLong)
        ) * rEarth

    return geodesicalDistance
}

export { interpolatedValue }
