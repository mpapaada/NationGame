
const buttonStates = ["SUBMIT", "NEXT","RESET"]
const draggables = document.querySelectorAll('.nations');
const containers = document.querySelectorAll('.countries');
let ranks = document.getElementsByClassName("rank");
const button = document.getElementById("button");
let buttonState = ""
let highScore = 0;
let currentScore = 0;

async function getData() {
    let url = 'https://restcountries.com/v3.1/all?fields=name,population,flags,independent';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderNations() {
    ranks = document.getElementsByClassName("rank");
    let nations = await getData();
    buttonState = buttonStates[0];
    nations = getRandom(4, nations);
	let rank = popRank(nations);
    for(i = 0; i < nations.length; i++){
        let population = nations[i].population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	    let ind = ["one","two","three","four"];
        let htmlSegment = 
					`	
							<div class = "name">${nations[i].name.common}</div>
							<div class = "flag-outter"><img class = "flag" src="${nations[i].flags.png}" alt="national flag"></div>
							<div class = "rank">${rank[i]+1}</div>
							<div class = "population"> <span>  ${population}</span></div>
						`
      
        let nationsHtml = document.querySelector(`.nations.n_${ind[i]}`);
        nationsHtml.innerHTML = htmlSegment;
    }
}
  

function getRandom(num, nations){
    var rand = [];
    var randNations = [];
    for(i = 0; i < num; i++ ){
        index = Math.floor(Math.random()*nations.length)
        if(rand.includes(index)){
            i--;
        }else{
            rand.push(index);
            if(nations[rand[i]].independent){
                randNations.push(nations[rand[i]]);
            }else{
                rand.pop()

                i--;
            }
        }
    }
    return randNations
}

function popRank(nationsArr){
    let rank = [];
	let popArr = nationsArr.map( e => e.population);
	let popArrTemp = [...popArr];
	let popSorted = popArr.sort(function(a, b){return b - a});
	for(i = 0; i < popArr.length; i++){
		rank.push(popSorted.findIndex(e => e == popArrTemp[i]));
	}
    return rank
} 




draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
      if(buttonState == buttonStates[0]){
        draggable.classList.add('dragging')
      }
    })
    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
    })
})


containers.forEach(container => {
    container.addEventListener('dragover', e => {
        if(buttonState == buttonStates[0]){
            e.preventDefault()
            const afterElement = getDragAfterElement(container, e.clientX)
            const draggable = document.querySelector('.dragging')
            if (afterElement == null) {
                container.appendChild(draggable)
            } else {
                container.insertBefore(draggable, afterElement)
            }
        }
    })
})

function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.nations:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = x - box.left - box.width / 2
        if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
        } else {
        return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

function checkAnswer(){
    answer = true;
    for(i = 0; i < ranks.length; i++){
        let ind = ["one","two","three","four"];
        let nations = document.querySelector('.countries').children[i];
        if(parseInt(nations.children[2].innerText) != 1+i){
            answer = false;
            nations.classList.add("incorrect")
        }else{
            nations.classList.add("correct")
        }
    }
    return answer
}

function resetAnswer(){
    let nations = document.querySelector('.countries')
    for(i = 0; i < ranks.length; i++){
        nation = nations.children[i];
        nation.classList.remove("correct", "incorrect")
    }
    document.querySelector('#button').innerText = "Submit"

    renderNations()
}

function updateScore(passed){
    if(passed){
        currentScore += 1;
        if(currentScore > highScore){
            highScore = currentScore;
        }
    }else{
        currentScore = 0;
    }
    document.querySelector('.high-score').innerText = `High Score: ${highScore}`;
    document.querySelector('.current-score').innerText = `Current Score: ${currentScore}`;    
}

button.addEventListener('click', () => {
    if(buttonState == "SUBMIT"){
        if(checkAnswer()){
            buttonState=buttonStates[1]
            updateScore(true)
            document.querySelector('#button').innerText = "Next"
        }else{
            buttonState=buttonStates[2]
            updateScore(false)
            document.querySelector('#button').innerText = "Reset"
        }

    }else if(buttonState == "RESET"){
        resetAnswer()
        buttonState = buttonStates[0]
    }else if(buttonState == "NEXT"){
        resetAnswer()
        buttonState = buttonStates[0]
    }
})


renderNations();
