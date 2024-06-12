
 (() => {

    if(window.hasRun){
        console.log("here ?");
        return;
      }
    
    window.hasRun = true;

    let alreadyRunPageLoad = false;
    window.onload = function () {
        if(!alreadyRunPageLoad){
            pageLoad();
            alreadyRunPageLoad = true;
        }
        showUi();
    }
       
 })(); 

function pageLoad() {

    let acceptedAnswer = acceptedAnswerExist();
    if(acceptedAnswer){
        goToAcceptedAnswer(acceptedAnswer)
    } else {
        goToMostVotedAnswer();
    }
}

function goToAcceptedAnswer(element) {
    switchAnswerHighliter(element);

    element.scrollIntoView({behavior: 'smooth', block: "center"});
    // console.log("called");

}

function switchAnswerHighliter(currentElement){
    const existant = document.getElementsByClassName("stackanswer-answer");
    console.log(existant);
    if(existant.length != 0){
        existant[0].classList.remove("stackanswer-answer");
    }
    currentElement.classList.add("stackanswer-answer");

   
}

function goToMostVotedAnswer() {
    let allAnswers = document.getElementsByClassName("answer js-answer");
    var mostVotedDiv = null;
    for (let index = 0; index < allAnswers.length; index++) {
        const element = allAnswers[index];
        if(mostVotedDiv == null){
            mostVotedDiv = element;
        } else {
            const mostVotedDivScore = parseInt(mostVotedDiv.getAttribute("data-score"));
            const elementScore = parseInt(element.getAttribute("data-score"));

            if( mostVotedDivScore < 0  && elementScore < 0  &&  elementScore >= mostVotedDivScore ){
                mostVotedDiv = element;
            } else if(mostVotedDivScore < 0 && elementScore > 0){
                mostVotedDiv = element;
            } else if( mostVotedDivScore > 0  && elementScore > 0 && elementScore >= mostVotedDivScore){
                mostVotedDiv = element;
            }
        }
        
    }

    if(mostVotedDiv != null){
        switchAnswerHighliter(mostVotedDiv)
        mostVotedDiv.scrollIntoView({behavior: 'smooth', block: "center"});
    }
}
      
function acceptedAnswerExist() {
    let answerDivs = document.getElementsByClassName("answer js-answer accepted-answer js-accepted-answer")
    if(answerDivs.length != 0){
        return answerDivs[0];
    } else {
        return false;
    }
}


function showUi() {
    const logo = browser.runtime.getURL("images/logo_long.png");
    const checkLogo = browser.runtime.getURL("images/check.png");
    let checkIconClass = ''
    let activeClass = 'stackanswer-active'
    let default2CheckIconClass = 'stackanswer-hide'
    let default2ActiveClass = ''
    if(!acceptedAnswerExist()){
        checkIconClass = 'stackanswer-hide'
        activeClass = ''

         default2CheckIconClass = ''
         default2ActiveClass = 'stackanswer-active'
    } 
    console.log(logo);
    let ui = "<div class='stackanswer-container'> <div class='stackanswer-img-div'><img src='"+logo+"' class='stackanswer-logo' width = '120px'></div><p>Use this filters to browse the most relevant answers</p><div> <div id='stackanswer-action-accepted' class='"+activeClass+" stackanswer-action'><img id='stackanswer-check-icon-1' src='"+checkLogo+"' width='16px' class='"+checkIconClass+"'> <label>Jump to <strong> Accepted answer </strong></label> </div> <div id='stackanswer-action-voted' class='"+default2ActiveClass+" stackanswer-action'><img id='stackanswer-check-icon-2' class='"+default2CheckIconClass+"' src='"+checkLogo+"' width='16px' > <label >Jump to  <strong>Most voted </strong></label> </div></div>";
    
    let questionHeader = document.getElementById("question-header");
    let text = questionHeader.getElementsByTagName("h1")[0].innerText;
    console.log();
    let content = document.getElementsByClassName('js-post-body');
    var contenu = "";
    if(content.length != 0){
        contenu = content[0].getElementsByTagName("p")[0].innerText;
        contenu = contenu.substring(0, contenu.length * 0.65)
        contenu +="..."; 
    }
    let nextContent = '<blockquote><strong id="stackanswer-link">'+text+'</strong><p>'+contenu+'</p></blockquote></div>';

    document.body.innerHTML += (ui+nextContent);

    const accpetedAction =  document.getElementById("stackanswer-action-accepted");
    const votedAction =  document.getElementById("stackanswer-action-voted");

    accpetedAction.addEventListener("click", (event)=>{
        if(acceptedAnswerExist()){
            if(!accpetedAction.classList.contains("stackanswer-active")){
                accpetedAction.classList.add("stackanswer-active")
                votedAction.classList.remove("stackanswer-active")
                document.getElementById('stackanswer-check-icon-1').classList.remove("stackanswer-hide")
                document.getElementById('stackanswer-check-icon-2').classList.add("stackanswer-hide")
                goToAcceptedAnswer(acceptedAnswerExist());
            }
        } else {
            accpetedAction.classList.add("stackanswer-accepted-not-found")
            // accpetedAction.innerHTML += "  (Not found)"
        }

       
    });

    votedAction.addEventListener("click", (event)=>{
        if(!votedAction.classList.contains("stackanswer-active")){
            votedAction.classList.add("stackanswer-active")
            accpetedAction.classList.remove("stackanswer-active")
            document.getElementById('stackanswer-check-icon-2').classList.remove("stackanswer-hide")
            document.getElementById('stackanswer-check-icon-1').classList.add("stackanswer-hide")
            goToMostVotedAnswer();
        }
    });

    const question = document.getElementById("stackanswer-link");
    question.addEventListener("click", (event)=>{
        window.scrollTo(0,0)
    });
}

   

    


