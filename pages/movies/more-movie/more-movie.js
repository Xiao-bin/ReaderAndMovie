// pages/movies/more-movie/more-movie.js
var util = require('../../../util/util.js')
var app = getApp();
Page({
  data: {
    movies: {},
    navigationBarTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
  },
  onLoad: function (options) {
    var category = options.category;
    // console.log(category);
    this.setData({
      navigationBarTitle: category
    });
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.setData({
      requestUrl: dataUrl
    })
    util.http(dataUrl, this.processMovieData);
  },
 onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "../movie-detail/movie-detail?id=" + movieId,
    })
  },

  // onScrollTap: function (event) {
  //   var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
  //   util.http(nextUrl, this.processMovieData); 
  //   wx.showNavigationBarLoading();
  // },
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processMovieData);
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?start= 0&count=20 ";
    this.setData({
      isEmpty: true,
      movies: {},
      totalCount: 0
    })
    util.http(refreshUrl, this.processMovieData);
    wx.showNavigationBarLoading();
  },

  processMovieData: function (moviesData) {
    var movies = [];
    for (var idx in moviesData.subjects) {
      var subject = moviesData.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.getStars(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
    }
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }
    else {
      totalMovies = movies;
      this.setData({
        isEmpty: false
      })
    }
    this.setData({
      movies: totalMovies
    });
    var totalCount = this.data.totalCount + 20;
    this.setData({
      totalCount: totalCount
    });
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },





  //对页面的设置不能放在onload里，只能放在onready之后
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigationBarTitle
    })
  }
})

