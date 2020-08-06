/* global L */

// Constant key
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export default class SearchElement {
  /**
   * Define if search has error
   *
   * @property {Boolean} hasError
   */
  hasError = false;

  /**
   * Define if search is active
   *
   * @property {Boolean} isActive
   */
  isActive = false;

  /**
   * List of elements on SearchElement
   *
   * @property {Objects} elements
   */
  elements = {
    container: null,
    form: null,
    input: null,
    resetButton: null,
  }

  /**
   * SearchElement Constructor
   *
   * @param {Function} handleSubmit Callback on submit
   * @param {String} inputLabel Label for input
   * @param {classNames} classNames Objects of class names for elements
   */
  constructor(handleSubmit = () => {}, inputLabel = 'search', classNames = {}) {
    const container = L.DomUtil.create('div', ['tocoordinates', classNames.container].join(' '));
    const form = L.DomUtil.create('form', ['', classNames.form].join(' '), container);
    const input = L.DomUtil.create('input', ['glass', classNames.input].join(' '), form);

    if (!(input instanceof HTMLInputElement)) {
      throw new Error(`${classNames.input} is not an input`)
    }

    input.type = 'text';
    input.placeholder = inputLabel;

    const resetButton = L.DomUtil.create('a', classNames.resetButton, form);
    resetButton.innerHTML = 'X';
    L.DomEvent.on(resetButton, 'click', this.clearInput, this);

    // When focus or blur active form
    L.DomEvent.on(input, 'focus blur', () => {
      L.DomUtil.addClass(this.elements.form, 'active');
    });

    L.DomEvent.on(input, 'keydown', this.onKeyDown, this);

    this.elements = {
      container,
      form,
      input,
      resetButton,
    };
    this.handleSubmit = handleSubmit;
  }

  /**
   * Call on submit for call the callback this.handleSubmit
   * Called when enter is pressed
   *
   * @param {KeyboardEvent} event Event of keyboard
   */
  onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    this.resetError();

    const response = this.handleSubmit(this.elements.input.value);

    if (response === false) {
      this.setError();
    }
  }

  /**
   * When key is pressed
   *
   * @param {KeyboardEvent} event Event of keyboard
   */
  onKeyDown(event) {
    const { container } = this.elements;

    if (event.keyCode === ENTER_KEY) {
      this.onSubmit(event);
    } else if (event.keyCode === ESCAPE_KEY) {
      L.DomUtil.removeClass(container, 'active');

      this.clearInput();

      document.body.focus();
      document.body.blur();
    } else if (this.hasError) {
      this.resetError();
    }
  }

  /**
   * Shortcut to set active status
   */
  setActive() {
    const { container, input } = this.elements;

    this.isActive = true;
    L.DomUtil.addClass(container, 'active');
    input.focus();
  }

  /**
   * Shortcut to reset active status
   */
  resetActive() {
    this.isActive = false;
    this.clearInput();
    L.DomUtil.removeClass(this.elements.container, 'active');
  }

  /**
   * Shortcut to set error status
   */
  setError() {
    this.hasError = true;
    L.DomUtil.addClass(this.elements.input, 'error');
  }

  /**
   * Shortcut to reset error status
   */
  resetError() {
    this.hasError = false;
    L.DomUtil.removeClass(this.elements.input, 'error');
  }

  /**
   * Shortcut to clear input and remove error class
   */
  clearInput() {
    const { input } = this.elements;
    input.value = '';
    L.DomUtil.removeClass(input, 'error');
  }
}
