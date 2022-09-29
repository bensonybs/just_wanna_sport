const { default: axios } = require("axios");
// const FormData = require('form-data')
const Endpoint = {
  'location': 'http://booking.tpsc.sporetrofit.com/Home/loadLocationBlock',
  'sportType': 'http://booking.tpsc.sporetrofit.com/Home/loadSportBlock',
  getLocation() {
    return axios.post(this.location)
  },
  getSportType() {
    return axios.post(this.sportType)
  },
}

// 取得運動中心及運動項目，此段可成功，暫時先註解掉
// Promise.all([Endpoint.getLocation(), Endpoint.getSportType()])
//   .then((response) => {
//     const location = response[0].data.locations;
//     const sportType = response[1].data.categories;
//     console.log(location);
//     console.log(sportType);
//   }).catch(error => {
//   // handle error
//   console.log(error);
// })

// 以下有問題
// 取得運動場館預訂清單
// 伺服器會回傳以下，缺少PageNumber的參數，但不知道要怎麼設定
// ====================================
// {
//   errorMsg: 'PageNumber cannot be below 1.\r\n參數名稱: pageNumber\r\n實際的值為 0。',
//   consoleMsg: 'PageNumber cannot be below 1.\r\n參數名稱: pageNumber\r\n實際的值為 0。',
//   refreshTime: '2022/9/25 下午 02:26:04'
// }
// ====================================

const bookingListEndpoint = "http://booking.tpsc.sporetrofit.com/Location/findAllowBookingList?LID=DTSC&categoryId=Badminton&useDate=2022-10-01"
const config = {
  "headers": {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "zh-TW,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "x-requested-with": "XMLHttpRequest",
    "Referer": "http://booking.tpsc.sporetrofit.com/Location/BookingList?LID=DTSC&CategoryId=Badminton&UseDate=2022-10-01",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "_search=false&rows=100&page=1&sidx=&sord=asc",
  "method": "POST"
}
axios(bookingListEndpoint, config)
.then(response => {
  // handle success
  response.data.rows.forEach(booking => {
    const slot = `${booking.LIDName}|${booking.LSIDName}`
    const time = `${booking.StartTime.Hours}-${booking.EndTime.Hours}`
    const status = booking.Status
    const isAvailable = status == '預約'
    if (isAvailable) {
      console.log(`${slot}|${time}|${status}`)
    }
  })
}).catch(error => {
  // handle error
  console.log(error);
})