const DDtoDMS = d => {
    /*
    Convert decimal degrees to DMS object.
    Ex : 38.432 to 38°25'32''
    */
    return {
        D: Math.trunc(d),
        M: Math.trunc((d % 1) * 60),
        S: Math.trunc((((d % 1) * 60) % 1) * 60)
    }
}

const humanizeDDToDMS = d => {
    /*
    Convert DMS object to standard text.
    Ex : 38° 25' 32''
    */
    const DMS = DDtoDMS(d)
    return `${DMS.D}° ${DMS.M}' ${DMS.S}''`
}

const humanizeLatLngDDToDMS_NW = ll => {
    /*
    Convert LatLng object to standard text.
    Ex : 38° 25' 32'' N, 20° 12' 34'' S

    NOTA : in Estern Europe, all coordinate are North and West type.
    NOTA2 : W --> O in french.
    */
    return `${humanizeDDToDMS(ll.lat)} N, ${humanizeDDToDMS(ll.lng)} O`
}

export { humanizeLatLngDDToDMS_NW }
