const menuButton = document.querySelector(".menu-button");
const rightColumn = document.querySelector(".right-column");
const header = document.querySelector(".header");
const mainContainer = document.querySelector(".main-container");

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

const chart = new Chart("goal-chart", {
  type: "doughnut",
  data: {
    labels: ["Spent", "Remaining"],
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
