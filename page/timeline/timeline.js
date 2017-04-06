var Logic = require("../../common/js/logic.js");
var Tool = require("../../common/js/tool.js");
var m = {};

/*
    "dataList": {}
    "nodeList": {}
*/
class TimelineLogic extends Logic
{
    constructor(obj){
        super(obj);
        m = this;

        m.c_durationLong = 1000;
        m.c_durationShort = 500;
        m.c_durationTiny = 100;
        m.c_dataList = "dataList";
        m.c_nodeList = "nodeList";

        m.c_hiddenClass = "hidden";
        m.c_showClass = "";
        m.c_large = 'large';

        m.year = "";
        m.nodeList = new Array();
        m.pageIndex = 1;
    }

    GetList(p) {
        m.load.Start();
        wx.request({
            url: m.config.UrlActivityPage + p,
            success: m.successGetList,
            fail: m.failGetList
        });
    }

    successGetList(res) {
        if (res.statusCode != 200) {
            m.failGetList(res);
            return;
        }
        m.load.Success();

        var dataList = res.data.list;
        if (dataList.length == 0) {
            m.pageIndex = false;
            return;
        }

        var index = m.nodeList.length;
        for(var node of dataList) {
            if (node["year"] != m.year) {
                m.year = node["year"];
                node["yearNew"] = true;
            }
            node["color"] = "color_" + index % 5;
            node["type"] = (index % 2 == 0) ? "right" : "left";
            node["box"] = m.c_showClass;
            node["largebox"] = m.c_hiddenClass;
            node["pictureClass"] = m.c_hiddenClass;
            m.nodeList[index] = node;
            index++;
        }

        m.ui.SetData(m.c_nodeList, m.nodeList);
    }

    failGetList(res) {
        m.load.Fail();
    }

    PullDownRefresh() {
    }

    ReachBottom() {
        if (m.pageIndex == false) {
            return;
        }

        m.GetList(++m.pageIndex);
        m.ui.ShowLoading();
    }

    ShowBox(data) {
        var that = this;
        var index = data.index;
        var large = data.large;
        var nodeKey = Tool.BuildKey(m.c_nodeList, index);

        var showPre = '';
        var hidePre = '';
        var showDuration = 0;
        var hideDuration = 0;
        if (large == m.c_large) {
            showPre = m.c_large;
            showDuration = m.c_durationLong;
            hideDuration = m.c_durationShort;
        }
        else {
            hidePre = m.c_large;
            showDuration = m.c_durationShort;
            hideDuration = m.c_durationLong;
        }

        // 1. hide box, hideDuration
        m.ui.RunAnimation(Tool.BuildKeyString(nodeKey, hidePre + "boxAnimation"), hideDuration, false);
        setTimeout(hideEnd, hideDuration);

        // 2. set class, tinyDuration
        function hideEnd() {
            m.ui.SetData(Tool.BuildKeyString(nodeKey, showPre + "box"), "");
            m.ui.SetData(Tool.BuildKeyString(nodeKey, hidePre + "box"), "hidden");
            setTimeout(show, m.c_durationTiny);
        }

        // 3. show box, showDuration
        function show() {
            var node = m.nodeList[index];
            if (node["pic_path"] != "") {
                m.ui.SetData(Tool.BuildKeyString(nodeKey, "picture"), m.config.UrlImage + "?size=large&pic=" + node["pic_path"]);
                m.ui.SetData(Tool.BuildKeyString(nodeKey, "pictureClass"), m.c_showClass);
            }
            m.ui.RunAnimation(Tool.BuildKeyString(nodeKey, showPre + "boxAnimation"), showDuration, true);
        }

    }
}

controller = {
    onReady: function () {
        this.logic = new TimelineLogic(this);
        this.logic.GetList();
    },
    tap: function (e) {
        this.logic.tap(e);
    },
    onShareAppMessage: function () {
        return this.logic.share();
    },
    onPullDownRefresh: function () {
        this.logic.PullDownRefresh();
    },
    onReachBottom: function () {
        this.logic.ReachBottom();
    }
}

Page(controller);