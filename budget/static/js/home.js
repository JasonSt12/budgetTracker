const menuButton = document.querySelector(".menu-button");
const dropdownButtons = document.querySelectorAll(".fa-angle-down");
const collapseButtons = document.querySelectorAll(".fa-angle-up");
const monthButtons = document.querySelectorAll(".month-button");
const selectedMonth = document.getElementById("selected-month");
const addExpenseButton = document.getElementById("add-expense-btn");
const addExpenseContainer = document.querySelector(".add-expense-container");
const closeAddExpense = document.getElementById("add-expense-X");
const addCategoryButton = document.getElementById("add-category-btn");
const categoryOptions = document.querySelectorAll(".category-option");
const addCategoryDropdown = document.getElementById("add-category-dropdown");
const selectedCategory = document.getElementById("selected-category");
const deleteExpenseButtons = document.querySelectorAll(".fa-trash-can");
const editButtons = document.querySelectorAll(".fa-pen-to-square");
const expenseData = document.querySelectorAll(".expense-data");
const editExpenseForms = document.querySelectorAll(".edit-expense-form");

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

function openCategoryDropdown(buttonIndex) {
  if (dropdownButtons.length !== 0) {
    const expenseList =
      dropdownButtons[buttonIndex].parentElement.parentElement
        .nextElementSibling;
    const listItems = expenseList.children;
    // height of one epxense list item * number of list items
    if (listItems.length > 0) {
      const listHeight = listItems[0].offsetHeight * listItems.length;
      expenseList.style.height = listHeight;
    }

    dropdownButtons[buttonIndex].classList.add("hidden");
    collapseButtons[buttonIndex].classList.remove("hidden");
  }
}

// Creates eventListener for close category dropdown button
function closeCategoryDropdown(buttonIndex) {
  if (collapseButtons.length !== 0) {
    collapseButtons[buttonIndex].addEventListener("click", function () {
      const expenseList =
        dropdownButtons[buttonIndex].parentElement.parentElement
          .nextElementSibling;

      expenseList.style.height = "0";
      dropdownButtons[buttonIndex].classList.remove("hidden");
      collapseButtons[buttonIndex].classList.add("hidden");

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

let openCategories = [];
for (let i = 0; i < dropdownButtons.length; i++) {
  dropdownButtons[i].addEventListener("click", function () {
    openCategoryDropdown(i);
    openCategories.push(i);
    // store the opened categories in localStorage to be able to keep them open
    // on page reload
    localStorage.setItem("openCategories", openCategories);

    // creates eventListener for closing dropdowns
    closeCategoryDropdown(i);
  });
}

for (let i = 0; i < monthButtons.length; i++) {
  monthButtons[i].addEventListener("click", function () {
    selectedMonth.value = monthButtons[i].textContent;
    this.closest("form").submit();
  });
}

addExpenseButton.addEventListener("click", function () {
  addExpenseContainer.classList.toggle("hidden");
});

closeAddExpense.addEventListener("click", function () {
  addExpenseContainer.classList.add("hidden");
});

addCategoryButton.addEventListener("click", function () {
  addCategoryDropdown.textContent = this.previousElementSibling.value;
  selectedCategory.value = addCategoryDropdown.textContent;
});

for (let i = 0; i < categoryOptions.length; i++) {
  categoryOptions[i].addEventListener("click", function () {
    addCategoryDropdown.textContent = categoryOptions[i].textContent;
    selectedCategory.value = addCategoryDropdown.textContent;
  });
}

for (let i = 0; i < editButtons.length; i++) {
  editButtons[i].addEventListener("click", function () {
    const checkmark = editButtons[i].nextElementSibling;
    checkmark.classList.remove("hidden");
    editButtons[i].classList.add("hidden");

    expenseData[i].classList.add("hidden");
    editExpenseForms[i].classList.remove("hidden");

    checkmark.addEventListener("click", function () {
      //   checkmark.classList.add("hidden");
      //   editButtons[i].classList.remove("hidden");
      //   expenseData[i].classList.remove("hidden");
      //   editExpenseForms[i].classList.add("hidden");
      editExpenseForms[i].submit();
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
