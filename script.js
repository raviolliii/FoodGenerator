var page = 1;
var pagelimit = 10;
var list = [];
var infolist = [];
var index = 0;
var food;
var foodlink = "";
var veg = false;

function setFood() {
  index = Math.floor(Math.random() * list.length)
  food = list[index];
  let name = food.getAttribute("title").toUpperCase();
  foodlink = "http://www.epicurious.com" + food.getAttribute("href");
  $("#mainfood").text(name);
}

function getList() {
  var url = "http://www.epicurious.com/search?content=recipe&page=" + page;
  if (veg) {
    url += "&special-consideration=vegetarian";
  }
  url = "http://allorigins.us/get?url=" + encodeURIComponent(url);
  $.getJSON(url, function(data){
    let parser = new DOMParser();
    let doc = parser.parseFromString(data.contents, "text/html");
    let items = doc.getElementsByClassName("view-complete-item");
    items = Array.from(items).filter(e => e.getAttribute("title"));
    let len = list.length;
    list = list.concat(items);
    if (page === 1) {
      setFood();
    }
    if (page < pagelimit) {
      initInfo(len);
    }
  });
}
getList();

function initInfo(len) {
  for (let i = len; i < list.length; i++) {
    let link = "http://www.epicurious.com" + list[i].getAttribute("href");
    let url = "http://allorigins.us/get?url=" + encodeURIComponent(link);
    $.getJSON(url, function(data) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(data.contents, "text/html");
      let y = "";
      if (doc.getElementsByClassName("yield")[1]) {
        y = doc.getElementsByClassName("yield")[1].innerText.toUpperCase();
      }
      let ing = doc.getElementsByClassName("ingredient");
      ing = Array.from(ing).map(e => e.innerText);
      let prep = doc.getElementsByClassName("preparation-step");
      prep = Array.from(prep).map(e => e.innerText);
      let img = doc.getElementsByClassName("photo loaded")[0];
      infolist[i] = {
        y: y,
        ingredients: ing,
        prep: prep,
        imgsrc: img.getAttribute("srcset")
      };
    });
  }
  if (page < pagelimit) {
    page++;
    getList();
  }
}

function setModalInfo(i) {
  let info = infolist[i];
  $("#modalTitle").text(food.getAttribute("title").toUpperCase());
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


vegbtn.addEventListener("click", function() {
  $("#mainfood").text("HOLD UP ...");
  list = [];
  infolist = [];
  page = 1;
  veg = !veg;
  if (veg) {
    $("#vegbtn").text("WANT MEAT?");
  } else {
    $("#vegbtn").text("VEGETARIAN?");
  }
  getList();
});
