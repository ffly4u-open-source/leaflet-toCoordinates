/* global L */
import SearchElement from './searchElement';

const defaultOptions = () => ({
  position: 'topleft',
  style: 'button',
  retainZoomLevel: false,
  animateZoom: true,
  inputLabel: 'Enter GPS coordinates',
  zoomLevel: 18,
  classNames: {
    container: 'leaflet-bar leaflet-control leaflet-control-tocoordinates',
    button: 'leaflet-bar-part fa fa-dot-circle-o',
    resetButton: 'reset',
    form: '',
    input: '',
  },
});

const wasHandlerEnabled = {};
const mapHandlers = [
  'dragging',
  'touchZoom',
  'doubleClickZoom',
  'scrollWheelZoom',
  'boxZoom',
  'keyboard',
];

const Control = {
  initialize(options) {
    this.markers = new L.FeatureGroup();
    this.handlersDisabled = false;

    this.options = {
      ...defaultOptions(),
      ...options,
    };

    const { style, classNames, inputLabel } = this.options;

    if (style !== 'button') {
      this.options.classNames.container += ` ${this.options.style}`;
    } else {
      this.options.classNames.container += ` pos-${options.position}`;
    }


    this.searchElement = new SearchElement((query) => this.onSubmit(query), inputLabel, classNames);

    const { container, form } = this.searchElement.elements;

    L.DomEvent
      .on(form, 'mouseenter', this.disableHandlers, this)
      .on(form, 'mouseleave', this.restoreHandlers, this);

    if (style === 'button') {
      const button = L.DomUtil.create('a', classNames.button, container);
      button.title = inputLabel;
      button.href = '#';

      L.DomEvent
        .on(button, 'click', this.onClick, this)
        // Prevent zoom on dblclick
        .on(button, 'dblclick', L.DomEvent.stopPropagation);
    }
  },

  /**
   * Called when is add on the map
   * @param {NewClass} map Instance of map
   *
   * @return {HTMLElement}
   */
  onAdd(map) {
    const { showMarker, style } = this.options;

    this.map = map;
    if (showMarker) {
      this.markers.addTo(map);
    }

    // If bar add container on global control container
    if (style === 'bar') {
      const { form } = this.searchElement.elements;
      const root = map.getContainer().querySelector('.leaflet-control-container');
      const container = L.DomUtil.create('div', 'leaflet-control-tocoordinates bar');
      container.appendChild(form);
      root.appendChild(container);
      this.barContainer = container;
    }

    return this.searchElement.elements.container;
  },

  /**
   * Called when is remove of the map
   *
   * @return {Object} return current object
   */
  onRemove() {
    // If barContainer exist remove it
    if (typeof this.barContainer !== 'undefined') {
      this.barContainer.remove();
    }
    // ASSURE quon restaure les handlers au remove
    this.restoreHandlers(null);
    return this;
  },

  /**
   * Click on button open form
   *
   * @param {MouseEvent} event
   */
  onClick(event) {
    L.DomEvent.stopPropagation(event);
    L.DomEvent.preventDefault(event);

    if (this.searchElement.isActive) {
      this.searchElement.resetActive();
    } else {
      this.searchElement.setActive();
    }
  },

  /**
   * Disable the interaction of Mouse with Map
   *
   * @param {MouseEvent} event
   */
  disableHandlers(event) {
    const { form } = this.searchElement.elements;

    if (this.handlersDisabled || (event && event.target !== form)) {
      return;
    }

    this.handlersDisabled = true;
    mapHandlers.forEach((handler) => {
      if (this.map[handler]) {
        wasHandlerEnabled[handler] = this.map[handler].enabled();
        this.map[handler].disable();
      }
    });
  },

  /**
   * Reactivates the interaction
   *
   * @param {MouseEvent} event
   */
  restoreHandlers(event) {
    const { form } = this.searchElement.elements;

    if (!this.handlersDisabled || (event && event.target !== form)) {
      return;
    }

    setTimeout(() => {
      this.handlersDisabled = false;
      mapHandlers.forEach((handler) => {
        if (wasHandlerEnabled[handler]) {
          this.map[handler].enable();
        }
      });
    }, 0);
  },

  /**
   * onSubmit query
   *
   * @param {String} query
   *
   * @return {Boolean} if is valid query
   */
  onSubmit(query) {
    // Decompose query
    const coordinates = query.split(',');

    // Check the validity of the query
    if (coordinates.length >= 2 && coordinates.length <= 3) {
      let valid = true;

      coordinates.forEach((entry) => {
        if (Number.isNaN(entry)) {
          valid = false;
        }
      });

      // If is valid change center and return true
      if (valid) {
        const [x, y, z] = coordinates;
        this.centerMap(x, y, z);
        return true;
      }
    }

    // If is not valid return false
    return false;
  },

  /**
   * Change the center of map
   *
   * @param {float} x
   * @param {float} y
   * @param {float} z
   */
  centerMap(x, y, z) {
    const { animateZoom } = this.options;

    const latLng = L.latLng(x, y);

    if (latLng !== null) {
      if (typeof z !== 'undefined') {
        this.map.setView(latLng, z, { animate: animateZoom });
      } else {
        this.map.setView(latLng, this.getZoom(), { animate: animateZoom });
      }
    }
  },

  /**
   * Get zoom level for centerMap
   *
   * @return {int} zoom level
   */
  getZoom() {
    const { retainZoomLevel, zoomLevel } = this.options;
    return retainZoomLevel ? this.map.getZoom() : zoomLevel;
  },
};

// Export instance of control
export default function LeafletToCoordinates(...options) {
  if (!L || !L.Control || !L.Control.extend) {
    throw new Error('Leaflet must be loaded before instantiating the control');
  }

  const LControl = L.Control.extend(Control);
  return new LControl(...options);
}
