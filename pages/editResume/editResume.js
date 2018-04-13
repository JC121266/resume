const sdkApi = require('../../services/sdk.js')
const app = getApp()

Page({

    data: {
        baseInfo: {
            id: '', // the id of a piece data
            userName: '',
            userGender: 2,
            birthData: '',
            eMail: ''
        },
        workInfo: [
            {
                companyName: '',
                datesEmployed: '',
                id: null
            }
        ],
        otherInfo: [
            {
                title: 'hobby',
                value: '66666666666'
            },
            {
                title: 'hobby',
                value: ''
            }
        ],
        lastX: 0, // last pageX
        lastY: 0, // last pageY
        windowHeight: app.globalData.systemInfo.windowHeight,
        hideWorkDialog: true,
        singleWorkInfo: {
            companyName: '',
            datesEmployed: '',
            id: null
        }
    },

    onLoad: function () {
        let that = this
        // that.findBaseInfo()
        // that.findworkInfo()
        that.findOtherkInfo()
        that.setData({
            windowHeight: app.globalData.systemInfo.windowHeight
        })
    },
    
    // init user base info  data
    findBaseInfo: function() {
        wx.showLoading({
            title: '获取数据中...'
          })
        sdkApi.findBaseInfo({}, res => {
            wx.hideLoading()
            // console.log('请求数据---get----6666-----res', res)
            if ( res.objects.length > 0) {
               res.objects[0].birthData = res.objects[0].birthData.substring(0, 10)
               this.setData({
                'baseInfo': res.objects[0]
               })
            }
       })
    },

    // init user work info data
    findworkInfo: function(e) {
        // console.log('findworkInfo---------------params', e)
        sdkApi.findworkInfo({}, res => {
            console.log('请求数据---呵呵哒-----findworkInfo----res', res)
            if ( res.objects.length > 0) {
                res.objects.push({
                    companyName: '',
                    datesEmployed: '',
                    id: null
                })
                
                this.setData({
                    'workInfo': res.objects,
                    'hideWorkDialog': true
                })
            } else {
                this.setData({
                    'workInfo': [{
                        companyName: '',
                        datesEmployed: '',
                        id: null
                    }]
                })
            }
       })
    },

    // init user other info data
    findOtherkInfo: function (e) {
        sdkApi.findOtherkInfo({}, res=> {
            console.log('findOtherkInfo------------init---data', res)
            if (res.objects.length > 0) {
                // let datas = [].slice.call(res.objects[0])
                // console.log('555555555555555555-------datas', datas)
                // let temp = []
                // datas.forEach((val, index) => {
                //     // val.title[index].substr(-3)
                //     console.log('6666666666666666666666666666666666666666666666')
                //     console.log('7777777777777777-------@_@', val.title[index].substr(-3))
                //     // if (val.title[index])
                //     // temp.push({
                //     //     title: 'hobby',
                //     //     value: ''
                //     // })
                // })


                this.setData({
                    'otherInfo': res.objects[0]
                })
            } else {
                this.setData({
                    'otherInfo': [{
                            title: 'title',
                            value: ''
                        }]
                })
            }
            
            console.log('otherInfo--------------666-----@_@', this.data.otherInfo)
        })
    },


    // base info date picker change event
    handleDateChange: function(e) {
        this.setData({
            'baseInfo.birthData': e.detail.value
        })
        },
    
    // base info submit
    handleBaseFormSubmit: function (e) {
        console.log('form submit data ----- @_@', e.detail.value)
        let params = {
            ...e.detail.value,
            userGender: Number(e.detail.value.userGender)
        }
        if (!this.data.baseInfo.id) { // add new user information operation
            sdkApi.addBaseInfo(params, res => {
                 console.log('请求成功了吗----add---6666-----res', res)
                 wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 1500
                  })
                 
            })

        } else { // modify information operation 
            Object.assign(params, {recordID: this.data.baseInfo.id})
            sdkApi.updateBaseInfo(params, res => {
                 console.log('请求成功了吗----update---6666-----res', res)
                 wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 1500
                  })
                 
            })

        }
    },

    // work info

    // click card : tap event
    handleWorkInfoCardTap: function (e) {
        this.setData({
            'hideWorkDialog': false,
            'singleWorkInfo': this.data.workInfo[e.currentTarget.dataset.singleWorkInfo] || this.data.workInfo[this.data.workInfo.length - 1]
        })
    },
    // delete card
    deleteCard: function (e) {
        let that = this
        console.log('555555555555555555---------e', e.currentTarget.dataset.cardId)
        sdkApi.deleteWorkInfo(e.currentTarget.dataset.cardId, res => {
            that.findworkInfo()
            console.log('success-------------delete', res)
            console.log('success-------------delete-----workInfo', this.data.workInfo)
        }, res => {
            console.log('fail--------------delete', res)
        })
    },
    // close dialog
    _closeDialog: function (e) {
        this.setData({
            'hideWorkDialog': true
        })
    },

    
    // other info
    hangdleTitleBindblur: function (e) {
        this.setData({
            ['otherInfo[' + e.currentTarget.dataset.addInfoIndex + '].title']: e.detail.value ? e.detail.value : ''
        })
        console.log('otherInfo-----', this.data.otherInfo)
    },

    hangdleValueBindblur: function (e) {
        this.setData({
            ['otherInfo[' + e.currentTarget.dataset.addInfoIndex + '].value']: e.detail.value ? e.detail.value : ''
        })
        console.log('otherInfo-----', this.data.otherInfo)
    },

    handleAddInfo: function (e) {
        if (e.currentTarget.dataset.addInfoIndex < 20) { // limit 20 line
            var temp = []
            temp = this.data.otherInfo.slice(0)
            temp.splice(e.currentTarget.dataset.addInfoIndex + 1, 0, {title: 'title', value: ''})

            this.setData({
                'otherInfo': temp
            })
            app.globalData.otherInfo = temp
            console.log('globalData----------哈哈', app.globalData)
        }
    },

    handleOtherFormSubmit: function (e) {
        console.log('handleOtherFormSubmit-----------submit', e)
        let detailValue = e.detail.value
        let params = {
            ...e.detail.value
        }
        if (!this.data.otherInfo.id) {
            sdkApi.addOtherkInfo(params, res => {
                console.log('other-info------add---res--@_@', res)
            })
        } else {
            Object.assign(params, {recordID: this.data.otherInfo.id})
            sdkApi.updateOtherkInfo(params, res => {
                console.log('other-info------update---res', res)
            })
        }
    }
})