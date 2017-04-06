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
    }

    GetList() {
        m.load.Start();
        wx.request({
            url: m.config.UrlActivityList,
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

        var count = 0;
        var dataList = res.data.list;
        m.nodeList = [];
        for(var listYear of dataList) {
            var nodes = listYear["items"];
            for(var node of nodes) {
                node["color"] = "color_" + count % 5;
                count++;
                node["count"] = count;
                node["type"] = (count % 2 == 1) ? "right" : "left";
                node["box"] = m.load.showClass;
                node["largebox"] = m.c_hiddenClass;
                node["pictureClass"] = m.c_hiddenClass;
                m.nodeList[count] = node;
            }
        }
        m.ui.SetData(m.c_dataList, dataList);
        m.ui.SetData(m.c_nodeList, m.nodeList);
    }

    failGetList(res) {
        m.load.Fail();
    }

    ShowBox(data) {
        var that = this;
        var count = data.count;
        var large = data.large;
        var nodeKey = Tool.BuildKey(m.c_nodeList, count);

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
            var node = m.nodeList[count];
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
    }
}

Page(controller);