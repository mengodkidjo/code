const b = typeof chrome !== 'undefined' ? chrome : (typeof browser !== 'undefined' ? browser : null);
 (() => {

    if(window.hasRun){
        // console.log("here ?");
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
    const autoScrollEnabled = localStorage.getItem('stackanswer-autoscroll-enabled') === 'true' || undefined;
    if (autoScrollEnabled) {
        let acceptedAnswer = acceptedAnswerExist();
        if(acceptedAnswer){
            goToAcceptedAnswer(acceptedAnswer)
        } else {
            goToMostVotedAnswer();
        }
    }
}

function goToAcceptedAnswer(element) {
    switchAnswerHighliter(element);

    element.scrollIntoView({behavior: 'smooth', block: "center"});
    // console.log("called");

}

function switchAnswerHighliter(currentElement){
    const existant = document.getElementsByClassName("stackanswer-answer");
    // console.log(existant);
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
    const logo =  b.runtime.getURL("images/logo_long.png") ;
    const checkLogo = b.runtime.getURL("images/check.png");
    const acceptedAnswerExists = acceptedAnswerExist();
    const checkIconClass = acceptedAnswerExists ? '' : 'stackanswer-hide';
    const activeClass = acceptedAnswerExists ? 'stackanswer-active' : '';
    const default2CheckIconClass = acceptedAnswerExists ? 'stackanswer-hide' : '';
    const default2ActiveClass = acceptedAnswerExists ? '' : 'stackanswer-active';

    // 

    //stack answer Ui definition
    let ui = `
        <div class='stackanswer-position'>
            <div id='stackanswer-container-div' class='stackanswer-container'>  
                <div class='stackanswer-img-div'> 
                    <img src='${b.runtime.getURL("images/minus.jpg")  }' id='minus-icon' width='12px' height='12px'>
                    <img src='${logo}' class='stackanswer-logo' width = '120px'>
                </div> 
                <div id='stackanswer-content-div'>  
                    <p class='text-center'>Use this filters to browse the most relevant answers</p>
                    <div id='stackanswer-settings' class='stackanswer-settings'>
                    <label>
                            <input type='checkbox' id='stackanswer-autoscroll-checkbox' ${localStorage.getItem('stackanswer-autoscroll-enabled') === 'false' ? '' : 'checked'}>
                            Enable auto scroll to the most relevant answer
                        </label>
                    </div>
                    <div> 
                        <div id='stackanswer-action-accepted' class='${activeClass} stackanswer-action'>
                            <img id='stackanswer-check-icon-1' src='${checkLogo}' width='16px' class='${checkIconClass}'> 
                            <label>Jump to <strong> Accepted answer </strong></label> 
                        </div> 
                        <div id='stackanswer-action-voted' class='${default2ActiveClass} stackanswer-action'>
                            <img id='stackanswer-check-icon-2' class='${default2CheckIconClass}' src='${checkLogo}' width='16px' > 
                            <label >Jump to  <strong>Most voted </strong></label> 
                        </div>
                    </div>
        
        `;
    
    let questionHeader = document.getElementById("question-header");
    let text = questionHeader.getElementsByTagName("h1")[0].innerText;
    let content = document.getElementsByClassName('js-post-body');
    var contenu = "";
    if(content.length != 0){
        contenu = content[0].getElementsByTagName("p")[0].innerText;
        contenu = contenu.substring(0, contenu.length * 0.65)
        contenu +="..."; 
    }
    let nextContent = `
                    <blockquote><strong id="stackanswer-link">${text}</strong>
                        <p>${contenu}</p>
                    </blockquote> 
                </div>
            </div>
            <div id='stackanswer-about' class= 'stackanswer-container'>
                <div class='stackanswer-img-div'> 
                    <img src='${b.runtime.getURL("icons/logo-48.png")}'  width='24px' height='24px'>
                    <h2>About StackAnswer</h2>
                </div>
                <p>Developed by <strong>  <a href='https://ledocdev.com' target='_blank'>Darrell KIDJO</a></strong> - <strong>Software Engineer</strong> available for freelance or remote missions. <a href='https://ledocdev.com/#contact' target='_blank'>Contact me</a>.</p>
                <p>Discover <a  href='https://serverexplorer.ledocdev.com' target='_blank'> Server Explorer</a>, an ssh client with UI, file and docker manager, by me.</p>
                <h4><strong>Thank you for using my tools ;)</strong></h4>
            </div>
        </div>`;

    document.body.innerHTML += (ui+nextContent);

    const accpetedAction =  document.getElementById("stackanswer-action-accepted");
    const votedAction =  document.getElementById("stackanswer-action-voted");

    //Handle click event on button : Jump to accepted answer

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

    //Handle click event on button : Jump to Most Voted answer

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

    //Reduce stackanswer box
    const minusIcon = document.getElementById("minus-icon");
    minusIcon.addEventListener("click", (e) => {
        let divContainer = document.getElementById("stackanswer-container-div");
        if(divContainer.style.height != "60px"){

            divContainer.style.height = "60px";
            document.getElementById("stackanswer-content-div").style.display = 'none';
            document.getElementById("stackanswer-about").style.display = 'none';
            
        } else {
            divContainer.style.height = null;

            document.getElementById("stackanswer-content-div").style.display = 'block';
            document.getElementById("stackanswer-about").style.display = 'block';


        }
    })

      // Handle auto-scroll checkbox
      const autoScrollCheckbox = document.getElementById("stackanswer-autoscroll-checkbox");
      autoScrollCheckbox.addEventListener("change", (event) => {
          localStorage.setItem('stackanswer-autoscroll-enabled', event.target.checked);
      });

      shoCopyButton();

}

function shoCopyButton() {
    const codeBoxes = document.getElementsByClassName("s-code-block");
    for (let element of codeBoxes) {
        if (element.getElementsByClassName("stackanswer-copy-button").length === 0) {  // Pour éviter les doublons
            const copyButton = document.createElement("div");
            const copyImg = document.createElement("img")
            copyImg.src = b.runtime.getURL("images/copy.png");
            copyImg.width = 24;
            copyImg.height = 24;
            copyImg.style.opacity = 0.5
            
            copyButton.className = "stackanswer-copy-button";
            copyButton.style.position = "absolute";
            copyButton.style.top = "10px";
            copyButton.style.right = "10px";
            copyButton.style.padding = "5px";
            copyButton.style.background = "#E0E0E0";
            copyButton.style.color = "white";
            copyButton.style.border = "none";
            copyButton.style.borderRadius = "6px";
            copyButton.style.cursor = "pointer";
            copyButton.style.display = "none";
            copyImg.style.display = "none";
            copyButton.addEventListener("click", () => {
                const codeText = element.innerText;
               
                navigator.clipboard.writeText(codeText).then(() => {
                    // copyButton.innerText = "Copied!";
                    setTimeout(() => {
                        // copyButton.innerText = "Copy";
                    }, 2000);
                }).catch(err => {
                    console.error("Failed to copy text: ", err);
                });
            });
            copyButton.appendChild(copyImg)
            element.style.position = "relative";
            element.appendChild(copyButton);
            element.addEventListener('mouseover', ()=> {
                copyButton.style.display = "block";
                copyImg.style.display = "block";
            })
            element.addEventListener('mouseout', ()=> {
                copyButton.style.display = "none";
                copyImg.style.display = "none";
            })
        }
    }
}




