/*google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

var chart;
var data;
function drawChart() {
    data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ['Work',     9],
        ['Eat',      2],
        ['Commute',  2],
        ['Watch TV', 4],
        ['Sleep',    7]
    ]);

    var options = {
        title: 'My Daily Activities',
        chartArea: {
            width: '94%',
        },
        legend: {
            position: 'top',
        },
        width: '100%'
    };

    chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);

    google.visualization.events.addListener(chart, 'select', function() {
        let selection = chart.getSelection()
        if(selection.row) {
            const task = data.getValue(selection[0].row, 0)
            // console.log(task, " = ", data.getValue(selection[0].row, 1), "hours")
        }
        
        
    })
}
*/

const menuButton = document.querySelector('.menu-button')
const dropdownButtons = document.querySelectorAll('.fa-angle-down')
const collapseButtons = document.querySelectorAll('.fa-angle-up')
const monthButtons = document.querySelectorAll('.month-button')
const selectedMonth = document.getElementById('selected-month')

let columnWidth = '0px'
menuButton.addEventListener('click', function() {

    if(columnWidth === '0px') {
        document.querySelector('.left-column').style.width = '15vw'
        document.querySelector('.header').style.marginLeft = "15vw"
        document.querySelector('.main-container').style.marginLeft = "15vw"
    }
    else {
        document.querySelector('.left-column').style.width = '0'
        document.querySelector('.header').style.marginLeft = "0"
        document.querySelector('.main-container').style.marginLeft = "0"
    }    

    columnWidth = document.querySelector('.left-column').style.width
})

for(let i = 0; i < dropdownButtons.length; i++) {

    dropdownButtons[i].addEventListener('click', function() {
        const currentList = dropdownButtons[i].parentElement.
                            parentElement.nextElementSibling
        const listItems = currentList.children
        const listHeight = listItems[0].offsetHeight * listItems.length

        currentList.style.height = listHeight
        dropdownButtons[i].classList.add('hidden')
        collapseButtons[i].classList.remove('hidden')

        collapseButtons[i].addEventListener('click', function() {
            currentList.style.height = '0'
            dropdownButtons[i].classList.remove('hidden')
            collapseButtons[i].classList.add('hidden')

        }) 
    })
}

for(let i = 0; i < monthButtons.length; i++) {
    monthButtons[i].addEventListener('click', function() {
        selectedMonth.value = monthButtons[i].textContent
        this.closest('form').submit()
    })
}
