const pageLimit = 10;
const baseURL = "http://www.epicurious.com";
const originBaseURL = "http://allorigins.us/get?url=";
var foodList = [];
var infoList = [];
var currentFood = null;
var index = 0;
var veg = false;

function getElement(body, query) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(body.contents, "text/html");
  let res = doc.getElementsByClassName(query) || "";
  return res;
}

function setFood() {
  index = Math.floor(Math.random() * foodList.length);
  currentFood = list[index];
  let name = currentFood.getAttribute("title").toUpperCase();
  $("#mainfood").text(name);
}

function getList(page) {
  let url = baseURL + "/search?content=recipie&page=" + page;
  url += veg ? "&special-consideration=vegetarian" : "";
  url = originBaseURL + encodeURIComponent(url);
  $.getJSON(url, function(data) {
    let items = getElement(data, "view-complete-item");
    items = Array.from(items).filter(e => e.getAttribute("title"));
    let len = foodList.length;
    list = foodList.concat(items);
    page === 1 ? setFood() : "";
    page < pageLimit ? getInfo(len, page) : "";
  });
}
getList(1);

function getInfo(len, page) {
  for (let i = len; i < foodList.length; i++) {
    let link = baseURL + list[i].getAttribute("href");
    let url = originBaseURL + encodeURIComponent(url);
    $.getJSON(url, function(data) {
      let y = getElement(data, "yield")[1].innerText.toUpperCase() || "";
      let ing = getElement(data, "ingredient");
      ing = Array.from(ing).map(e => e.innerText);
      let prep = getElement(data, "preparation-step");
      prep = Array.from(prep).map(e => e.innerText);
      let img = getElement(data, "photo loaded")[0].getAttribute("imgsrc");
      infoList[i] = {
        y: y,
        ingredients: ing,
        prep: prep,
        imgsrc: img
      };
    });
    if (page < pageLimit) {
      getList(page + 1);
    }
  }
}

function setModalInfo(i) {
  let info = infoList[i];
  $("#modalTitle").text(currentFood.getAttribute("title").toUpperCase());
  if (info.y) {
    $("#ingredientsTitle").text("INGREDIENTS (" + info.y + ")");
  } else {
    $("#ingredientsTitle").text("INGREDIENTS");
  }
  $("#photo").attr("src", info.imgsrc);
  for (let i = 0; i < info.ingredients.length; i++) {
    let li = document.createElement("li");
    li.innerText = info.ingredients[i];
    $("#ingredientsList").append(li);
  }
  $("#prepTitle").text("PREPARATION");
  for (let i = 0; i < info.prep.length; i++) {
    let li = document.createElement("li");
    li.innerText = info.prep[i];
    $("#prepList").append(li);
  }
}

function showModal() {
  $("#modal").show();
  $("#modal").css("padding", "3vh 2vw");
  $("#modal").animate({
    "width": "86vw",
    "left": "5%"
  }, "fast");
}

function hideModal() {
  $("#modal").animate({
    "width": "0vw",
    "left": "50%"
  }, "fast", function() {
    $("#modal").css("padding", "0px");
    $("#modal").hide();
    clearModal();
  });
}

function clearModal() {
  $("#modalTitle").text("");
  $("#ingredientsTitle").text("");
  $("#ingredientsList").text("");
  $("#prepTitle").text("");
  $("#prepList").text("");
  $("#photo").attr("src", "");
}

$("#cancelModal").click(hideModal);

$("#yes").click(function() {
  showModal();
  setModalInfo(index);
});

$("#no").click(setFood);

$("#vegbtn").click(function() {
  $("#mainfood").text("HOLD UP ...");
  foodList = [];
  infoList = [];
  veg = !veg;
  if (veg) {
    $("#vegbtn").text("WANT MEAT?");
  } else {
    $("#vegbtn").text("VEGETARIAN?");
  }
  getList(1);
});
