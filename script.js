var page = 1;
var pagelimit = 5;
var foods = [];
var link = "http://www.epicurious.com";
var veg = false;
var ingredients = [];
var prep = [];

function setFood() {
  let thing = Math.floor(Math.random() * foods.length);
  let title = foods[thing].getAttribute("title").toUpperCase();
  link = "http://www.epicurious.com" + foods[thing].getAttribute("href");
  $("#mainfood").text(title);
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

function getrecipeinfo() {
  var url = link;
  var req = new XMLHttpRequest();
  req.onload = function() {
    let parser = new DOMParser();
    let doc = parser.parseFromString(this.responseText, "text/html");
    let items = doc.getElementsByClassName("ingredient");
    ingredients = Array.prototype.slice.call(items);
    let steps = doc.getElementsByClassName("preparation-step");
    prep = Array.prototype.slice.call(steps);
    console.log(prep);
  };
  req.open("GET", url, true);
  req.send();
}

$("#yes").click(function() {
  // window.open(link);
  getrecipeinfo();
  $("#top").animate({marginTop: "-60%"}, 250);
  $("#ycontainer").animate({bottom: "-10%"}, 250);
  $("#ncontainer").animate({bottom: "-10%"}, 250);
  $("#vegbtn").animate({bottom: "-18%"}, 250);
  $("#up").fadeIn("fast");
  $("#up").animate({marginTop: "50%"}, 250);
});

$("#no").click(function() {
  setFood();
});

$("#up").click(function() {
  $("#top").animate({marginTop: "10%"}, 250);
  $("#ycontainer").animate({bottom: "10%"}, 250);
  $("#ncontainer").animate({bottom: "10%"}, 250);
});

vegbtn.addEventListener("click", function() {
  $("#mainfood").text("HOLD UP ...");
  foods = [];
  page = 1;
  veg = !veg;
  if (veg) {
    $("#vegbtn").text("WANT MEAT?");
  } else {
    $("#vegbtn").text("VEGETARIAN?");
  }
  getFoods();
});

