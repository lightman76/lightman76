lightman76.Quiz2 = function(data, quizHelper) {
  var vm = this;

  function createUniqueBirdList() {
    var birds = {};
    data.forEach(function(state){
      birds[state.bird] = state.path;
    });
    vm.birdList = Object.keys(birds);
    vm.birdToPic = birds;
  }

  vm.answerSelected = function(evt) {
    console.log("Got answer selected click")
    $(".nextButton").removeAttr("disabled");
  };

  vm.rerenderQuestion = function() {
    console.log("Rerender question")
    $(".nextButton").attr("disabled","disabled");
    if(vm.questionIdx < vm.birdList.length) {
      $(".quiz-progress").html((vm.questionIdx+1)+" of "+vm.birdList.length);
      var curBirdName = vm.birdList[vm.questionIdx];
      console.log("  Bird="+curBirdName);
      $(".question-container").html("What is this bird: <img src='"+vm.birdToPic[curBirdName]+"' class='state-bird__need-crop'>");

      var randomBirdList = lightman76.util.shuffleArray(vm.birdList.slice());
      var options = [];

      for(var i = 0; options.length < 5 && i < randomBirdList.length; i++) {
        if(curBirdName !== randomBirdList[i]) {
          options.push(randomBirdList[i]);
        }
      }
      options.push(curBirdName);
      //Don't want the answer to always be last, so shuffle
      lightman76.util.shuffleArray(options);
      //now render radio buttons for this
      var answerChoices="";
      options.forEach(function(opt, idx){
        answerChoices+="<div class='radio'><label><input type='radio' name='answerChoice' id='answer"+idx+"' value='"+opt+"'>"+opt+"</label></div>";
      });
      $(".answer-choices-container").html(answerChoices);
      addRadioListener();
    } else {
      //TODO: render the final score
    }
  };

  function checkAnswer() {
    var radioValue = $("input[name='answerChoice']:checked").val();
    if(radioValue) {
      var curBirdName = vm.birdList[vm.questionIdx];
      if(radioValue === curBirdName) {
        vm.numCorrect++;
        vm.correctQuestions.push(curBirdName);
        console.log("Answered correctly "+radioValue)
      } else {
        vm.incorrectQuestions.push({birdName: curBirdName, answer: radioValue});
        console.log("Answered incorrectly - it's "+curBirdName +" not "+ radioValue)
      }
      return true;
    } else {
      return false;
    }
  }

  vm.showFinalScores = function() {
    window.quizCompleted = true;
    var html = "";
    html+= "<h3>"+vm.numCorrect+" out of "+vm.birdList.length+" Correct</h3>\n";
    if(vm.numCorrect != vm.birdList.length) {
      html+= "<div class='panel panel-default'>\n"
      html+= "  <div class='panel-heading'>\n"
      html+= "    <div class='panel-title'>Here's the questions you missed</div>\n";
      html+= "  </div>\n";
      html+= "  <div class='panel-body'>\n";
      html+="<div class='row review-answer-header'>"
      html+="  <div class='col-xs-12 col-sm-4 review-answer-header-col'>Bird Picture</div>"
      html+="  <div class='col-xs-12 col-sm-4 review-answer-header-col'>Correct</div>"
      html+="  <div class='col-xs-12 col-sm-4 review-answer-header-col'>You choose</div>"
      html+="</div>"
      vm.incorrectQuestions.forEach(function(info){
        html+="<div class='row review-answer-row'>"
        html+="  <div class='col-xs-12 col-sm-4'><img src='"+vm.birdToPic[info.birdName]+"'></div>"
        html+="  <div class='col-xs-12 col-sm-4'>"+info.birdName+"</div>"
        html+="  <div class='col-xs-12 col-sm-4'>"+info.answer+"</div>"
        html+="</div>"
      });
      html+= "  </div>\n";
      html+= "</div>\n";
    } else {
      html+= "<div class='panel panel-default'>\n"
      html+= "  <div class='panel-body'>\n";
      html+= "    <div class='row'><div class='col-xs-12 review-perfect'>🎉🎉🎉 Perfect Score! Congratulations! 🎉🎉🎉</div></div>\n";
      html+= "  </div>"
      html+= "</div>"
    }
    $(".results-section").html(html);
    $(".quiz-section").hide();
    $(".results-section").show().removeClass('hidden');
  };

  vm.onNextQuestion = function(evt) {
    if(evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    if(checkAnswer()) {
      vm.questionIdx++;
      if(vm.questionIdx < vm.birdList.length) {
        vm.rerenderQuestion();
      } else {
        vm.showFinalScores();
      }
    } else {
      alert("Please choose an answer first.");
    }
  };

  function addRadioListener() {
    $('input:radio').change(vm.answerSelected);
  }
  function addNextListener() {
    $('.nextButton').click(vm.onNextQuestion);
  }

  vm.initialize = function() {
    createUniqueBirdList();
    vm.birdNames = lightman76.util.shuffleArray(vm.birdList.slice());
    vm.questionIdx = 0;
    vm.correctQuestions = [];
    vm.incorrectQuestions = [];
    vm.numCorrect = 0;
    vm.startTime = new Date();
    vm.rerenderQuestion();
    addNextListener();
  };
  vm.initialize();
}