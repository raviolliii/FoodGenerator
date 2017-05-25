var mainfood = document.getElementById("mainItem");
var yes = document.getElementById("yes");
var no = document.getElementById("no");
var page = 1;
var pagelimit = 5;
var foods = [];
var link = "http://www.epicurious.com";
var veg = true;

function setFood() {
  let thing = Math.floor(Math.random() * foods.length);
  let title = foods[thing].getAttribute("title").toUpperCase();
  link = "http://www.epicurious.com" + foods[thing].getAttribute("href");
  mainfood.innerHTML = title;
}

function getFoods() {
  var url = "";
  if (veg) {
    url = "http://www.epicurious.com/search/?special-consideration=vegetarian&content=recipe&page=" + page;
  } else {
    url = "http://www.epicurious.com/search?content=recipe&page=" + page;
  }
  var req = new XMLHttpRequest();
  req.onload = function() {
    let parser = new DOMParser();
    let doc = parser.parseFromString(this.responseText, "text/html");
    let items = doc.getElementsByClassName("view-complete-item");
    items = Array.prototype.slice.call(items).filter(function(e) {
      return e.getAttribute("title");
    });
    foods = foods.concat(items);
    if (page < 5) {
      page++;
      getFoods();
    } else {
      setFood();
    }
  };
  req.open("GET", url, true);
  req.send();
}
getFoods();

yes.addEventListener("click", function() {
  window.open(link);
});

no.addEventListener("click", function() {
  setFood();
});
