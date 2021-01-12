const numberDaysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const figures = ['Point', 'Line', 'Triangle', 'Square']

const localStorage = window.localStorage;

function getIndex(dateParam) {
    return dateParam.getFullYear() + "/" + (dateParam.getMonth() + 1) + "/" + dateParam.getDate();
}

function isLeapYear(year) {
    if (year%4!=0) {
        return false
    } else if(year%100!=0) {
        return true
    } else if(year%300!=0) {
        return false
    } else {
        return true
    }
}

const sumOfDayOfMonth = (acc, current) => acc + current;

function getSofiniano(dateParam) {
    const year = dateParam.getFullYear()
    const month = dateParam.getMonth()
    const day = dateParam.getDate()
    const dactilOfYear = month==0?day:numberDaysOfMonth.slice(0, month).reduce(sumOfDayOfMonth)+day

    if(dactilOfYear==182) {
        return `${year} Soul Dactil`
    } else {
        const figureOfYear = Math.floor(dactilOfYear/91)
        const dactilOfFigure = dactilOfYear%91
        if (dactilOfFigure==0) {
            return `${year} ${figures[figureOfYear-1]} Dactil Solar`
        } else {
            return `${year} ${figures[figureOfYear]} ${dactilOfFigure} Dactil`
        }
    }
}

let database = localStorage.getItem('notebook');
let currentPage = new Date();
let indexCurrentPage = getIndex(currentPage);

// -------------------------------------------------------------------
// Data Logic
// -------------------------------------------------------------------
function addItem(textItem) {
    let itemsPage = JSON.parse(localStorage.getItem(getIndex(currentPage)))
    if (!itemsPage) {
        itemsPage = new Array();
        itemsPage.push(textItem);
    } else {
        itemsPage.push(textItem);
    }
    
    localStorage.setItem(getIndex(currentPage), JSON.stringify(itemsPage))
}

function removeItem(indexRemove) {
    let itemsPage = JSON.parse(localStorage.getItem(getIndex(currentPage)))
    itemsPage.splice(indexRemove, 1)
    localStorage.setItem(getIndex(currentPage), JSON.stringify(itemsPage))
}

// -------------------------------------------------------------------
// App Logic
// -------------------------------------------------------------------
const leftBtn = document.getElementById('left-btn')
const rightBtn = document.getElementById('right-btn')

leftBtn.onclick = () => {
    currentPage.setDate(currentPage.getDate() - 1)
    updatePage()
}

rightBtn.onclick = () => {
    console.log(currentPage)
    currentPage.setDate(currentPage.getDate() + 1)
    console.log(currentPage)
    updatePage()
}


// Create a new list item when clicking on the "Add" button
function newElement() {
    var inputValue = document.getElementById("newTask").value;
    if (inputValue === '') {
        alert("You must write something!");
    } else {
        addItem(inputValue)
    }
    document.getElementById("newTask").value = "";
    updatePage()
}

function removeElement() {
    const indexRemove = this.parentElement.getAttribute('data-item');
    removeItem(indexRemove);
    updatePage();
}

// -------------------------------------------------------------------
// UI Logic
// -------------------------------------------------------------------
const IDTitlePageUI = 'page_date';
const titlePageUI = document.getElementById(IDTitlePageUI);


// Date Picker
const dateRange = $('#datepicker');
dateRange.datepicker({
    uiLibrary: 'bootstrap',
    format: 'dd/mm/yyyy',
    todayHighlight: true
})

// Update Page
function updatePage() {
    titlePageUI.innerHTML = getSofiniano(currentPage);
    dateRange.datepicker('update', currentPage)

    const itemsPage = JSON.parse(localStorage.getItem(getIndex(currentPage)))
    console.log(itemsPage)
    let nodeList = document.getElementById('listTODO')
    while(nodeList.firstChild){
        nodeList.removeChild( nodeList.firstChild );
    }

    if(itemsPage && itemsPage.length>0) {
        for (let index = 0; index < itemsPage.length; index++) {
            const element = itemsPage[index];
            var li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center"
            var inputValue = element
            var t = document.createTextNode(inputValue);
            li.appendChild(t);
    
            var span = document.createElement("span");
            span.className = "badge badge-primary badge-pill";
            //span.value = "\u00D7"
            var txt = document.createTextNode("x");
            span.appendChild(txt);
            span.onclick = removeElement
            li.appendChild(span);
            li.setAttribute("data-item", index);
            nodeList.append(li);
        }
    } else {
        var p = document.createElement("p")
        p.className = "my-5"
        p.innerHTML = "Start writing something";
        nodeList.append(p);
    }

    /*
    // Create a "close" button and append it to each list item
    var myNodelist = document.getElementsByTagName("li");
    var i;
    for (i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("span");
    var txt = document.createTextNode("\u00D7");
    span.className = "closeList";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
    }
    
    // Click on a close button to hide the current list item
    var close = document.getElementsByClassName("closeList");
    var i;
    for (i = 0; i < close.length; i++) {
        close[i].onclick = removeElement
    }
    */

    // Add a "checked" symbol when clicking on a list item
    var list = document.querySelector('ul');
    list.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'li') {
        ev.target.classList.toggle('checked');
    }
    }, false);
}
updatePage()

dateRange.datepicker().on('changeDate', (e) => {
    currentPage = e.date;
    updatePage()
});

// Today Button
const todayBtn = document.getElementById('today-btn')
todayBtn.onclick = () => {
    currentPage = new Date();
    updatePage()
}