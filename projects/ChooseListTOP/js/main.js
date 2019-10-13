/*
 * main.js
 */
let btnStart, btnDone, txtareaList, btnOpt1, btnOpt2, btnAgain
const title_btnStart = "button-start";
const title_btnDone = "button-done";
const title_btnOpt1 = "label1";
const title_btnOpt2 = "label2";
const title_btnAgain = "button-again";
const title_txtareaItemlist = "item-list";
const title_classNone = "d-none";
let contHome, contChoose, contList, toplist, progressBar
const title_container_home = "home";
const title_container_choose = "choose";
const title_container_list = "list";
const title_top_list = "top-list";
const title_progress = "progressOptions";

const animation_in = "zoomIn"
const animation_out = "zoomOutDown"
const animation_center = "flip"

let items
let combinations
let numberCombinations
let currentOption = 0
// ------------------------------
// Visualization Functions
// ------------------------------
function animateCSS(element, animationName, callback) {
    //const node = document.querySelector(element)
    const node = element
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

// Resize Automatically Textarea
function resizeTextarea (id) {
    var a = document.getElementById(id);
    a.style.height = 'auto';
    a.style.height = (a.scrollHeight+10)+'px';
}

// Generic Function to Transitions
function transitionMode(outContainer, inContainer) {
    animateCSS(outContainer, animation_out,
        () => {
            outContainer.classList.add(title_classNone)
            inContainer.classList.remove(title_classNone)
            animateCSS(inContainer, animation_in)
        }
    )
}

// Show option to User
function showOptionUser(pair) {
    console.log(pair)
    let value = (Math.random()<0.5) ? pair : pair.reverse();
    btnOpt1.innerHTML = value[0].title;
    btnOpt2.innerHTML = value[1].title;
    btnOpt1.dataset.option = value[0].index;
    btnOpt2.dataset.option = value[1].index;

    // Update Bar
    progressBar.style.width = (100*currentOption/numberCombinations)+'%';
}

// Show items in TOP
function showItems() {
    items.forEach(element => {
        let newItem = document.createElement("li")    
        newItem.classList.add("list-group-item","d-flex","justify-content-between","align-items-center");
        //newItem.appendChild(document.createTextNode(element.title))
        newItem.innerHTML = `${element.title}<span class="badge badge-primary badge-pill">${element.score}</span>`
        toplist.appendChild(newItem)
    });
}
// ------------------------------
// Logic Functions
// ------------------------------

// Check the input items
function getItemsOfDescription() {
    let lines = txtareaList.value.split('\n');
    items = lines.filter(l => l.length>0).map(
        (value, index) => {
            return {
                "index": index,
                "title": value,
                "score": 0
            }
        })
    console.log(items)
}

// Order
function compareScore(a,b) {
    if (a.score < b.score) {
        return 1;
    }
    if (a.score > b.score) {
        return -1;
    }
    return 0;
}

// Ends the options
function determinateTOP() {
    items.sort(compareScore)
    showItems()
    transitionMode(contChoose, contList)
}

// Generate Option
function nextOption() {
    currentOption+=1
    let indexRetorned = (this.dataset)?this.dataset.option:"";
    if (indexRetorned!="") {
        items[indexRetorned].score += 1
    }
    let i = Math.floor(Math.random()*combinations.length)
    if (combinations.length==0) {
        determinateTOP()
        return
    }
    // Get and remove combination
    let battle
    [battle] = combinations.splice(i, 1)
    showOptionUser(battle)
    animateCSS(btnOpt1,animation_center)
    animateCSS(btnOpt2,animation_center)
}

// First Step
function generateOptions() {
    console.log(`Generate Options`);
    // Extract options
    getItemsOfDescription()
    if (items) {
        let numberOfItems = items.length
        if (numberOfItems>1) {
            // There are at least two objects
            // Loading Mode
            // TODO 
            // Logic Generation
            let numberOptions = numberOfItems*(numberOfItems-1)/2
            console.log(`Numero de Items: ${numberOfItems}`)
            console.log(`Numero de Opciones: ${numberOptions}`)
            
            // Create combinations
            mixCombination = items.map(function(x, index) {
                console.log(`Indice: ${index}, Param ${x}`)
                return items.slice(index+1).map(function(y) {
                    console.log(`Pair ${x}-${y}`);
                    return [x,y]
                })
            })
            
            // Organize in only one array
            const joinArrays = (listCombination, itemOfArray) => listCombination.concat(itemOfArray)
            combinations = mixCombination.reduce(joinArrays)
            numberCombinations = combinations.length

            // Change Page
            transitionMode(contHome, contChoose)

            // Load Options
            nextOption()
        } else {
            swal("Attention!", "Please list two or more options!", "error");
        }
    }
}

function startAgain() {
    transitionMode(contList,contHome)
}
// ------------------------------
// Join Buttons
// ------------------------------

// Get Elements HTML
btnStart = document.getElementById(title_btnStart)
btnDone = document.getElementById(title_btnDone)
txtareaList = document.getElementById(title_txtareaItemlist)
btnOpt1 = document.getElementById(title_btnOpt1)
btnOpt2 = document.getElementById(title_btnOpt2)
btnAgain = document.getElementById(title_btnAgain)
toplist = document.getElementById(title_top_list)
progressBar = document.getElementById(title_progress)

contHome = document.getElementById(title_container_home)
contChoose = document.getElementById(title_container_choose)
contList = document.getElementById(title_container_list)

//const generateOptionsMain = generateOptions.bind(this)
btnStart.addEventListener("click", generateOptions)
btnDone.addEventListener("click", determinateTOP)
btnOpt1.addEventListener("click", nextOption)
btnOpt2.addEventListener("click", nextOption)
btnAgain.addEventListener("click", startAgain)
