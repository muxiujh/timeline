class UI
{
    constructor(obj) {
        this.obj = obj;
    }

    SetData(key, value) {
        var change = {};
        change[key] = value;
        this.obj.setData(change);
    }

    GetData(key) {
        return this.obj.getData(key);
    }

    RunAnimation(amination, duration, isShow) {
        var container = wx.createAnimation({
            duration: duration
        });

        if (isShow == true) {
            container.scaleX(1);
        }
        else {
            container.scaleX(0);
        }
        container.step();
        this.SetData(amination, container.export());
    }

    ShowLoading() {
        var duration = 1000;
        wx.showLoading({
            title: "加载更多...",
            mask: true
        });
        setTimeout(this.HideLoading, duration);
    }

    HideLoading() {
        wx.hideLoading();
    }
}

module.exports = UI;