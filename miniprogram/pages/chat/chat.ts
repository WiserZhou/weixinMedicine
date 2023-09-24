// chat.js
Page({
  data: {
    messages: [],
    inputValue: '',
    access_token: ''
  },


  onLoad: function () {
    // this.getToken();
    this.setData({
      messages: [
        { text: '你好，请问你有什么要咨询的？', isSelf: false },
        { text: '我可以为您提供各种咨询服务', isSelf: true },
      ],
    });
  },
  getToken() {
    const url_token = "https://aip.baidubce.com/oauth/2.0/token?client_id=jXNod3sBhNqbMYgbMia4uBnE&client_secret=YcVbT0gFdGzhf9YsnyFT7G5ksZQXIa14&grant_type=client_credentials";
    let that = this;
    wx.request({
      url: url_token,
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        const access_token = res.data.access_token;
        this.setData({
          access_token: access_token
        });
        const url_chat = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=" + access_token

        const payload = {
          "messages": [
            {
              "role": "user",
              "content":''+
                this.data.messages[this.data.messages.length - 1].text
            }
          ],
          "service_id": "1232"  // 指定服务ID为1232
        };
        wx.request({
          url: url_chat,
          method: "POST",
          data: payload,
          // header: {
          //   'Content-Type': 'application/json'
          // },
          success: function (res) {
            console.log(res.data);
            let message = that.data.messages;
            message.push({
              text: res.data.result, isSelf: false
            })
            that.setData({
              messages: message
            });

          },
        });
      },
    });
  },


  onInput: function (e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },

  onSend: function () {

    const inputValue = this.data.inputValue.trim();

    if (inputValue !== '') {
      const message = {
        text: inputValue,
        isSelf: true,
      };

      this.setData({
        messages: [...this.data.messages, message],
        inputValue: '',
      });
    }
    this.getToken();
  },
});
