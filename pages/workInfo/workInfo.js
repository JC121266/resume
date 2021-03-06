const sdkApi = require('../../services/sdk.js')
const { recentlyViewResume } = require('../../commit/commit.js')
const app = getApp()

Page({
    data: {
        workInfo: [
            {
                companyName: '', // 公司名称
                datesEmployed: '', // 入职时间
                companyAddress: '', // 公司地址
                employedProfession: '', // 在职岗位
                id: null,
                resignationTime: '', // 离职时间
                yourProject: '', // 你的项目
                projectIntroduction: '', // 项目介绍
                lookYourProject: '', // 如何查看你的项目
                jobDuty: '' // 责任描述
            }
        ],
        hideWorkDialog: true,
        shareResumeId: ''
    },
    onLoad: function (option) {
        if (option.shareResumeId) {
            this.setData({
                'shareResumeId': option.shareResumeId
            })
        }
        this.findworkInfo()
    },
    findworkInfo (e) {
        let params = this.data.shareResumeId ? {'shareResumeId': this.data.shareResumeId} : {}
        sdkApi.findworkInfo(params, res => {
            if ( res.objects.length > 0) {
                res.objects.forEach(val => {
                    if (val.datesEmployed) {
                        val.datesEmployed = val.datesEmployed.substring(0, 10)
                    }
                })
                this.setData({
                    'workInfo': res.objects
                })
                if (this.data.shareResumeId && app.globalData.loginInfo && this.data.shareResumeId !== app.globalData.loginInfo.openid) {
                    recentlyViewResume(this.data.shareResumeId, res.objects[0].userName)
                }
            } else {
                this.setData({
                    'workInfo': [{
                        companyName: '',
                        datesEmployed: ''
                    }]
                })
            }
       })
    },
    // click card : tap event
    handleWorkInfoCardTap (e) {
        this.setData({
            'hideWorkDialog': false,
            'singleWorkInfo': this.data.workInfo[e.currentTarget.dataset.singleWorkInfo]
        })
    },
    // close dialog
    _closeDialog (e) {
        this.setData({
            'hideWorkDialog': true
        })
    },
})