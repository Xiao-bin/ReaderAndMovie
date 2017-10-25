function getStars(stars) {
  var num = stars.toString().substring(0, 1);
  var starsArry = [];
  for (var i = 0; i < 5; i++) {
    if (i < num) {
      starsArry.push(1);
    }
    else {
      starsArry.push(0);
    }
  }
  return starsArry;
}
function http(url, callBack) {
  wx.request({
    url: url,
    data: {},
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'content-type': 'json'
    }, // 设置请求的 header
    success: function (res) {
      // success
      callBack(res.data);
    },
    fail: function (error) {
      // fail
      console.log(error)
    },
    complete: function () {
      // complete
    }
  })
}

function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}
module.exports = {
  getStars: getStars,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}