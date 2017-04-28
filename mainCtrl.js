var app = angular.module('app', []);

app.controller('main', function($scope, $http, helper) {
  $scope.peopleList;
  $scope.userProfile;
  $scope.likesAndDislikes;
  $scope.heartStyles = [];
  $scope.isLoggedIn = true;
  $scope.loggedInUser = 'Peter Hoang';



  $scope.getList = function() {
    helper.grabPeopleList()
      .then(function(res) {
        console.log(res);
        $scope.peopleList = res.data;
      })
      .catch(function(err) {
        console.log(err);
      })
  };

  $scope.displayUser = function(user) {
    $scope.heartStyles = [];
    var list = $scope.peopleList.People;
    var target = list.filter(function(person) {
      return person.name === user;
    })

    $scope.userProfile = target;
    $scope.createHearts();
    $scope.likesAndDislikes = helper.mergeArrays($scope.userProfile);
  };

  $scope.createHearts = function() {
    var filledPath = "M16.5,3c-1.74,0-3.41,0.81-4.5,2.08C10.91,3.81,9.24,3,7.5,3C4.42,3,2,5.41,2,8.5c0,2.881,1.99,5.367,5.225,8.463c0.119,0.15,0.225,0.308,0.365,0.447c0.245,0.245,0.512,0.457,0.793,0.641c0.682,0.631,1.402,1.286,2.167,1.979L12,21.35l1.45-1.319C18.6,15.359,22,12.27,22,8.5C22,5.41,19.58,3,16.5,3z";
    var noneFilledPath = "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z";
    var maxRating = 5;
    for(var i = 1; i <= 5; i++) {
      if($scope.userProfile[0].rating >= i) {
        $scope.heartStyles.push(filledPath);
      }else{
        $scope.heartStyles.push(noneFilledPath);
      }
    }
  }

})
.controller('searchCtrl', function($scope) {
  $scope.searchResult;

  $scope.changeInput = function() {
    var currentSearchTerm = $scope.searchQuery;
    var data = $scope.peopleList.People;
    /* validation */
    var userNameRE = /^[a-zA-Z\-]+$/;
    var isValidName = currentSearchTerm.match(userNameRE);

    if(isValidName) {
      $scope.searchResult = data.filter(function(person) {
        return person.name.toLowerCase().indexOf(currentSearchTerm) > -1;
      })

    }else{
      /* error */
      return $scope.searchResult = [];
    }
  };

  $scope.handleSearch = function(userName) {
    $scope.displayUser(userName);
    $scope.searchResult = [];
    $scope.searchQuery = '';
  };

  $scope.clearSearch = function() {
    $scope.searchResult = [];
    $scope.searchQuery = '';
  };

})
.controller('dropDownMenuCtrl', function($scope) {
  console.log('dropDownMenu')
  $scope.isOpen = false;
  $scope._arrow = 'downArrow';

  $scope.handleArrows = function() {
    return $scope.isOpen ? $scope._arrow = 'upArrow' : $scope._arrow = 'downArrow';
  };

  $scope.handleDropDownMenu = function() {
    $scope.isOpen = !$scope.isOpen;
    $scope.handleArrows();
  };

  $scope.handleDropDownClose = function() {
    $scope.isOpen = false;
    $scope.handleArrows();
  };

})

.controller('messageCtrl', function($scope, helper, $timeout) {
  $scope.displayMessageInput = false;
  $scope.messageInput = '';
  $scope._success = '';
  $scope._error = '';

  $scope.changeInput = function(mess) {
    return $scope.messageInput = mess;
  };

  $scope.handleSendMessageInput = function() {
    /* First click === reveal textarea box */
    if(!$scope.displayMessageInput) {
      return $scope.displayMessageInput = !$scope.displayMessageInput;
    }
    /* Second click === Submit the message */
    else{
      var _scriptTagRE = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
      var isScriptTagStr = $scope.messageInput.match(_scriptTagRE);

      var handleSuccessOrError = function() {
        $scope._success = '';
        $scope._error = '';
      }

      if($scope.messageInput !== '' && !isScriptTagStr) {
        /* send the message to the server */
        console.log($scope.messageInput, '  << :: post request value');
        // helper.sendMessageToServer($scope.messageInput)
        //   .then(function(res) {
        //       /* post request success */
        //   })
        //   .catch(function(err) {
        //     /* Do something with post request error */
        //   })
        $scope._success = 'Message has been Saved';
        $scope.displayMessageInput = !$scope.displayMessageInput;
        $scope.messageInput = '';
        return $timeout(handleSuccessOrError, 2000);

      }else{
        /* error saving the message */
        if(isScriptTagStr) {
          $scope._error = 'What are you injecting?';
        }
        else if ($scope.messageInput === '') {
          $scope._error = 'Please add some contents';
        }
        $scope.messageInput = '';
        $scope.displayMessageInput = !$scope.displayMessageInput;
        return $timeout(handleSuccessOrError, 2000);
      }

    }
  };



  $scope.handleCancelInput = function() {
    $scope.messageInput = '';
    return $scope.displayMessageInput = !$scope.displayMessageInput;
  };

})
// .directive('customSearch', function() {
//     return {
//         scope: {
//             ngModel: '='
//         },
//         require: ['?ngModel'],
//         restrict: 'E',
//         replace: true,
//         template: `
//                     <div>
//                       <input type="search"
//                              placeholder="Search"
//                              ng-model="ngModel.searchQuery"
//
//                        >
//                     </div>
//                     `,
//         //
//         // link: (scope, element, attrs)=>{
//         //
//         // }
//     };
// })
.factory('helper', function($http) {
  return {
    grabPeopleList: function() {
      return $http.get('people.json');
    },
    mergeArrays: function(_profile) {

      var likes = _profile[0].Likes;
      var disLikes = _profile[0].Dislikes;


      var _assign = function(_idx, resultArr) {
        var idx = _idx || 0;
        var resultArr = resultArr || [];
        var tableItem = {};

        if(likes[idx] === undefined && disLikes[idx] === undefined) {
          return resultArr;
        }

        var fav = likes[idx] || "";
        var nonFav = disLikes[idx] || "";
        tableItem['likes'] = fav;
        tableItem['dislikes'] = nonFav;

        resultArr.push(tableItem);
        idx++;
        return _assign(idx, resultArr);
      };
      return _assign();
    },
    sendMessageToServer: function(message) {
      return $http.post('api/mock/post/request' , message);
    }
  }
})
