var UI = require("ui.js");
var Load = require("load.js");

class Logic
{
    constructor(obj) {
        this.ui = new UI(obj);
        this.load = new Load(this.ui);
        this.config = getApp().data;
    }

    tap(e) {
        var data = e.currentTarget.dataset;
        this[data.event](data);
    }
}

module.exports = Logic;