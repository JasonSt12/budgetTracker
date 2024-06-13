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

const goalNameInput = document.querySelector(".goal-name");
const setGoalBtn = document.getElementById("set-goal-btn");
const errorMesage = document.getElementById("error-message");
const yearSelector = document.getElementById("year-selector");
const monthDropdownItems = document.querySelectorAll(".month-dropdown-item");
const existingGoalValues = document.querySelectorAll(".existing-goal-values");
const existingGoalActiveMonths = document.querySelectorAll(
  ".existing-goal-activeMonth"
);
const goalDropdownContainers = document.querySelectorAll(
  ".goal-dropdown-container"
);
const goalDropdownButtons = document.querySelectorAll(".fa-angle-down");
const goalCollapseButtons = document.querySelectorAll(".fa-angle-up");
const goalEditButtons = document.querySelectorAll(".fa-pen-to-square");

const DOM = {};
DOM["existingMonthlyBudgets"] = document.querySelectorAll(
  ".existing-goal-monthlyBudget"
);
DOM["existingGoalNames"] = document.querySelectorAll(".existing-goal-name");
DOM["existingGoalIds"] = document.querySelectorAll(".existing-goal-ids");

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
    <i class="fa-solid fa-x delete-new-category"></i>
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
    `<li><a class="dropdown-item year-dropdown-item">${i}</a></li>`
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
  const deleteNewCategoryButtons = document.querySelectorAll(
    ".delete-new-category"
  );
  for (let i = 0; i < deleteNewCategoryButtons.length; i++) {
    deleteNewCategoryButtons[i].addEventListener("click", function () {
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
    if (existingGoalActiveMonths[i].textContent === selectedMonthYear) {
      return true;
    }
  }
  return false;
}

setGoalBtn.addEventListener("click", function () {
  newGoalValuesInput.value = JSON.stringify(newGoalValues);
  const monthlyBudget = document.getElementById("monthly-budget");

  let categoryPercentSum = 0;
  for (let key in newGoalValues) {
    categoryPercentSum += Number(newGoalValues[key]);
  }

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

for (let i = 0; i < goalDropdownButtons.length; i++) {
  goalDropdownButtons[i].addEventListener("click", function () {
    goalDropdownContainers[i].style.height = "20vh";
    goalDropdownContainers[i].style.overflow = "scroll";
    goalCollapseButtons[i].classList.remove("hidden");
    goalDropdownButtons[i].classList.add("hidden");
  });
}

for (let i = 0; i < goalCollapseButtons.length; i++) {
  goalCollapseButtons[i].addEventListener("click", function () {
    goalDropdownContainers[i].style.height = "0";
    goalDropdownContainers[i].style.overflow = "hidden";
    goalCollapseButtons[i].classList.add("hidden");
    goalDropdownButtons[i].classList.remove("hidden");
  });
}

// Insert Goal data into goal dropdown
for (let i = 0; i < goalDropdownContainers.length; i++) {
  const goalData = JSON.parse(existingGoalValues[i].textContent);

  for (key in goalData) {
    let html = `<div>${key}: ${goalData[key]}%</div>`;
    goalDropdownContainers[i].insertAdjacentHTML("beforeend", html);
  }
}

document
  .getElementById("add-category-btn-edit")
  .addEventListener("click", function () {
    const newCategory = document.getElementById("new-category-edit");
    const newPercent = document.getElementById("new-category-percent-edit");
    const errorMessage_edit = document.getElementById("error-message-edit");

    if (newCategory.value === "" || newPercent.value === "") {
      errorMessage_edit.textContent =
        "Please Provide A Category Name And Percent";
    } else {
      const categoryListItem = `
        <div class="category-list-item">
          <div class="d-flex align-items-center">
            <input class="form-control me-1 mb-1" type="text" value="${newCategory.value}"/>
            <input class="form-control mb-1" type="text" value="${newPercent.value}"/>
          </div>
          <i class="fa-solid fa-x ms-2 delete-existing-category"></i>
        </div>`;

      document
        .querySelector(".category-list-container-edit")
        .insertAdjacentHTML("beforeend", categoryListItem);

      newCategory.value = "";
      newPercent.value = "";
      errorMessage_edit.textContent = "";
      activateCategoryDeleteButtons();
    }
  });

function activateCategoryDeleteButtons() {
  DOM["deleteExistingCategoryBtns"] = document.querySelectorAll(
    ".delete-existing-category"
  );
  for (let i = 0; i < DOM.deleteExistingCategoryBtns.length; i++) {
    DOM.deleteExistingCategoryBtns[i].addEventListener("click", function () {
      this.parentElement.remove();
    });
  }
}

for (let i = 0; i < goalEditButtons.length; i++) {
  goalEditButtons[i].addEventListener("click", function () {
    const goalData = JSON.parse(existingGoalValues[i].textContent);

    for (key in goalData) {
      const categoryListItem = `
        <div class="category-list-item">
          <div class="d-flex align-items-center">
            <input class="form-control me-1 mb-1" type="text" value="${key}"/>
            <input class="form-control mb-1" type="text" value="${goalData[key]}"/>
          </div>
          <i class="fa-solid fa-x ms-2 delete-existing-category"></i>
        </div>`;

      document
        .querySelector(".category-list-container-edit")
        .insertAdjacentHTML("beforeend", categoryListItem);
    }

    // get the category delete buttons
    activateCategoryDeleteButtons();

    document.getElementById("monthly-budget-edit").value =
      DOM.existingMonthlyBudgets[i].textContent;

    document.getElementById("goal-name-edit").value =
      DOM.existingGoalNames[i].textContent;

    document.getElementById("updated-active-month").value =
      existingGoalActiveMonths[i].textContent;

    document.getElementById("updated-goal-id").value =
      DOM.existingGoalIds[i].textContent;

    document.getElementById("active-month-edit").textContent =
      existingGoalActiveMonths[i].textContent;

    document.getElementById("info-message").textContent =
      "Deleting A Category Will Delete The Corresponding Expenses";
    document.getElementById("create-goal-form").classList.add("hidden");
    document.getElementById("edit-goal-form").classList.remove("hidden");
  });
}

document
  .getElementById("save-updates-btn")
  .addEventListener("click", function () {
    const errorMessage_edit = document.getElementById("error-message-edit");
    const monthlyBudget_edit = document.getElementById("monthly-budget-edit");
    const goalName_edit = document.getElementById("goal-name-edit");

    const categoryNodes = document.querySelector(
      ".category-list-container-edit"
    ).children;

    let percentSum = 0;
    const updatedCategories = {};
    for (let i = 0; i < categoryNodes.length; i++) {
      const inputContainer = categoryNodes[i].firstElementChild;
      const inputNodes = inputContainer.children;

      // inputNodes[0] category
      // inputNodes[1] percent
      updatedCategories[inputNodes[0].value] = inputNodes[1].value;
      percentSum += Number(inputNodes[1].value);
    }

    if (percentSum !== 100) {
      errorMessage_edit.textContent = "Percentages Do Not Add Up To 100";
    } else if (monthlyBudget_edit.value === "") {
      errorMessage_edit.textContent = "Monthly Budget Not Set";
    } else if (goalName_edit.value === "") {
      errorMessage_edit.textContent = "Goal Name Not Set";
    } else {
      document.getElementById("create-goal-form").classList.remove("hidden");
      document.getElementById("edit-goal-form").classList.add("hidden");
      document.getElementById("updated-goal-values").value =
        JSON.stringify(updatedCategories);
      this.closest("form").submit();
    }
  });

//
// Chart code below
//
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
      const currentGoal = JSON.parse(existingGoalValues[i].textContent);

      for (key in currentGoal) {
        chartLabels.push(key);
        charValues.push(currentGoal[key]);
      }
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
  var intervalSize = colorRange / numOfDataPoints;

  var colorPoint;
  var colorArray = [];

  for (let i = 0; i < numOfDataPoints; i++) {
    colorPoint = calculatePoint(i, intervalSize, colorInfo);
    colorArray.push(colorScale(colorPoint));
  }

  return colorArray;
}

const colorScale = d3.interpolateCool;

const colorInfo = {
  colorStart: 0,
  colorEnd: 0.65,
  useEndAsStart: false,
};

let colors = createColorArray(charValues.length, colorScale, colorInfo);

const chart = new Chart("goal-chart", {
  type: "doughnut",
  data: {
    labels: chartLabels,
    datasets: [
      {
        backgroundColor: colors,
        data: charValues,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
});
