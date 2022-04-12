//The user will enter a cocktail. Get a cocktail name, photo, and instructions and place them in the DOM
let allDrinks = {};

// get the value from the textbox on the button click
const button = document.querySelector("button");
button.addEventListener("click", function () {
  const drink = document.querySelector("input").value;
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`)
    .then((res) => res.json())
    .then((data) => {
      // store it in a global variable so that this data is accessible outside of this fetch()
      allDrinks = data;

      // get drinks array from the response received
      const drinksArr = data.drinks;

      // RESET the carousel slides and drink informations
      document.querySelector(".carousel-indicators").innerHTML = "";
      document.querySelector(".carousel-inner").innerHTML = "";
      document.querySelector("h2").textContent = "Name";
      document.querySelector("#instructions").textContent = "";
      document.getElementById("menu").textContent = "";

      // if the user inputs a wrong name, return without populating the caraousel & data
      if (!data.drinks) {
        alert("Invalid name!\nOne should know their drinks well ; )");
        return;
      }

      // dynamically insert slides into the carousel using jQuery
      $(document).ready(function () {
        // clear the carousel slides
        for (var i = 0; i < drinksArr.length; i++) {
          $(
            '<div class="carousel-item"><img class="d-block w-100" src="' +
              drinksArr[i].strDrinkThumb +
              '"> </div>'
          ).appendTo(".carousel-inner");
          $(
            '<li data-target="#carouselExampleIndicators" data-slide-to="' +
              i +
              '"></li>'
          ).appendTo(".carousel-indicators");
        }
        $(".carousel-item").first().addClass("active");
        $(".carousel-indicators > li").first().addClass("active");
        $("#carouselExampleIndicators").carousel();
      });

      // populate the details of the first drink to begin with
      getDrinkDetails(0);
    })
    .catch((err) => {
      alert("Some error occured...\nTry again.");
      console.log(err);
    });
});

function getDrinkDetails(index) {
  // show the drink name
  document.querySelector("h2").textContent = allDrinks.drinks[index].strDrink;
  // show instructions
  document.querySelector("#instructions").textContent =
    allDrinks.drinks[index].strInstructions;

  let idx = 1;
  // must clear the previous drink's ingredients
  let menu = document.getElementById("menu");
  menu.innerText = "";

  // loop through and display all the VALID ingredients
  while (allDrinks.drinks[index]["strIngredient" + idx]) {
    // could have used jQuery for inserting the li element, but using JS directly
    let li = document.createElement("li");
    // allDrinks.drinks[index] will give the current drink OBJECT
    li.innerText = allDrinks.drinks[index]["strIngredient" + idx];
    menu.appendChild(li);
    idx += 1;
  }
}

// select the next and prev carousel button and attach event listener to it
const prev = document.querySelector(".carousel-control-prev-icon");
const next = document.querySelector(".carousel-control-next-icon");

prev.addEventListener("click", function () {
  // if the user inputs a wrong name, return without populating the caraousel & data
  if (!allDrinks.drinks) {
    alert("Invalid name!\nOne should know their drinks well ; )");
    return;
  }

  // using jQuery to get the current bootstrap carousel INDEX using in-built method
  const prevDrink =
    ($("div.active").index() + allDrinks.drinks.length - 1) %
    allDrinks.drinks.length;
  // populate the details of the current drink in the carousel
  getDrinkDetails(prevDrink);
});

next.addEventListener("click", function () {
  if (!allDrinks.drinks) {
    alert("Invalid name!\nOne should know their drinks well ; )");
    return;
  }
  const nextDrink = ($("div.active").index() + 1) % allDrinks.drinks.length;
  getDrinkDetails(nextDrink);
});

// slide carousel automatically after 100 seconds.
// It's a by-pass so that user must click the prev/next button to populate the details.
$(".carousel").carousel({
  interval: 100000,
});
