class Success {
  constructor(value) {
    this.kind = "success";
    this.value = value;
  }
  then(f) {
    return f(this.value);
  }
}
class Failure {
  constructor(reason) {
    this.kind = "failure";
    this.reason = reason;
  }
  then(f) {
    return this;
  }
}

module.exports = {Success, Failure}