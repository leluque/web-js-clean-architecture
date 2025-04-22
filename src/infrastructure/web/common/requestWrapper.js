class RequestWrapper {
  #_originalRequest;
  #_getRequestData;

  constructor({ originalRequest = null, getRequestData = () => ({}) }) {
    this.#_originalRequest = originalRequest;
    this.#_getRequestData = getRequestData;
  }

  getRequestData() {
    return this.#_getRequestData(this.#_originalRequest);
  }
}

module.exports = { RequestWrapper };
