const menuButton = document.querySelector(".menu-button");
const inputColumn = document.querySelector(".input-column");
const rightColumn = document.querySelector(".right-column");
const header = document.querySelector(".header");
const mainContainer = document.querySelector(".main-container");
const newCategoryButton = document.getElementById("add-category-btn");
const newCategoryInput = document.getElementById("new-category");
const newCategoryPercent = document.getElementById("new-category-percent");
const categoryListContainer = document.querySelector(
  ".category-list-container"
);
const newGoalValuesInput = document.getElementById("new-goal-values");
const monthlyBudget = document.getElementById("monthly-budget");
const goalNameInput = document.querySelector(".goal-name");
const setGoalBtn = document.getElementById("set-goal-btn");
const errorMesage = document.getElementById("error-message");
const yearSelector = document.getElementById("year-selector");
const monthDropdownItems = document.querySelectorAll(".month-dropdown-item");
const existingGoalValues = document.querySelectorAll(".existing-goal-values");
const existingGoalActiveMonths = document.querySelectorAll(
  ".existing-goal-activeMonth"
);

let newGoalValues = {};

let columnWidth = "0px";
menuButton.addEventListener("click", function () {
  if (columnWidth === "0px") {
    document.querySelector(".left-column").style.width = "15vw";
    document.querySelector(".header").style.marginLeft = "15vw";
    document.querySelector(".main-container").style.marginLeft = "15vw";
  } else {
    document.querySelector(".left-column").style.width = "0";
    document.querySelector(".header").style.marginLeft = "0";
    document.querySelector(".main-container").style.marginLeft = "0";
  }

  columnWidth = document.querySelector(".left-column").style.width;
});

newCategoryButton.addEventListener("click", function () {
  if (newCategoryInput.value === "" || newCategoryPercent.value === "") {
    errorMesage.textContent = "Please Provide A Category Name And Percent";
  } else {
    newGoalValues[newCategoryInput.value] = newCategoryPercent.value;

    const categoryListItem = `
  <div class="category-list-item">
    <div>${newCategoryInput.value} ${newCategoryPercent.value}%</div>
    <i class="fa-solid fa-x"></i>
  </div>`;

    categoryListContainer.insertAdjacentHTML("beforeend", categoryListItem);

    newCategoryInput.value = "";
    newCategoryPercent.value = "";
    errorMesage.textContent = "";
  }
});

// add event listener for deleting a category from a goal

const currentYear = new Date().getFullYear();
for (let i = currentYear; i >= 2000; i--) {
  yearSelector.insertAdjacentHTML(
    "beforeend",
    `<li><a class="dropdown-item year-dropdown-item" href="#">${i}</a></li>`
  );
}

// Adds event listeners for selecting the active month of a goal
for (let i = 0; i < monthDropdownItems.length; i++) {
  monthDropdownItems[i].addEventListener("click", function () {
    document.getElementById("month-dropdown-button").textContent =
      this.textContent;
    document.getElementById("active-month-input").value = this.textContent;
  });
}

const yearDropdownItems = document.querySelectorAll(".year-dropdown-item");
// Adds event listeners for selecting the active year of a goal
for (let i = 0; i < yearDropdownItems.length; i++) {
  yearDropdownItems[i].addEventListener("click", function () {
    document.getElementById("year-dropdown-button").textContent =
      this.textContent;
    document.getElementById("active-year-input").value = this.textContent;
  });
}

// Adds event listener for delete category buttons. Need to have delteCategoryButtons
// delcared inside the inputColumn event listener since categories are added
// dynamically
inputColumn.addEventListener("click", function () {
  const deleteCategoryButtons = document.querySelectorAll(".fa-x");
  for (let i = 0; i < deleteCategoryButtons.length; i++) {
    deleteCategoryButtons[i].addEventListener("click", function () {
      let deletedCat = this.previousElementSibling.textContent;
      deletedCat = deletedCat.substring(0, deletedCat.length - 1);

      delete newGoalValues.deletedCat;
      this.parentElement.remove();
    });
  }
});

// Makes sure there are no other goals with the same active month
// as the new goal. Returns true for a duplicate
function checkMonthDuplicates() {
  const selectedMonth = document.getElementById("active-month-input").value;
  const selectedYear = document.getElementById("active-year-input").value;
  const selectedMonthYear = selectedMonth + " " + selectedYear;

  for (let i = 0; i < existingGoalActiveMonths.length; i++) {
    console.log(existingGoalActiveMonths[i].textContent);
    if (existingGoalActiveMonths[i].textContent === selectedMonthYear) {
      return true;
    }
  }
  return false;
}

setGoalBtn.addEventListener("click", function () {
  newGoalValuesInput.value = JSON.stringify(newGoalValues);

  let categoryPercentSum = 0;
  for (let key in newGoalValues) {
    categoryPercentSum += Number(newGoalValues[key]);
  }

  console.log("categoryPercentSum = ", categoryPercentSum);

  if (categoryPercentSum !== 100) {
    errorMesage.textContent = "Percentages Do Not Add Up To 100";
  } else if (checkMonthDuplicates()) {
    errorMesage.textContent = `
      An existing goal has the same active month. 
      Two goals cannot have the same active month`;
  } else if (monthlyBudget.value === "") {
    errorMesage.textContent = "Monthly Budget Not Set";
  } else if (goalNameInput.value === "") {
    errorMesage.textContent = "Goal Name Not Set";
  } else {
    this.closest("form").submit();
  }
});

let chartLabels = [];
let charValues = [];
function setChartData() {
  const currentMonth = new Date().getMonth();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthYear = months[currentMonth] + " " + currentYear;

  for (let i = 0; i < existingGoalActiveMonths.length; i++) {
    if (existingGoalActiveMonths[i].textContent === currentMonthYear) {
      console.log(existingGoalValues[i].textContent);
    }
  }
}
setChartData();

function calculatePoint(i, intervalSize, colorInfo) {
  var { colorStart, colorEnd, useEndAsStart } = colorInfo;
  return useEndAsStart
    ? colorEnd - i * intervalSize
    : colorStart + i * intervalSize;
}

function createColorArray(numOfDataPoints, colorScale, colorInfo) {
  var { colorStart, colorEnd } = colorInfo;
  var colorRange = colorEnd - colorStart;
  var intervalSize = colorRange / dataLength;

  var colorPoint;
  var colorArray = [];

  for (let i = 0; i < numOfDataPoints; i++) {
    colorPoint = calculatePoint(i, intervalSize, colorInfo);
    colorArray.push(colorScale(colorPoint));
  }

  return colorArray;
}

const chart = new Chart("goal-chart", {
  type: "doughnut",
  data: {
    labels: ["Spent", "Unallocated"],
    datasets: [
      {
        backgroundColor: ["#53b5e7", "#3d52a0"],
        data: [10, 20],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
});

const colorScale = d3.interpolateCool;

const colorInfo = {
  colorStart: 0,
  colorEnd: 0.65,
  useEndAsStart: false,
};
