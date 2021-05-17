class Validators {
  constructor(doc) {
    this.doc = doc;
  }

  checkPriceDiscount() {
    const docObj = this.doc;

    return docObj.priceDiscount < docObj.price;
  }
}

export { Validators as default };
