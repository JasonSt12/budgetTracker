const baseDOM = {};
baseDOM["headerLinks"] = document.querySelectorAll(".header-links");
baseDOM["linkUnderlines"] = document.querySelectorAll(".underline");

for (let i = 0; i < baseDOM.headerLinks.length; i++) {
  baseDOM.headerLinks[i].addEventListener("mouseover", function () {
    baseDOM.linkUnderlines[i].style.width = "100%";
  });
}

for (let i = 0; i < baseDOM.headerLinks.length; i++) {
  baseDOM.headerLinks[i].addEventListener("mouseleave", function () {
    baseDOM.linkUnderlines[i].style.width = "0";
  });
}
