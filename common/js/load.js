var Tool = require("tool.js");
var m = {};

/*
    "load": {
        "loading": "",
        "loadFail": ""
    }
*/
class Load
{
    constructor(ui) {
        m.ui = ui;

        m.c_hiddenClass = "hidden";
        m.c_showClass = "";
        m.c_load = "load";

        m.loadingKey = Tool.BuildKeyString(m.c_load, "loading");
        m.loadFailKey = Tool.BuildKeyString(m.c_load, "loadFail");
        m.ui.SetData(m.loadingKey, m.c_hiddenClass);
        m.ui.SetData(m.loadFailKey, m.c_hiddenClass);
    }

    Start() {
        m.ui.SetData(m.loadingKey, m.c_showClass);
        m.ui.SetData(m.loadFailKey, m.c_hiddenClass);
    }

    Success() {
        m.ui.SetData(m.loadingKey, m.c_hiddenClass);
        m.ui.SetData(m.loadFailKey, m.c_hiddenClass);
    }

    Fail() {
        m.ui.SetData(m.loadingKey, m.c_hiddenClass);
        m.ui.SetData(m.loadFailKey, m.c_showClass);
    }

    get UI() {
        return m.ui;
    }
}

module.exports = Load;