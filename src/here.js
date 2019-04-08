// JFUBhzWpe8ZT0vbU5ckP
// v7vir6TSc4Eg7kPhTTO-1A
// https://developer.here.com/blog/interactive-isoline-grid-with-here-react-leaflet


export const hereCredentials = {
    id: 'JFUBhzWpe8ZT0vbU5ckP',
    code: 'v7vir6TSc4Eg7kPhTTO-1A'
 }
 
 export const hereIsolineUrl = (coords, options) => `https://isoline.route.api.here.com/routing/7.2/calculateisoline.json?app_id=${hereCredentials.id}&app_code=${hereCredentials.code}&mode=shortest;${options.mode};traffic:${options.traffic}&start=geo!${coords[0]},${coords[1]}&range=${options.range}&rangetype=${options.type}`
 
 export const hereTileUrl = (style) => `https://2.base.maps.api.here.com/maptile/2.1/maptile/newest/${style}/{z}/{x}/{y}/512/png8?app_id=${hereCredentials.id}&app_code=${hereCredentials.code}&ppi=320`;
 
 export const maxIsolineRangeLookup = {
    time: 1000,
    distance: 15000
 }