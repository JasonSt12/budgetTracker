// const menuButton = document.querySelector(".menu-button");
const homeDOM = {};
homeDOM["collapseButtons"] = document.querySelectorAll(".fa-angle-up");
homeDOM["dropdownButtons"] = document.querySelectorAll(".fa-angle-down");
homeDOM["addExpenseContainer"] = document.querySelector(
  ".add-expense-container"
);
homeDOM["addCategoryDropdown"] = document.getElementById(
  "add-category-dropdown"
);
homeDOM["editButtons"] = document.querySelectorAll(".fa-pen-to-square");
homeDOM["expenseData"] = document.querySelectorAll(".expense-data");
homeDOM["editExpenseForms"] = document.querySelectorAll(".edit-expense-form");
let openCategories = []; // stores which category dropdowns are open

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

function openCategoryDropdown(buttonIndex) {
  if (homeDOM.dropdownButtons.length !== 0) {
    // gets the expense list container
    const expenseList =
      homeDOM.dropdownButtons[buttonIndex].parentElement.parentElement
        .nextElementSibling;
    const listItems = expenseList.children;
    // height of one epxense list item * number of list items
    if (listItems.length > 0) {
      const listHeight = listItems[0].offsetHeight * listItems.length;
      // increase expense list container height to the value of listHeight
      expenseList.style.height = listHeight;
    }

    // hide dropdown button and show collapse button
    homeDOM.dropdownButtons[buttonIndex].classList.add("hidden");
    homeDOM.collapseButtons[buttonIndex].classList.remove("hidden");
  }
}

// Creates eventListener for close category dropdown buttons
function closeCategoryDropdown(buttonIndex) {
  if (homeDOM.collapseButtons.length !== 0) {
    homeDOM.collapseButtons[buttonIndex].addEventListener("click", function () {
      // gets the expense list container
      const expenseList =
        homeDOM.dropdownButtons[buttonIndex].parentElement.parentElement
          .nextElementSibling;

      // mkae expense list invisible by setting its height to 0px
      expenseList.style.height = "0";
      // hide collapse button and show dropdown button
      homeDOM.dropdownButtons[buttonIndex].classList.remove("hidden");
      homeDOM.collapseButtons[buttonIndex].classList.add("hidden");

      // remove current category from list of open categories
      const index = openCategories.indexOf(buttonIndex);
      if (index > -1) openCategories.splice(index, 1);

      localStorage.setItem("openCategories", openCategories);
    });
  }
}

function openDropdownsOnLoad() {
  const toOpenString = localStorage.getItem("openCategories");
  if (toOpenString) {
    const toOpenArray = toOpenString.split(",");
    toOpenArray.forEach((index) => {
      openCategoryDropdown(index);
      // allows you to close dropdowns that were opened on load
      closeCategoryDropdown(index);
    });
  }
}
openDropdownsOnLoad();

for (let i = 0; i < homeDOM.dropdownButtons.length; i++) {
  homeDOM.dropdownButtons[i].addEventListener("click", function () {
    openCategoryDropdown(i);
    openCategories.push(i);
    // store the opened categories in localStorage to be able to keep them open
    // on page reload
    localStorage.setItem("openCategories", openCategories);

    // creates eventListener for closing dropdowns
    closeCategoryDropdown(i);
  });
}

// Submits form when selecting an option in the month dropdown
document.querySelectorAll(".month-button").forEach((button) => {
  button.addEventListener("click", function () {
    document.getElementById("selected-month").value = button.textContent;
    this.closest("form").submit();
  });
});

// shows the add expense component when add expense button is clicked
document
  .getElementById("add-expense-btn")
  .addEventListener("click", function () {
    homeDOM.addExpenseContainer.classList.toggle("hidden");
  });

// close add expeense container
document.getElementById("add-expense-X").addEventListener("click", function () {
  homeDOM.addExpenseContainer.classList.add("hidden");
});

// Add category ti the list of available categories
// when adding an expense
document
  .getElementById("add-category-btn")
  .addEventListener("click", function () {
    // this.previousElementSiling is the input for the new category name
    homeDOM.addCategoryDropdown.textContent = this.previousElementSibling.value;
    document.getElementById("selected-category").value =
      homeDOM.addCategoryDropdown.textContent;
  });

// event listener for the category options in the add expense category dropdown
document.querySelectorAll(".category-option").forEach((categoryOption) => {
  categoryOption.addEventListener("click", function () {
    // Sets the text for the category dropdown button to the value of the
    // selected category
    homeDOM.addCategoryDropdown.textContent = categoryOption.textContent;
    // sets the value of the selected category input tag to the value of
    // the category that the user selected
    document.getElementById("selected-category").value =
      homeDOM.addCategoryDropdown.textContent;
  });
});

for (let i = 0; i < homeDOM.editButtons.length; i++) {
  // displays the inputs for editing an expense when an edit button is clicked
  homeDOM.editButtons[i].addEventListener("click", function () {
    const checkmark = homeDOM.editButtons[i].nextElementSibling;
    checkmark.classList.remove("hidden");
    homeDOM.editButtons[i].classList.add("hidden");

    homeDOM.expenseData[i].classList.add("hidden");
    homeDOM.editExpenseForms[i].classList.remove("hidden");

    checkmark.addEventListener("click", function () {
      homeDOM.editExpenseForms[i].submit();
    });
  });
}

const totalSpent = document.getElementById("total-spent");
const totalRemining = document.getElementById("total-remaining");

const chart = new Chart("spent-remaining-chart", {
  type: "doughnut",
  data: {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        backgroundColor: ["#53b5e7", "#3d52a0"],
        data: [
          Number(totalSpent.textContent),
          Number(totalRemining.textContent),
        ],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
});
