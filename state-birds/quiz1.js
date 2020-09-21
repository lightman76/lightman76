lightman76.Quiz1 = function(data, quizHelper) {
  var vm = this;

  function createUniqueBirdList() {
    var birds = {};
    data.forEach(function(state){
      birds[state.bird] = true;
    });
    vm.birdList = Object.keys(birds);
  }

  vm.answerSelected = function(evt) {
    console.log("Got answer selected click")
    $(".nextButton").removeAttr("disabled");
  };

  vm.rerenderQuestion = function() {
    console.log("Rerender question")
    $(".nextButton").attr("disabled","disabled");
    if(vm.questionIdx < vm.stateList.length) {
      var curState = vm.stateList[vm.questionIdx];
      console.log("  State="+curState.state);
      $(".question-container").html("What is the state bird of "+curState.state);

      var randomBirdList = lightman76.util.shuffleArray(vm.birdList.slice());
      var options = [];

      for(var i = 0; options.length < 5 && i < randomBirdList.length; i++) {
        if(curState.bird !== randomBirdList[i]) {
          options.push(randomBirdList[i]);
        }
      }
      options.push(curState.bird);
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
      var curState = vm.stateList[vm.questionIdx];
      if(radioValue === curState.bird) {
        vm.numCorrect++;
        vm.correctQuestions.push(curState);
        console.log("Answered correctly "+radioValue)
      } else {
        vm.incorrectQuestions.push({stateInfo: curState, answer: radioValue});
        console.log("Answered incorrectly "+curState.bird +" not "+ radioValue)
      }
      return true;
    } else {
      return false;
    }
  }

  vm.showFinalScores = function() {
    var html = "";
    html+= "<h3>"+vm.numCorrect+" out of "+vm.stateList.length+" Correct</h3>\n";
    if(vm.numCorrect != vm.stateList.length) {
      html+= "<div class='panel panel-default'>\n"
      html+= "  <div class='panel-heading'>\n"
      html+= "    <div class='panel-title'>Here's the questions you missed</div>\n";
      html+= "  </div>\n";
      html+= "  <div class='panel-body'>\n";
      html+="<div class='row review-answer-header'>"
      html+="  <div class='col-xs-12 col-sm-4 review-answer-header-col'>State</div>"
      html+="  <div class='col-xs-12 col-sm-4 review-answer-header-col'>Correct</div>"
      html+="  <div class='col-xs-12 col-sm-4 review-answer-header-col'>You choose</div>"
      html+="</div>"
      vm.incorrectQuestions.forEach(function(info){
        html+="<div class='row review-answer-row'>"
        html+="  <div class='col-xs-12 col-sm-4'>"+info.stateInfo.state+"</div>"
        html+="  <div class='col-xs-12 col-sm-4'>"+info.stateInfo.bird+"</div>"
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
      if(vm.questionIdx < vm.stateList.length) {
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
    vm.stateList = lightman76.util.shuffleArray(data.slice());
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