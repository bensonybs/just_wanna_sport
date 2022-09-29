const { default: axios } = require("axios");

const Endpoint = {
  baseUrl: 'http://booking.tpsc.sporetrofit.com/',
  location: 'http://booking.tpsc.sporetrofit.com/Home/loadLocationBlock',
  sportType: 'http://booking.tpsc.sporetrofit.com/Home/loadSportBlock',
  createBookingListEndpoint(LID, categoryId, useDate) {
    const url = "http://booking.tpsc.sporetrofit.com/Location/findAllowBookingList"
    const queryParameters = `?LID=${LID}&categoryId=${categoryId}&useDate=${useDate}`
    const endpoint = url + queryParameters
    return endpoint
  },
}
const utility = {
  formatHour(hour) {
    //將小時的數字轉為兩位數，已利排版
    hour = String(hour)
    if (hour.length < 2) {
      hour = '0' + hour
    }
    return `${hour}`
  }
}
const model = {
  locationList: [], //API抓到的運動中心清單
  sportTypeList: [], //API抓到的運動類別清單
  choosedLocations: [{ LID: 'BTSC', lidName: '北投' },
  { LID: 'DASC', lidName: '大安' },
  { LID: 'DTSC', lidName: '大同' },
  { LID: 'JJSC', lidName: '中正' },
  { LID: 'NGSC', lidName: '南港' },
  { LID: 'NHSC', lidName: '內湖' },
  { LID: 'SLSC', lidName: '士林' },
  { LID: 'SSSC', lidName: '松山' },
  { LID: 'WHSC', lidName: '萬華' },
  { LID: 'WSSC', lidName: '文山' },
  { LID: 'ZSSC', lidName: '中山' }], //使用者所選擇要查詢的運動中心
  choosedSport: { categoryId: 'Badminton', categoryName: '羽球' }, //使用者所選擇要查詢的運動類別
  useDate: '2022-10-05', //使用者所選擇要查詢的日期
  availableSlots: [],
  async getLocations() {
    const endpoint = Endpoint.location
    return await axios.post(endpoint)
  },
  async getSportTypes() {
    const endpoint = Endpoint.sportType
    return await axios.post(endpoint)
  },
}

const controller = {
  // 取得運動中心及運動項目清單
  printStartMsg() {
    console.log(`正在尋找所有可預約的【${model.choosedSport.categoryName}】場地，預約日期:${model.useDate}`)
    console.log('|中心|  時段   |位置|')
  },
  getBasicInformation() {
    Promise.all([model.getLocations(), model.getSportTypes()])
      .then((response) => {
        const location = response[0].data.locations;
        const sportType = response[1].data.categories;
        console.log(location);
        console.log(sportType);
      }).catch(error => {
        // handle error
        console.log(error);
      })
  },
  printAvailableSlots() {
    // 原本想要用model.availableSlots來存取得的資料，但asynchronous 搞不定，暫時先直接在console印出
    // 此函數暫時沒用
    model.availableSlots.forEach(slot => {
      console.log(slot)
    })
  },
  checkAvailability(LID) {
    const endpoint = Endpoint.createBookingListEndpoint(LID, model.choosedSport.categoryId, model.useDate)
    const config = {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "zh-TW,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
        "Referer": endpoint,
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "data": "_search=false&rows=200&page=1&sidx=&sord=asc", //設定回傳資料是否要分頁
      "method": "POST"
    }
    axios(endpoint, config)
      .then(response => {
        // handle success
        response.data.rows.forEach(booking => {
          const isAvailable = booking.Status == '預約'
          if (isAvailable) {
            const location = `${booking.LIDName}`
            const slot = `${booking.LSIDName}`
            const time = `${utility.formatHour(booking.StartTime.Hours)} - ${utility.formatHour(booking.EndTime.Hours)}`
            // model.availableSlots.push(`|${slot}|${time}|`)
            // 原本想要用model.availableSlots來存取得的資料，但asynchronous 搞不定，暫時先直接在console印出
            console.log(`|${location}| ${time} |${slot}`)
          }
        })
      }).catch(error => {
        // handle error
        // console.log(error);
        // Error Msg 目前先暫時忽略，之後要顯示
        return
      })
  },
  checkLocations() {
      model.choosedLocations.forEach(location => {
        controller.checkAvailability(location.LID)
      })
  },
}



controller.printStartMsg()
controller.checkLocations()


