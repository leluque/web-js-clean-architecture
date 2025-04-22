class ResponseWrapper {
  constructor(sender) {
    this.sender = sender;
  }

  send(payload, statusCode = 200) {
    this.sender(payload, statusCode);
  }
}

module.exports = { ResponseWrapper };
