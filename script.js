// Variaveis utilizadas na Tela 2
let questionsAnswered = []; let correctAnswers = [];
let numberOfQuestionsInQuizz; let selectedQuizz; let resultsLevel;

// Inicio do programa
// getQuizzes();

/* Função utilizada para pegar todos os quizzes da API */
function getQuizzes() {
    toggleScreen1(); toggleLoader();
    axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
        .then((response) => {
            renderAllQuizzes(response);
            toggleLoader(); toggleScreen1();
        })
        .catch((error) => {
            console.log(error);
        })
}

// Função adiciona todos os quizzes ao site + numberID quando clicado //

function renderAllQuizzes(response) {
    const allQuizzescontainer = document.querySelector(".allQuizzesBox");
    allQuizzescontainer.innerHTML = '';

    for(let i in response.data) {
        const qbox = document.createElement("div");

        qbox.setAttribute('id', `${response.data[i].id}`);
        qbox.classList.add("qbox");

        qbox.innerHTML += `
        <img src= ${response.data[i].image}>
        <p>${response.data[i].title}</p>
        `;
        
        allQuizzescontainer.appendChild(qbox);
    }
    addLogicSelectionToQuizzes();
}

function addLogicSelectionToQuizzes() {
    document.querySelectorAll('.qbox').forEach((qbox) => {
        qbox.addEventListener('click', () => {
            toggleScreen1();
            getSelectedQuizz((qbox.id));
        });
    });    
}

/* Função utilizada para pegar um quizz específico da API */
function getSelectedQuizz(quizzId) {
    
    toggleLoader();

    axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzId}`)
        .then((response) => {
            assembleSelectedQuizzPage(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
}  

/* Função para exibir e esconder a div do Loader */
function toggleLoader() {
    document.querySelector('.screenLoader').classList.toggle('hideElement');
}

function toggleScreen1() {
    document.querySelector('.myQuizz').classList.toggle('hideElement');
    document.querySelector('.allQuizzes').classList.toggle('hideElement');
}

/* INICIO JAVASCRIPT DESENVOLVIDO PARA A TELA 2 - ÉRICO */

/* Função para exibir e esconder a div da Tela 2 */
function toggleScreen2() {
    document.querySelector('.screen2').classList.toggle('hideElement');
}

/*Adiciona funcionabilidade ao botão de restart quizz */
document.querySelector('.restartQuizz').addEventListener('click', () => {
    lightCleanQuizz();
    restartQuizz();
});

/*Adiciona funcionabilidade ao botão de return home */
document.querySelector('.returnHome').addEventListener('click', () => {
    fullCleanQuizz();
    toggleScreen1();
});

// função utilizada previamente ao reinicar do quizz, o quizzHeader nao é limpo
function lightCleanQuizz() {
    const quizzQuestions = document.querySelector('.quizzQuestions');
    const quizzResults = document.querySelector('.quizzResults');

    toggleScreen2(); toggleLoader();
    
    quizzQuestions.innerHTML = ''; quizzResults.innerHTML = '';  
    quizzResults.classList.add('hideElement');
}

// função utilizada quando queremos retornar para home, também limpa o quizzHeader
function fullCleanQuizz() {
    cleanScreen2Variables();
    lightCleanQuizz();
    cleanQuizzHeader();
    setTimeout(toggleLoader, 1000);
}

/* função de restart do quizz, limpa as variáveis usadas na 
   tela 2 e reconstroi todas as perguntas do quizz*/
function restartQuizz() {
    cleanScreen2Variables();
    setTimeout(() => {
        changeQuizzQuestions();
    }, 1000);
}

function cleanScreen2Variables() {
    // Limpa as variaveis utilizadas na ultima tentativa do quizz
    questionsAnswered = []; correctAnswers = [];
    numberOfQuestionsInQuizz = 0; resultsLevel = 0;
}

function cleanQuizzHeader() {
    const quizzHeader = document.querySelector('.quizzHeader');

    quizzHeader.querySelector('img').src = '#';
    quizzHeader.querySelector('h1').innerHTML = '';
}

function forgetSelectedQuizz() {
    cleanScreen2Variables();
    selectedQuizz = undefined;
}

/* Função utilizada para montar o quizz específico pego da API */
function assembleSelectedQuizzPage(quizz) {

    selectedQuizz = quizz;

    changeQuizzHeader(); // Monta o cabeçalho do quizz
    changeQuizzQuestions(); // Monta todas as perguntas do quizz
}

function changeQuizzHeader() {
    const quizzHeader = document.querySelector('.quizzHeader');

    quizzHeader.querySelector('img').src = selectedQuizz.image;
    quizzHeader.querySelector('h1').innerHTML = selectedQuizz.title;
}

function changeQuizzQuestions() {

    numberOfQuestionsInQuizz = selectedQuizz.questions.length;

    const quizzQuestions = document.querySelector('.quizzQuestions');

    for(let question in selectedQuizz.questions) {   

        let quizzAnswers = selectedQuizz.questions[question].answers;

        sortArray(quizzAnswers);
        
        quizzQuestions.innerHTML += `
            <section class="quizzQuestion">
                <div class="quizzQuestionHeader">
                    <p>
                        ${selectedQuizz.questions[question].title}
                    </p>
                </div>
                <div class="quizzOptions">
                    ${constructQuizzAnswers(quizzAnswers)}
                </div>
            </section>        
                `;
    }

    setTimeout(() => {
        toggleLoader(); toggleScreen2();
    }, 500);

    buildRightAnswersArray();
    addSelectionLogicToQuestions();
    changeQuestionsHeadersColors();
}

/* Embaralha o array colocado como argumento */
function sortArray(arrayToSort) {
    
    let tempArray = arrayToSort.slice()
    const originalIndexes = [];

    /*Cria um array de índices*/
    for(let i in arrayToSort) {
        originalIndexes.push(i)
    }
    
    /*Cria um array de índices embaralhados a partir do array anterior */
    const sortedIndexes = originalIndexes.sort((a,b) => {
        return Math.random() - 0.5
    })

    /*Modifica o array original embaralhando-o*/
    for(let i in arrayToSort) {
        arrayToSort[i] = tempArray[sortedIndexes[i]]
    }    
}

function constructQuizzAnswers(quizzAnswers) {

    let quizzQuestionOptionsHTML = '';

    for(let i = 0; i < quizzAnswers.length; i++) {

        if(quizzAnswers[i].isCorrectAnswer) {
            quizzQuestionOptionsHTML += `<div class="quizzQuestionOption isCorrectAnswer">
                                                <figure>
                                                    <img src="${quizzAnswers[i].image}">
                                                    <div class="quizzQuestionOptionBackground hideElement"></div>
                                                </figure>
                                                <p>${quizzAnswers[i].text}</p>
                                        </div>`;    
        } else {
            quizzQuestionOptionsHTML += `<div class="quizzQuestionOption">
                                                <figure>
                                                    <img src="${quizzAnswers[i].image}">
                                                    <div class="quizzQuestionOptionBackground hideElement"></div>
                                                </figure>
                                                <p>${quizzAnswers[i].text}</p>
                                        </div>`;
        }
    }

    return quizzQuestionOptionsHTML;
}

function buildRightAnswersArray() {
    document.querySelectorAll('.quizzQuestionOption').forEach((option) => {
        if(option.classList.contains('isCorrectAnswer')) {
            correctAnswers.push(option);
        }
    })
}

/* Função utilizada para aplicar a lógica de seleção a todas as perguntas do quizz */
function addSelectionLogicToQuestions() {

    // Percorre todos os elementos da página com a classe de opção de resposta
    document.querySelectorAll('.quizzQuestionOption').forEach((question) => {
        // Adiciona um event listener em todas as opçoes de resposta
        question.addEventListener('click', () => {
            const quizzAnswersDiv = question.parentNode;
            /* Verifica se a pergunta da resposta selecionada já foi respondida, neste 
            caso é dado um return de forma a não permitir alterações na resposta */
            if(questionsAnswered.includes(quizzAnswersDiv)) {
                return;
            }
            // array contendo todas as divs das opções de resposta da pergunta selecionada
            const listOfQuestions = Array.from(quizzAnswersDiv.querySelectorAll('.quizzQuestionOption'));
            // For usado para percorre item a item da lista
            for(let questionIndex in listOfQuestions) {
                // Seleciona a div de fundo transparente do elemento atual
                const transpBack = listOfQuestions[questionIndex].childNodes[1].querySelector('.quizzQuestionOptionBackground');
                // Lógica de seleção da opção
                transpBack.classList.add('hideElement');
                if(listOfQuestions[questionIndex] !== question) {
                    transpBack.classList.toggle('hideElement');
                }
            }
            // Adiciona a pergunta ao array de perguntas respondidas
            questionsAnswered.push(quizzAnswersDiv);

            changeAnswersTextColor(quizzAnswersDiv);

            if(checkGameOver()) {
                changeQuizzResults(); // Monta os resultados do quizz
            } else {
                scrollToNextQuestion(quizzAnswersDiv);
            }
        })
    });    
}

function changeQuizzResults() {

    const quizzResults = document.querySelector('.quizzResults');
    const quizzResultsHTML = []; 
    const levelsMinValue = [];
    const userScore = getUserQuizzScore();

    /*Cria todas as variações de div de resultado possíveis */
    selectedQuizz.levels.forEach((level, index) => {

        quizzResultsHTML[index] = `
            <div class="quizzResultsHeader">
                <p>${userScore}% de acerto: ${level.title}</p>
            </div>
            <div class="quizzResultsMain">
                <img src="${level.image}">
                <p>${level.text}</p>
            </div>
        `;

        // Cria um array contendo as porcentagens minimas de acerto
        levelsMinValue.push(level.minValue);
    });

    /* Verifica qual a porcentagem minima dos níveis o usuario 
       conseguiu acertar, isso será utilizado na montagem da div 
       de resultados, alterando a imagem e os textos*/
    for(let i = levelsMinValue.length-1; i >= 0; i--) {
        if(userScore >= levelsMinValue[i]) {
            resultsLevel = levelsMinValue[i];
            break;
        }
    }

    // Adiciona o template correto de div de resultado dependendo do número de acertos do usuario
    quizzResults.innerHTML = quizzResultsHTML[levelsMinValue.indexOf(resultsLevel)];
    quizzResults.classList.remove('hideElement');

    setTimeout(() => {
        quizzResults.scrollIntoView({behavior: "smooth", block: "center"});
    },1000);
}

// Cálcula a quantidade de acertos do usario, retorna este valor em porcentagem
function getUserQuizzScore() {

    let numberOfHits = 0

    document.querySelectorAll('.quizzQuestionOption').forEach(option => {
        if(option.classList.contains('isCorrectAnswer')) {

            const optionSelectedIsCorrect = option.querySelector('p').style.color === 'rgb(0, 156, 34)' &&
                                            option.querySelector('.quizzQuestionOptionBackground').classList.contains('hideElement')

            if(optionSelectedIsCorrect) {
                numberOfHits++;
            }
        }
    })

    return ((numberOfHits/(correctAnswers.length))*100).toFixed(0)
}

function changeQuestionsHeadersColors() {
    const colors = ['#434CA0', '#A0438D', "#2D702E"];
    
    sortArray(colors);

    let colorCounter = 0;
    const questionsHeaders =  Array.from(document.querySelectorAll('.quizzQuestionHeader'));
    
    function resetColorCounter() {
        if(colorCounter === colors.length) {
            colorCounter = 0;
        }
    }

    questionsHeaders.forEach((header) => {
        header.style.backgroundColor = colors[colorCounter];
        colorCounter++;
        resetColorCounter();
    })
}

function changeAnswersTextColor(questionDiv) {
    
    const answersArray = Array.from(questionDiv.querySelectorAll('.quizzQuestionOption'));

    answersArray.forEach((answer) => {
        
        if(correctAnswers.includes(answer)) {
            changeAnswerTextToGreen(answer);
        } else {
            changeAnswerTextToRed(answer);
        }
    });
}

function changeAnswerTextToGreen(answer) {
    answer.querySelector('p').style.color = '#009C22';
}

function changeAnswerTextToRed(answer) {
    answer.querySelector('p').style.color = '#FF4B4B';
}

function checkGameOver() {
    if(questionsAnswered.length === numberOfQuestionsInQuizz) {
        return true;
    }
    return false;
}

function scrollToNextQuestion(quizzAnswersDiv) {

    let nextQuestionToScroll;
    let pointerToScroll = false;

    const currentQuestionDiv = quizzAnswersDiv.parentNode

    const quizzQuestions = document.querySelectorAll('.quizzQuestion');

    for(let question in quizzQuestions) {
        if(pointerToScroll) {
            nextQuestionToScroll = quizzQuestions[question];
            break;
        }
        if(currentQuestionDiv == quizzQuestions[question]) {
            pointerToScroll = true;
        }
    }

    setTimeout(() => {
        nextQuestionToScroll.scrollIntoView({behavior: "smooth", block: "center"});
    },1000);
}
/* FIM JAVASCRIPT DESENVOLVIDO PARA A TELA 2 - ÉRICO */

/* JAVASCRIPT - CADASTRO DE QUIZZ - GPS*/
let quizzTitle = "";
let quizzImage = "";
let quizzNumberQuestions = 0;
let quizzNumberLevels = 0;
const containerInformations = document.querySelector('.quizzInformation');
const containerQuestions = document.querySelector('.quizzQuestionsForm');
const containerLevels = document.querySelector('.quizzLevels');
const containerQuizzSucces = document.querySelector('.quizzSuccess');
let completeQuizz = {title:"",image:"",questions:[],levels:[]};
let userQuizz = [];


function saveInformations(){
    quizzTitle = document.querySelector(".quizzTitle").value;
    quizzNumberQuestions = document.querySelector(".quizzNumberQuestions").value;
    quizzNumberLevels = document.querySelector(".quizzNumberLevels").value;
    quizzImage = document.querySelector(".quizzImage").value;
    if(quizzTitle.length<20 || quizzTitle.length>65 || !validateUrl(quizzImage,null,null,null) || quizzNumberQuestions<3 || quizzNumberLevels<2){
        alert("Informações erradas")
    }
    else{
        completeQuizz.title = quizzTitle;
        completeQuizz.image = quizzImage;
        containerInformations.classList.add("hidden");
        insertQuestionFields();
    }
    
}

function insertQuestionFields(){
    containerQuestions.classList.remove("hidden");
    for(let i=1; i<=quizzNumberQuestions; i++){
        containerQuestions.innerHTML += 
        `<div class="hidden qf forms question${i}">
        <form action="formInformation">
            <h1 class="subtitleForm">Pergunta ${i}</h1>
            <input type="text" class="textQuestion${i}" placeholder="Texto da pergunta">
            <input type="text" class="backgroundQuestion${i}" placeholder="Cor de fundo da pergunta">
            <h1 class="subtitleForm">Resposta Correta</h1>
            <input type="text" class="correctAnswerQuestion${i}" placeholder="Resposta correta">
            <input type="url" class="imageCorrectAnswerQuestion${i}" placeholder="URL da imagem">
            <h1 class="subtitleForm">Respostas incorretas</h1>
            <input type="text" class="incorrectAnswerQuestion1${i}"placeholder="Resposta incorreta 1">
            <input type="url" class="imageIncorrectAnswerQuestion1${i}" placeholder="URL da imagem 1">
            <br>                
            <input type="text" class="incorrectAnswerQuestion2${i}" placeholder="Resposta incorreta 2">
            <input type="url" class="imageIncorrectAnswerQuestion2${i}" placeholder="URL da imagem 2">
            <br>                
            <input type="text" class="incorrectAnswerQuestion3${i}" placeholder="Resposta incorreta 3">
            <input type="url" class="imageIncorrectAnswerQuestion3${i}" placeholder="URL da imagem 3">
        </form>
        </div>
        <div class="dq question ${i}">
            <h1 class="subtitleForm">Pergunta ${i}</h1>
            <ion-icon name="create-outline" onclick="openQuestionField(this)"></ion-icon>
        </div>`
    }
    containerQuestions.innerHTML+= `
    <button class="buttonForm" onclick="saveQuestions()">Prosseguir pra criar níveis</button>
    `
}
function openQuestionField(question){
    let classes = [];
    const parent = question.parentNode;
    classes = parent.classList;
    let questionFields = document.querySelectorAll(".qf");
    let divsFields = document.querySelectorAll(".dq")
    for(let i=0;i<questionFields.length;i++){
        questionFields[i].classList.add("hidden");
    }
    for(let i=0;i<divsFields.length;i++){
        divsFields[i].classList.remove("hidden");
    }
    let questionForm = document.querySelector(`.question${classes[2]}`);
    parent.classList.add("hidden");
    questionForm.classList.remove("hidden");
}

function saveQuestions(){
    let cont=0;
    for(let i=1; i<=quizzNumberQuestions; i++){
        let question= {title:"", color:"", answers:[ans1={text:"",image:"",isCorrectAnswer:true},ans2={text:"",image:"",isCorrectAnswer:false},
        ans3={text:"",image:"",isCorrectAnswer:false},ans4={text:"",image:"",isCorrectAnswer:false}]}
        question.title= document.querySelector(`.textQuestion${i}`).value;
        question.color= document.querySelector(`.backgroundQuestion${i}`).value;
        ans1.text= document.querySelector(`.correctAnswerQuestion${i}`).value;
        ans2.text= document.querySelector(`.incorrectAnswerQuestion1${i}`).value;
        ans3.text= document.querySelector(`.incorrectAnswerQuestion2${i}`).value;
        ans4.text= document.querySelector(`.incorrectAnswerQuestion3${i}`).value;
        ans1.image= document.querySelector(`.imageCorrectAnswerQuestion${i}`).value;
        ans2.image= document.querySelector(`.imageIncorrectAnswerQuestion1${i}`).value;
        ans3.image= document.querySelector(`.imageIncorrectAnswerQuestion2${i}`).value;
        ans4.image= document.querySelector(`.imageIncorrectAnswerQuestion3${i}`).value;
        
        const url1 = validateUrl(ans1.image);
        const url2 = validateUrl(ans2.image);
        const url3 = validateUrl(ans3.image);
        const url4 = validateUrl(ans4.image);

        if( !url1 || (!url2 && !url3 && !url4) || (question.title).length<20 || (ans1.text).length<20 || (!validateColor(question.color)) ||
        (ans2.text=="" && ans3.text=="" && ans4.text=="")){
            alert("algo errado")
            cont--;
            return;
        }
        else{
            if(ans2.text=="" || !url2) question.answers[1]=null
            if(ans3.text=="" || !url3) question.answers[2]=null
            if(ans4.text=="" || !url4) question.answers[3]=null
        }

        let index = question.answers.indexOf(null);
        while(index>=0){
            question.answers.splice(index,1);
            index = question.answers.indexOf(null);
        }
        completeQuizz.questions.push(question);
        cont++;
    }


   
    if(cont==quizzNumberQuestions){
        containerQuestions.classList.add("hidden");
        insertLevelsFields();
    }
    else
        alert("falhou");
}


function insertLevelsFields(){
    containerLevels.classList.remove("hidden");
    for(let i=1; i<=quizzNumberLevels; i++){
        containerLevels.innerHTML += 
        `<div class="hidden forms ql level${i}">
        <form action="formInformation">
            <h1 class="subtitleForm">Nível ${i}</h1>
            <input type="text" class="titleLevel${i}" placeholder="Título do nível">
            <input type="number" class="minHitsLevel${i}" placeholder="% de acerto mínima">
            <input type="url" class="imageLevel${i}" placeholder="URL da imagem do nível">
            <input type="text" class="descriptionLevel${i}" placeholder="Descrição do nível">
        </form>
    </div>
        <div class="dl level ${i}">
        <h1 class="subtitleForm">Nível ${i}</h1>
        <ion-icon name="create-outline" onclick="openLevelField(this)"></ion-icon>
    </div>`
    }
    containerLevels.innerHTML+= `
    <button class="buttonForm" onclick="saveLevels()">Finalizar Quizz</button>`
}

function openLevelField(level){
    let classes = [];
    const parent = level.parentNode;
    classes = parent.classList;
    let levelFields = document.querySelectorAll(".ql");
    let divsLevelFields = document.querySelectorAll(".dl")
    for(let i=0;i<levelFields.length;i++){
        levelFields[i].classList.add("hidden");
    }
    for(let i=0;i<divsLevelFields.length;i++){
        divsLevelFields[i].classList.remove("hidden");
    }
    let levelForm = document.querySelector(`.level${classes[2]}`);
    parent.classList.add("hidden");
    levelForm.classList.remove("hidden");
}


function saveLevels(){
    const arrayLevels=[];
    for(let i=1; i<=quizzNumberLevels; i++){
    let level= {title:"", image:"", text:"", minValue:""}
    level.title= document.querySelector(`.titleLevel${i}`).value;
    level.image= document.querySelector(`.imageLevel${i}`).value;
    level.text= document.querySelector(`.descriptionLevel${i}`).value;
    level.minValue= document.querySelector(`.minHitsLevel${i}`).value;
  
    const url = validateUrl(level.image);
    
    if( !url || (level.title).length<10 || (level.text).length<30 || level.minValue<0 || level.minValue>100){
        alert("errado");
        return;
    }
    else{
        arrayLevels.push(level);
    }
}
let minHit0 = 0;
for(let i=0; i<arrayLevels.length;i++){
    if(arrayLevels[i].minValue==0) minHit0++;
}
if(minHit0>0){
    for(let i=0; i<arrayLevels.length;i++)
        completeQuizz.levels.push(arrayLevels[i]);
}else{
    alert("min hit errado");
    return;
}
sendQuizz();
}

function sendQuizz(){
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes',completeQuizz);
    promise.then(saveId,promise);
}

function saveId(promise){
    let idSuccess = promise.data.id;
    let imageSuccess = promise.data.image;
    let titleSuccess = promise.data.title;
    userQuizz.push(idSuccess);
    const userQuizzJSON = JSON.stringify(userQuizz);
    localStorage.setItem("ids", userQuizzJSON);
    successQuizz(imageSuccess,titleSuccess);
}

function successQuizz(image,title){
    containerLevels.classList.add("hidden");
    containerQuizzSucces.classList.remove("hidden");
    containerQuizzSucces.innerHTML+=`
    <div class="finalQuizz">
        <img class="imgfinal" src="${image}">
        <div class="titlefinal">${title}</div>
    </div>
    <button class="buttonForm buttonFinal" onclick="accessQuizz()">Acessar Quizz</button>
    <h2 class="backHome" onclick="home()">Voltar pra home</h2>
    `
}

function accessQuizz(){

}

function home(){

}


function validateColor(code){
    const RegExp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
    if(RegExp.test(code)==true)
        return true;
    else
        return false;
}

function validateUrl(str){
    try{
        new URL (str);
        return true;
    }catch(err){
        return false;
    }
}