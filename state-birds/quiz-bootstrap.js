if(!window.lightman76) var lightman76={};
lightman76.QuizHelper = function(jsonDataFile, imagePathPrefix) {
  var vm = this;

  vm.loadJsonDataFile = function(fileUrl) {
    return new Promise(function(resolve,reject) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status !== 200) {
            console.error("  ERROR: Got back " + xhr.status + ": ", xhr.responseText+" for url "+fileUrl);
            reject(xhr.status+": "+xhr.responseText);
            alert("Error loading quiz data: "+xhr.status+": "+xhr.responseText);
            return;
          }
          var respData = JSON.parse(xhr.responseText);
          if(imagePathPrefix) {
            respData.forEach(function(stateInfo){
              stateInfo["path"] = imagePathPrefix + stateInfo["path"];
            });
          }
          resolve(respData);
        }
      };
      xhr.open("GET", fileUrl, true);
      xhr.send();
    });
  };

  vm.initialize = function() {
  };
  vm.initialize();
}

lightman76.util = function() {

};

lightman76.util.shuffleArray = function(arr) {
  var i;
  for(i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * i);
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

window.onbeforeunload = function(evt) {
  if(!window.quizCompleted) {
    evt.preventDefault();
    evt.returnValue = '\o/';
  }
}