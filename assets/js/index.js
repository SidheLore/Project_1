// Adds navbar menu dropdown functionality 
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
  
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);
  
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
  
      });
    });
  });


var searchInputEl = document.getElementById('search-input')
var selectTypeEl = document.getElementById('type-select')
var searchForm = document.getElementById('search')

// Uses the MealDB to search for meals with the given search criteria
var getMeals = function(input, type) {
    if (type == 'category') {
        url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=' + input;
    }
    else if (type == 'area') {
        url = 'https://www.themealdb.com/api/json/v1/1/filter.php?a=' + input;
    }
    else {
        url = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=' + input;
    }
    fetch(url)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                if (data.meals) {
                    displayResults(data.meals)
                }
                else {
                    displayMessage("No results found.", "is-danger")
                }
            })
        }
    })
    .catch(function(error) {
        displayMessage(error, "is-danger")
})}

// Lists search results
var displayResults = function(mealsArr) {
    for (var i = 0; i<mealsArr.length; i++) {
        listMeal(mealsArr[i])
    }
}

// Displays a message based on the given message content and type
var displayMessage = function(message, type) {
    var errorEl = document.createElement("div");
    errorEl.classList = "notification " + type;
    errorEl.textContent = message
    var deleteBtn = document.createElement('button')
    deleteBtn.className = 'delete'
    deleteBtn.addEventListener("click", function(event) {
        var notif = event.target.closest('.notification')
        notif.remove()
    })
    errorEl.appendChild(deleteBtn)
    document.getElementById("home").appendChild(errorEl);
}

// Lists a meal in search results
var listMeal = function(meal) {
    var mealEl = document.createElement('li');
    mealEl.className = 'meal-item'
    var mealDescription = document.createElement('p');
    mealDescription.textContent = meal.strMeal;
    var addBtn = document.createElement("button")
    addBtn.textContent = 'Add to My Meals'
    addBtn.classList = 'button list-btn is-primary js-modal-trigger'
    addBtn.value = meal.idMeal
    addBtn.id = meal.idMeal
    var viewBtn = document.createElement('button');
    viewBtn.value = meal.idMeal

    viewBtn.addEventListener("click", function(event) {
        event.stopPropagation()
        event.preventDefault()
        findMealById(viewBtn.value, "display")
    })
    addBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        findMealById(addBtn.value, "action")
        mealEl.remove()
    })
    document.getElementById('meal-list').appendChild(mealEl)

    viewBtn.textContent = 'View Meal';
    viewBtn.classList = "button list-btn is-secondary js-modal-trigger";
    viewBtn.setAttribute('data-target', 'modal-js-example');

    mealEl.appendChild(mealDescription)
    mealEl.appendChild(viewBtn)
    mealEl.appendChild(addBtn)
}

// Adds a meal to My Meals and its ingredients to Grocery List
var addMeal = function(newMeal) {
    var storedMeals = localStorage.getItem('mymeals');
    if (!storedMeals) {
        var myMeals = [newMeal]
        localStorage.setItem('mymeals', JSON.stringify(myMeals))
        displayMessage(newMeal.strMeal + " was added to My Meals!", "is-success")
        getIngredients(newMeal, 'add')
    }
    else {
        storedMeals = JSON.parse(storedMeals)
        for (var i = 0; i<storedMeals.length; i++) {
            if (storedMeals[i].strMeal == newMeal.strMeal) {
                displayMessage(newMeal.strMeal + ' is already a part of My Meals!', 'is-danger')
                return
            }
            else {
                storedMeals.push(newMeal)
                localStorage.setItem('mymeals', JSON.stringify(storedMeals))
                displayMessage(newMeal.strMeal + " was added to My Meals!", "is-success")
                getIngredients(newMeal, 'add')
                return
            }
        }
    }
}

// Collects the ingredients of a meal into an array of ingredient strings
var getIngredients = function(newMeal, action) {
    var ingredients = []
    for (var i=1; i<=20;i++) {
        var ing = newMeal['strMeasure' + i.toString()]
        if (ing == "") {
            break;
        }
        else {
            var NewIngredient = ing + " " + newMeal['strIngredient' + i.toString()]
            ingredients.push(NewIngredient)
        }
    }
    if (action == 'display') {
        for (var j = 0; j<ingredients.length; j++) {
            listIngredient(ingredients[j])
        }
    }
    else {
        parseIngredients(ingredients)
    }
}

// Uses the Zestful API to obtain parsed ingredient objects for easy display on the Grocery List
var parseIngredients = function(ingredients) {
    ingObj = {
        ingredients: ingredients
    }
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Host': 'zestful.p.rapidapi.com',
            'X-RapidAPI-Key': 'ac41873004msh5ff343bad4a27ebp124960jsn46c5571a837e'
        },
        body: JSON.stringify(ingObj)
    };
    fetch('https://zestful.p.rapidapi.com/parseIngredients', options)
        .then(response => response.json())
        .then(response => handleResponse(response))
}

// Handles the Zestful API response by generating a list of ingredient objects to add to local storage
var handleResponse = function(response) {
    var newIngredients = response.results
    var newIngArr = []
    for (var i = 0; i <newIngredients.length; i++) {
        if (newIngredients[i].ingredientParsed.quantity) {
            newIngObj = {
                quantity: newIngredients[i].ingredientParsed.quantity,
                unit: newIngredients[i].ingredientParsed.unit,
                preparationNotes: newIngredients[i].ingredientParsed.preparationNotes,
                product: newIngredients[i].ingredientParsed.product
            }
            newIngArr.push(newIngObj)
        }
    }
    var storedIng = localStorage.getItem('grocery');
    if (storedIng) {
        storedIng = JSON.parse(storedIng)
        newArr = storedIng.concat(newIngArr)
        localStorage.setItem('grocery', JSON.stringify(newArr))
    }
    else {
        localStorage.setItem('grocery', JSON.stringify(newIngArr))
    }
}

// Lists ingredients on the presented modal
var listIngredient = function(ingredient) {
    var ingList = document.getElementById("ing-list")
    var ingEl = document.createElement("li")
    ingEl.textContent = ingredient
    ingList.appendChild(ingEl)
}

// Searches the MealDB API for a meal based on the meal ID presented in the meal search
var findMealById = function(mealID, action) {
    fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealID)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                meal = data.meals[0]
                if (action == 'display') {
                    fillModal(meal)
                }
                else {
                    addMeal(meal)
                }
            })
        }
    })
}

// Fills a modal with information about the given meal
var fillModal = function(meal) {
    mealImg = meal.strMealThumb
    document.getElementById('modal-img').setAttribute('src', mealImg)
    
    mealDesc = meal.strMeal
    mealIns = meal.strInstructions
    
    document.getElementById('meal-desc').textContent = mealDesc
    document.getElementById('meal-ins').textContent = mealIns
    initModal()
    getIngredients(meal, "display")
}

// Initializes the modal by adding the 'is-active' class
var initModal = function() {
    var background = document.querySelector('.modal-background')
    var modalClose = document.querySelector('.modal-close')
    var modal =document.querySelector('.modal')
    modal.classList.add('is-active')

    modalClose.addEventListener("click", function() {
        modal.classList.remove('is-active')
    })
    background.addEventListener("click", function() {
        modal.classList.remove('is-active')
    })
}

// Clears the search results
var clearSearch = function() {
    var mealList = document.querySelector('#meal-list')
    while (mealList.firstChild) {
        mealList.removeChild(mealList.firstChild);
    }
}

selectTypeEl.addEventListener("change", function() {
    type = selectTypeEl.value;
    if (type == 'area') {
        searchInputEl.setAttribute('placeholder', 'e.g. Canadian, Mexican, etc.')
    }
    else if (type == 'category') {
        searchInputEl.setAttribute('placeholder', 'e.g. seafood, vegetarian, etc.')
    }
    else {
        searchInputEl.setAttribute('placeholder', 'e.g. chicken, broccoli, etc.')
    }
})

searchForm.addEventListener("submit", function(event) {
    event.preventDefault()
    clearSearch()
    getMeals(searchInputEl.value, selectTypeEl.value)
})

