var Logic = require("../../common/js/logic.js");
var m = {};

/*
    "dataList": {}
*/
class AboutLogic extends Logic
{
    constructor(obj) {
        super(obj);
        m = this;
        m.c_dataList = "dataList";
    }

    GetList() {
        m.load.Start();
        wx.request({
            url: m.config.UrlAboutList,
            success: m.successGetList,
            fail: m.failGetList
        });
    }

    successGetList(res) {
        if (res.statusCode != 200) {
            m.failGetList(res);
            return;
        }
        m.ui.SetData(m.c_dataList, res.data.list);
        m.load.Success();
    }

    failGetList(res) {
        m.load.Fail();
    }
}

controller = {
    onReady: function () {
        this.logic = new AboutLogic(this);
        this.logic.GetList();
    },
    tap: function (e) {
        this.logic.tap(e);
    },
    onShareAppMessage: function () {
        return this.logic.share();
    }

}

Page(controller);