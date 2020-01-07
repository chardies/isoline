import React from 'react';
import './App.css';
import { MapContainer } from './MapContainer';
import { hereIsolineUrl, maxIsolineRangeLookup } from './here';

class App extends React.Component {

  constructor(props) {
     super(props);
     this.state = {
        //Coordinates are in format [Latitude, Longitude]
        maps: [
           {
              name: 'Mandurah Toyota',
              coordinates: [-32.5356742,115.7321595],
              polygon: []
           }
        ],
        options: {
           zoom: 13.5,
           type: 'distance',
           range: 5000,
           mode: 'car',
           traffic: 'disabled',
           style: 'normal.day'
        }
     };
  }

render() {

  const max = this.state.options.type === 'distance' ?
     maxIsolineRangeLookup.distance :
     maxIsolineRangeLookup.time;

  const sliderVal = this.state.options.range > max ? max : this.state.options.range;

  return (
     <div className="app">
        <div className="controls">
           <div>
              <label htmlFor="type">Distance or Time</label>
              <select
                 id="type"
                 value={this.state.options.type}
                 onChange={this.handleFormChange}
              >
                 <option value="time">Seconds</option>
                 <option value="distance">Meters</option>
              </select>

           </div>
           <div>
              <label htmlFor="range">
                 Range ({parseInt(this.state.options.range).toLocaleString()})
              </label>
              <input
                 id="range"
                 onChange={this.handleFormChange}
                 type="range"
                 min="1"
                 max={max}
                 value={sliderVal}
              />
           </div>
           <div>
              <label htmlFor="mode">Mode</label>
              <select
                 id="mode"
                 onChange={this.handleFormChange}
                 value={this.state.options.mode}
              >
                 <option value="car">Car</option>
                 <option value="pedestrian">Pedestrian</option>
              </select>
           </div>
           <div>
              <label htmlFor="traffic">Traffic</label>
              <select
                 id="traffic"
                 onChange={this.handleFormChange}
                 value={this.state.options.traffic}
              >
                 <option value="enabled">Traffic Enabled</option>
                 <option value="disabled">Traffic Disabled</option>
              </select>
           </div>
           <div>
              <label htmlFor="zoom">Zoom Level ({this.state.options.zoom})</label>
              <input
                 id="zoom"
                 onChange={this.handleFormChange}
                 type="range"
                 min="1"
                 max="16"
                 value={this.state.options.zoom}
              />
           </div>
           <div>
              <label htmlFor="style">Map Style</label>
                 <select
                    id="style"
                    onChange={this.handleFormChange}
                    value={this.state.options.style}
                 >
                    <option value="reduced.day">Reduced Day </option>
                    <option value="reduced.night">Reduced Night</option>
                    <option value="normal.day">Normal Day</option>
                    <option value="normal.night">Normal Night</option>
                 </select>
           </div>
        </div>
        <div className="map-grid">
           {this.state.maps.map((map, index) =>
              <MapContainer
                 key={index}
                 index={index}
                 center={map.coordinates}
                 options={this.state.options}
                 handleDrag={this.handleDrag}
                 polygon={map.polygon}
                 style={this.state.options.style}
              />
           )}

        </div>
     </div>
  );
}

updateIsolines = () => {
  const promises = this.state.maps.map(m => fetch(hereIsolineUrl(m.coordinates, this.state.options)).then(x => x.json()));
  Promise.all(promises).then(res => {
     const copy = this.state.maps.map((x, i) => {
        x.polygon = res[i].response.isoline[0].component[0].shape.map(x => [x.split(',')[0], x.split(',')[1]]);
        return x;
     });
     this.setState({
        maps: copy
     });
  });
}

componentDidMount = () => {
  this.updateIsolines();
}

handleDrag = (index, coordinates) => {
  fetch(hereIsolineUrl(coordinates, this.state.options))
  .then(res => res.json())
  .then(res => {
     const copy = this.state.maps.slice();
     if (res.hasOwnProperty('response')) {
        copy[index].polygon = res.response.isoline[0].component[0].shape.map(x => [x.split(',')[0], x.split(',')[1]]);
     } else {
        copy[index].polygon = [];
     }
     copy[index].coordinates = coordinates;
     this.setState({
        maps: copy
     });
  });
}

handleFormChange = (event) => {
  const option = event.target.id;
  const value = event.target.value;
  const copy = this.state.options;
  if (option === 'type' && this.state.options.range > maxIsolineRangeLookup[value]) {
     copy.range = maxIsolineRangeLookup[value];
  }
  copy[option] = value;
  this.setState({
     options: copy
  }, () => {
     this.updateIsolines();
  });

}
}

export default App;