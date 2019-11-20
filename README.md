# leaflet-toCoordinates

A simple control to center map on specific coordinates to leaflet

## Installation

with npm:
```bash
npm install --save @ffly4u/leaflet-tocoordinates
```

or yarn:
```bash
yarn add @ffly4u/leaflet-tocoordinates
```

## Usage

```js
import L from 'leaflet';
import LeafletToCoordinates from '@ffly4u/leaflet-tocoordinates';
import '@ffly4u/leaflet-tocoordinates/dist/leaflet.css';

const control = new LeafletToCoordinates();

const map = new L.Map('map');
map.addControl(LeafletToCoordinates);
```

## Options

| Parameters | Type | Default |
|-----------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| position | String | topleft |
| style | String | button |
| retainZoomLevel | Boolean | false |
| animateZoom | Boolean | true |
| inputLabel | String | Enter GPS coordinates |
| zoomLevel | Int | 18 |
| classNames | Object | { container: 'leaflet-bar leaflet-control leaflet-control-tocoordinates', button: 'leaflet-bar-part fa fa-dot-circle-o', resetButton: 'reset', form: '', input: '' } |

## License

[MIT](https://github.com/ffly4u-open-source/leaflet-toCoordinates/blob/master/LICENSE)
