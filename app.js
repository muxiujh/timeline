
var AppData = {
    Url: "https://wx.hnec.gov.cn/",
    UrlActivityList: "Wx/ActivityList",
    UrlAboutList: "Wx/SiteInfo",
    UrlImage: "Upload/Show",
    AppName:"海宁市电子商务协会官方",

    Init: function () {
        this.UrlActivityList = this.Url + this.UrlActivityList;
        this.UrlAboutList = this.Url + this.UrlAboutList;
        this.UrlImage = this.Url + this.UrlImage;
    }
}
AppData.Init();

App({
    data: AppData
})