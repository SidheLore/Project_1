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


var displayResults = function(mealsArr) {
    for (var i = 0; i<mealsArr.length; i++) {
        listMeal(mealsArr[i])
    }
}


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


var listMeal = function(meal) {
    var mealEl = document.createElement('li');
    mealEl.className = 'meal-item'
    var mealDescription = document.createElement('p');
    mealDescription.textContent = meal.strMeal;
    var addBtn = document.createElement("button")
    addBtn.textContent = 'Add to My Meals'
    addBtn.classList = 'button list-btn is-primary js-modal-trigger'
    addBtn.value = meal.idMeal
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
    })
    document.getElementById('meal-list').appendChild(mealEl)

    viewBtn.textContent = 'View Meal';
    viewBtn.classList = "button list-btn is-secondary js-modal-trigger";
    viewBtn.setAttribute('data-target', 'modal-js-example');

    mealEl.appendChild(mealDescription)
    mealEl.appendChild(viewBtn)
    mealEl.appendChild(addBtn)
}

async function addMeal(newMeal) {
    var storedMeals = localStorage.getItem('mymeals');
    if (!storedMeals) {
        var myMeals = [newMeal]
        localStorage.setItem('mymeals', JSON.stringify(myMeals))
        displayMessage(newMeal.strMeal + " was added to My Meals!", "is-success")
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
                return
            }
        }
    }
}




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
        else {
            alert("No Results Found") // switch alert to modal or return message
        }
    })
}

searchForm.addEventListener("submit", function(event) {
    event.preventDefault()
    clearSearch()
    getMeals(searchInputEl.value, selectTypeEl.value)
})


var fillModal = function(meal) {
    mealImg = meal.strMealThumb
    document.getElementById('modal-img').setAttribute('src', mealImg)
    
    mealDesc = meal.strMeal
    mealIns = meal.strInstructions
    
    document.getElementById('meal-desc').textContent = mealDesc
    document.getElementById('meal-ins').textContent = mealIns
    initModal()
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

var clearSearch = function() {
    var mealList = document.querySelector('#meal-list')
    while (mealList.firstChild) {
        mealList.removeChild(mealList.firstChild);
    }
}




