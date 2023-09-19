// pages/function/function.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultArray: [],
    resultList: [],
    showPage: false  // 控制是否显示页面的标志位
  },
  takePhoto: function () {
    var that = this; // 保存当前页面引用

    wx.chooseMedia({
      count: 1,
      mediaType: ['image', 'video'],
      sourceType: ['camera', 'album'],
      success: function (res) {
        const tempMediaPath = res.tempFiles[0].tempFilePath;
        wx.getFileSystemManager().readFile({
          filePath: tempMediaPath,
          encoding: 'base64',
          success: function (res) {
            const base64Data = res.data;
            const imageUrl = base64Data;
            const topNum = 5;
            const API_KEY = "1LsIPkOmeSi0ZNQr6WNegCRM";
            const SECRET_KEY = "fxLFHNGOBEjbZFW2A3LNkCAv1im8Z3ha";
            const apiUrl = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/classification/selection";

            wx.request({
              url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + API_KEY + '&client_secret=' + SECRET_KEY,
              method: "POST",
              header: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },

              success: function (res) {
                // 获取访问令牌成功
                const accessToken = res.data.access_token;
                wx.request({
                  url: apiUrl + "?access_token=" + accessToken,
                  method: "POST",
                  header: {
                    "Content-Type": "application/json"
                  },
                  data: {
                    image: imageUrl,
                    top_num: topNum
                  },

                  success: (res) => {
                    function transferString(string: string): string {
                      if (string === 'bcc') {
                        return "基底细胞癌";
                      } else if (string === 'mel') {
                        return "黑色素瘤";
                      } else if (string === 'nv') {
                        return "黑素细胞痣（正常）";
                      }
                      return ''
                    }
                    // 请求成功的处理逻辑
                    console.log(res.data);
                    const resultArray = res.data.results;
                    console.log(resultArray.length)
                    for (let i = 0; i < resultArray.length; i++) {
                      resultArray[i].name = transferString(resultArray[i].name)
                      resultArray[i].score = resultArray[i].score * 100
                      resultArray[i].score = resultArray[i].score.toFixed(5)
                    }
                    var currentDate = new Date();
                    console.log(currentDate);
                    let item = { name: '', score: '', date: '' };
                    item.date = currentDate.toLocaleDateString() + '   ' + currentDate.toLocaleTimeString();
                    resultArray.push(item);

                    that.data.resultList.unshift(resultArray);
                    wx.setStorage({
                      key: resultArray[3].date,
                      data: resultArray,
                      success: function () {
                        console.log('数据保存成功');
                      }
                    });
                    that.setData({
                      resultData: resultArray,
                      resultList: that.data.resultList
                    });
                    console.log(that.data.resultList)
                  },
                  fail: function (res) {
                    // 请求失败的处理逻辑
                    console.error(res);
                  }
                });
              },
              fail: function (res) {
                // 获取访问令牌失败
                console.error(res);
              }
            })
          },
          fail: function (res) {
            console.error(res);
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // wx.clearStorage({
    //   success: function(res) {
    //     console.log("本地数据已清空");
    //   }
    // });
    var that = this;
    wx.getStorageInfo({
      success: function (res) {
        var keys = res.keys;
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (key.startsWith("202")) {
            console.log('key:::' + key);
            var data = wx.getStorageSync(key);
            console.log("key: " + key + ", data: " + data);
            that.data.resultList.push(data);
          }
        }
        console.log(that.data.resultList); // 输出结果数组
        that.setData({
          resultList: that.data.resultList,
          showPage: true
        });
      }
    });
  },
  showInfo: function (event) {
    console.log(event);
    var index = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/function/info/info?index=' + index + '&' + 'date=' + this.data.resultList[index][3].date
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    var that = this;
    wx.getStorageInfo({
      success: function (res) {
        var keys = res.keys;
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (key.startsWith("202")) {
            console.log('key:::' + key);
            var data = wx.getStorageSync(key);
            console.log("key: " + key + ", data: " + data);
            that.data.resultList.push(data);
          }
        }
        console.log(that.data.resultList); // 输出结果数组
        that.setData({
          resultList: that.data.resultList,
          showPage: true
        });
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})