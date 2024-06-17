// const menuButton = document.querySelector(".menu-button");
const goalDOM = {};
goalDOM["errorMessage"] = document.getElementById("error-message");
goalDOM["existingGoalValues"] = document.querySelectorAll(
  ".existing-goal-values"
);
goalDOM["existingGoalActiveMonths"] = document.querySelectorAll(
  ".existing-goal-activeMonth"
);
goalDOM["goalDropdownContainers"] = document.querySelectorAll(
  ".goal-dropdown-container"
);
goalDOM["editButtons"] = document.querySelectorAll(".fa-pen-to-square");
goalDOM["existingMonthlyBudgets"] = document.querySelectorAll(
  ".existing-goal-monthlyBudget"
);
goalDOM["existingGoalNames"] = document.querySelectorAll(".existing-goal-name");
goalDOM["existingGoalIds"] = document.querySelectorAll(".existing-goal-ids");

let newGoalValues = {}; // stores the values of a newly created goal

// For pop out menu. Not implemented in this iteration
// let columnWidth = "0px";
// menuButton.addEventListener("click", function () {
//   if (columnWidth === "0px") {
//     document.querySelector(".left-column").style.width = "15vw";
//     document.querySelector(".header").style.marginLeft = "15vw";
//     document.querySelector(".main-container").style.marginLeft = "15vw";
//   } else {
//     document.querySelector(".left-column").style.width = "0";
//     document.querySelector(".header").style.marginLeft = "0";
//     document.querySelector(".main-container").style.marginLeft = "0";
//   }

//   columnWidth = document.querySelector(".left-column").style.width;
// });

document
  .getElementById("add-category-btn")
  .addEventListener("click", function () {
    const newCategoryInput = document.getElementById("new-category");
    const newCategoryPercent = document.getElementById("new-category-percent");

    // Validate that a user has given a category name and percent value for
    // the new category
    if (newCategoryInput.value === "" || newCategoryPercent.value === "") {
      goalDOM.errorMessage.textContent =
        "Please Provide A Category Name And Percent";
    } else {
      // add category and percent to the newGoalValues object
      newGoalValues[newCategoryInput.value] = newCategoryPercent.value;

      // HTML to display newly created category
      const categoryListItem = `
        <div class="category-list-item">
          <div>${newCategoryInput.value} ${newCategoryPercent.value}%</div>
          <i class="fa-solid fa-x delete-new-category"></i>
        </div>`;

      // insert the html and remove the inputted values from the percent
      // and category name input tags
      document
        .querySelector(".category-list-container")
        .insertAdjacentHTML("beforeend", categoryListItem);

      newCategoryInput.value = "";
      newCategoryPercent.value = "";
      goalDOM.errorMessage.textContent = "";
    }
  });

const currentYear = new Date().getFullYear();
for (let i = currentYear; i >= 2000; i--) {
  // inserts the years 2000 to current year in the year dropdown menu.
  document
    .getElementById("year-selector")
    .insertAdjacentHTML(
      "beforeend",
      `<li><a class="dropdown-item year-dropdown-item">${i}</a></li>`
    );
}

document.querySelectorAll(".month-dropdown-item").forEach((monthOption) => {
  monthOption.addEventListener("click", function () {
    // set the value of the month dropdown button text to the value of the month
    // that was selected
    document.getElementById("month-dropdown-button").textContent =
      this.textContent;

    // set the value of the active month input tag to the value
    // of the selected month
    document.getElementById("active-month-input").value = this.textContent;
  });
});

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
// delcared inside the inputColumn click event listener since categories are added
// dynamically, and the event listeners for the delete category buttons would not
// be initialized on page load
document.querySelector(".input-column").addEventListener("click", function () {
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
// as the new goal. Returns true for a duplicate false for no duplicates
function checkMonthDuplicates() {
  const selectedMonth = document.getElementById("active-month-input").value;
  const selectedYear = document.getElementById("active-year-input").value;
  const selectedMonthYear = selectedMonth + " " + selectedYear;

  for (let i = 0; i < goalDOM.existingGoalActiveMonths.length; i++) {
    if (goalDOM.existingGoalActiveMonths[i].textContent === selectedMonthYear) {
      return true;
    }
  }
  return false;
}

document.getElementById("set-goal-btn").addEventListener("click", function () {
  document.getElementById("new-goal-values").value =
    JSON.stringify(newGoalValues);
  const monthlyBudget = document.getElementById("monthly-budget");
  const goalNameInput = document.querySelector(".goal-name");

  // calculates the total of the new percentages
  let categoryPercentSum = 0;
  for (let key in newGoalValues) {
    categoryPercentSum += Number(newGoalValues[key]);
  }

  // Input validation for a new goal
  if (categoryPercentSum !== 100) {
    goalDOM.errorMessage.textContent = "Percentages Do Not Add Up To 100";
  } else if (checkMonthDuplicates()) {
    goalDOM.errorMessage.textContent = `
      An existing goal has the same active month. 
      Two goals cannot have the same active month`;
  } else if (monthlyBudget.value === "") {
    goalDOM.errorMessage.textContent = "Monthly Budget Not Set";
  } else if (goalNameInput.value === "") {
    goalDOM.errorMessage.textContent = "Goal Name Not Set";
  } else {
    this.closest("form").submit();
  }
});

function activateGoalDropdowns() {
  const goalDropdownButtons = document.querySelectorAll(".fa-angle-down");
  const goalCollapseButtons = document.querySelectorAll(".fa-angle-up");

  for (let i = 0; i < goalDropdownButtons.length; i++) {
    goalDropdownButtons[i].addEventListener("click", function () {
      goalDOM.goalDropdownContainers[i].style.height = "20vh";
      goalDOM.goalDropdownContainers[i].style.overflow = "scroll";
      goalCollapseButtons[i].classList.remove("hidden");
      goalDropdownButtons[i].classList.add("hidden");
    });
  }

  for (let i = 0; i < goalCollapseButtons.length; i++) {
    goalCollapseButtons[i].addEventListener("click", function () {
      goalDOM.goalDropdownContainers[i].style.height = "0";
      goalDOM.goalDropdownContainers[i].style.overflow = "hidden";
      goalCollapseButtons[i].classList.add("hidden");
      goalDropdownButtons[i].classList.remove("hidden");
    });
  }
}
activateGoalDropdowns();

// Insert Goal data into the respective goal dropdown.
for (let i = 0; i < goalDOM.goalDropdownContainers.length; i++) {
  const goalData = JSON.parse(goalDOM.existingGoalValues[i].textContent);

  for (key in goalData) {
    let html = `<div>${key}: ${goalData[key]}%</div>`;
    goalDOM.goalDropdownContainers[i].insertAdjacentHTML("beforeend", html);
  }
}

// Adds event listener for adding a category in the goal edit form
document
  .getElementById("add-category-btn-edit")
  .addEventListener("click", function () {
    const newCategory = document.getElementById("new-category-edit");
    const newPercent = document.getElementById("new-category-percent-edit");
    const errorMessage_edit = document.getElementById("error-message-edit");

    // makes sure user gave a category name and percent value
    if (newCategory.value === "" || newPercent.value === "") {
      errorMessage_edit.textContent =
        "Please Provide A Category Name And Percent";
    } else {
      // HTML for a category component in the edit form
      const categoryListItem = `
        <div class="category-list-item">
          <div class="d-flex align-items-center">
            <input class="form-control me-1 mb-1" type="text" value="${newCategory.value}"/>
            <input class="form-control mb-1" type="text" value="${newPercent.value}"/>
          </div>
          <i class="fa-solid fa-x ms-2 delete-existing-category"></i>
        </div>`;

      // insert new category component and clear the add category inputs
      document
        .querySelector(".category-list-container-edit")
        .insertAdjacentHTML("beforeend", categoryListItem);

      newCategory.value = "";
      newPercent.value = "";
      errorMessage_edit.textContent = "";

      // Activate the delete button of the newly added category
      activateCategoryDeleteButtons();
    }
  });

// Actviates the delete button for a category. Is used when a new category is
// created in the goal edit form and when a goal is selected to be edited
function activateCategoryDeleteButtons() {
  goalDOM["deleteExistingCategoryBtns"] = document.querySelectorAll(
    ".delete-existing-category"
  );
  for (let i = 0; i < goalDOM.deleteExistingCategoryBtns.length; i++) {
    goalDOM.deleteExistingCategoryBtns[i].addEventListener(
      "click",
      function () {
        this.parentElement.remove();
      }
    );
  }
}

// Creates event listeners for goal edit buttons
for (let i = 0; i < goalDOM.editButtons.length; i++) {
  goalDOM.editButtons[i].addEventListener("click", function () {
    // gets the data of the selected goal
    const goalData = JSON.parse(goalDOM.existingGoalValues[i].textContent);

    for (key in goalData) {
      // creates category display components for the categories of the goal
      // to be edited
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

    activateCategoryDeleteButtons();

    // sets values of input tags for the selected goal. These input tags are
    // what are submitted in the form when a goal is updated.
    document.getElementById("monthly-budget-edit").value =
      goalDOM.existingMonthlyBudgets[i].textContent;

    document.getElementById("goal-name-edit").value =
      goalDOM.existingGoalNames[i].textContent;

    document.getElementById("updated-active-month").value =
      goalDOM.existingGoalActiveMonths[i].textContent;

    document.querySelectorAll(".updated-goal-id").forEach((input) => {
      // input 1 is for the update goal form. Input 2 is for the delete
      // goal form
      input.value = goalDOM.existingGoalIds[i].textContent;
    });

    document.getElementById("active-month-edit").textContent =
      goalDOM.existingGoalActiveMonths[i].textContent;

    document.getElementById("create-goal-form").classList.add("hidden");
    document.getElementById("edit-goal-form").classList.remove("hidden");
  });
}

document
  .getElementById("delete-goal-btn")
  .addEventListener("click", function () {
    document.getElementById("delete-goal-form").classList.remove("hidden");
  });

document.getElementById("cancel-delete").addEventListener("click", function () {
  document.getElementById("delete-goal-form").classList.add("hidden");
});

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

    // Check for correct input and submit
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
      document.getElementById("edit-goal-form").submit();
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
  // Get category and percent values of the current goal
  for (let i = 0; i < goalDOM.existingGoalActiveMonths.length; i++) {
    if (goalDOM.existingGoalActiveMonths[i].textContent === currentMonthYear) {
      const currentGoal = JSON.parse(goalDOM.existingGoalValues[i].textContent);

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
