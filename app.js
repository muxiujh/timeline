
var AppData = {
    Url: "https://wx.ihaining.net/",
    UrlActivityList: "Wx/ActivityList",
    UrlAboutList: "Wx/SiteInfo",
    UrlImage: "Upload/Show",

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