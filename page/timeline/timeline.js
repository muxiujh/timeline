var Logic = require("../../common/js/logic.js");
var Tool = require("../../common/js/tool.js");
var m = {};

/*
    "pageList": []
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
        m.c_pageList = "pageList";

        m.c_hiddenClass = "hidden";
        m.c_showClass = "";
        m.c_large = 'large';

        m.year = "";
        m.pageList = [];
        m.pageIndex = 1;

        m.setPageTotal(20);
    }

    GetList(p) {
        m.load.Start();
        wx.request({
            url: m.config.UrlActivityPage + p,
            success: m.successGetList,
            fail: m.failGetList
        });
    }

    setPageTotal(pageTotal) {
        var pageNumArr = [];
        for (var i = 1; i <= pageTotal; ++i) {
            pageNumArr.push(i);
        }
        m.ui.SetData("pageNumArr", pageNumArr)
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
        
        var nodeList = m.pageList[m.pageIndex] = [];
        var index = 0;
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
            nodeList[index] = node;
            index++;
        }
        var pageKey = Tool.BuildKey(m.c_pageList, m.pageIndex);
        m.ui.SetData(pageKey, nodeList);
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
    }

    ShowBox(data) {
        var pageNum = data.pagenum;
        var index = data.index;
        var large = data.large;
        var nodeKey = Tool.BuildKey(m.c_pageList, pageNum);
        nodeKey = Tool.BuildKey(nodeKey, index);

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
            var node = m.pageList[pageNum][index];
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