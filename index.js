// Generated by LiveScript 1.2.0
var x$;
x$ = angular.module('core', ['ngAnimate']);
x$.directive('delayBk', function(){
  return {
    restrict: 'A',
    link: function(scope, e, attrs, ctrl){
      var url;
      url = attrs["delayBk"];
      return $('<img/>').attr('src', url).load(function(){
        $(this).remove();
        e.css({
          background: "url(" + url + ")"
        });
        return e.toggleClass('visible');
      });
    }
  };
});
x$.directive('loading', function(){
  return {
    restrict: 'E',
    template: '<div class="bubblingG"><span class="bubblingG_1"></span><span class="bubblingG_2"></span><span class="bubblingG_3"></span></div>',
    link: function(scope, e, attrs, ctrl){}
  };
});
x$.controller('main', ['$scope', '$interval', '$http'].concat(function($scope, $interval, $http){
  var getAccessToken, getWall;
  $scope.uid = "";
  $scope.username = "";
  $scope.fanpage = "";
  $scope.isFanpage = false;
  $scope.accessToken = "";
  $scope.loading = false;
  $scope.wall = [];
  $scope.pageId = 'NtuNewsEForum';
  $scope.running = false;
  $scope.finish = false;
  FB.init({
    appId: "1490131354539691",
    status: true,
    cookie: true,
    xfbml: true,
    oauth: true
  });
  getAccessToken = function(){
    console.log("get login status...");
    $scope.loading = true;
    return FB.getLoginStatus(function(res){
      var ref$, userID, accessToken;
      console.log("response...");
      if (res.status === "connected") {
        console.log(res);
        ref$ = {
          userID: (ref$ = res.authResponse).userID,
          accessToken: ref$.accessToken
        }, userID = ref$.userID, accessToken = ref$.accessToken;
        $scope.$apply(function(){
          $scope.uid = userID;
          $scope.accessToken = accessToken;
          return console.log($scope.uid);
        });
        $http.get("http://graph.facebook.com/" + $scope.uid + "/profile").success(function(data){
          if (data.data && data.data[0]) {
            return $scope.username = data.data[0].name;
          }
        });
      } else {
        console.log("please login");
      }
      return $scope.$apply(function(){
        return $scope.loading = false;
      });
    });
  };
  getWall = function(url){
    return $http.get(url).success(function(data){
      $scope.wall = $scope.wall.concat(data.data);
      if (data.paging && data.paging.next) {
        return setTimeout(function(){
          return getWall(data.paging.next);
        }, 100);
      } else {
        $scope.finish = true;
        return $scope.running = false;
      }
    });
  };
  $scope.setFanpage = function(it){
    return $scope.isFanpage = it;
  };
  $scope.logout = function(){};
  $scope.login = function(){
    return FB.login(function(){
      return getAccessToken();
    }, {
      scope: ""
    });
  };
  getAccessToken();
  return $scope.startGetWall = function(isMe){
    var pageId;
    if (isMe) {
      $scope.isFanpage = false;
    }
    if ($scope.isFanpage) {
      pageId = /https?:\/\/[^\/]+\/([^\/?]+)\??[^/]*/.exec($scope.fanpage);
      if (pageId) {
        pageId = pageId[1];
      }
    } else {
      pageId = 'me';
    }
    console.log(pageId);
    if (pageId) {
      $scope.pageId = pageId;
      $scope.running = true;
      return getWall("https://graph.facebook.com/" + $scope.pageId + "/feed?access_token=" + $scope.accessToken);
    }
  };
}));