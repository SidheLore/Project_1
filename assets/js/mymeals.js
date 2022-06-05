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

// Retrieves My Meals from local storage
var getMyMeals = function() {
    var myMeals = localStorage.getItem('mymeals');
    if (myMeals) {
        myMeals = JSON.parse(myMeals);
        for (var i = 0; i<myMeals.length;i++) {
            listMeal(myMeals[i])
        }
    }
}

// Lists all My Meals in the My Meals section
var listMeal = function(meal, i) {
    var mealEl = document.createElement('li');
    mealEl.className = 'meal-item'
    var mealDescription = document.createElement('p');
    mealDescription.textContent = meal.strMeal;
    var rmvBtn = document.createElement("button")
    rmvBtn.textContent = 'Remove from My Meals'
    rmvBtn.classList = 'button list-btn is-primary js-modal-trigger'
    var viewBtn = document.createElement('button');
    viewBtn.value = meal.idMeal

    viewBtn.addEventListener("click", function(event) {
        event.stopPropagation()
        event.preventDefault()
        fillModal(meal)
    })
    rmvBtn.addEventListener('click', function(event) {
        event.stopPropagation()
        event.preventDefault()
        var storedMeals = JSON.parse(localStorage.getItem('mymeals'));
        storedMeals.splice(i, 1)
        if (storedMeals.length == 0) {
            localStorage.removeItem('mymeals')
        }
        else {
            localStorage.setItem('mymeals', JSON.stringify(storedMeals))
        }

        mealEl.remove()
    })

    viewBtn.textContent = 'View Meal';
    viewBtn.classList = "button list-btn is-secondary js-modal-trigger";
    viewBtn.setAttribute('data-target', 'modal-js-example');

    mealEl.appendChild(mealDescription)
    mealEl.appendChild(viewBtn)
    mealEl.appendChild(rmvBtn)

    document.getElementById('my-meals-list').appendChild(mealEl)

}

// Fills the modal with meal information if the View Meal button is selected
var fillModal = function(meal) {
    mealImg = meal.strMealThumb
    document.getElementById('modal-img').setAttribute('src', mealImg)
    
    mealDesc = meal.strMeal
    mealIns = meal.strInstructions
    
    document.getElementById('meal-desc').textContent = mealDesc
    document.getElementById('meal-ins').textContent = mealIns
    initModal()
    getIngredients(meal)
}

// Initializes the modal with the 'is-active' class
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

// Finds the ingredients of a meal and sends them to the list ingredient function
var getIngredients = function(newMeal) {
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
    for (var j = 0; j<ingredients.length; j++) {
        listIngredient(ingredients[j])
    }
}

// Lists ingredients on the presented modal
var listIngredient = function(ingredient) {
    var ingList = document.getElementById("ing-list")
    var ingEl = document.createElement("li")
    ingEl.textContent = ingredient
    ingList.appendChild(ingEl)
}

// Gets the grocery list
var getGroceries = function() {
    var grocery = localStorage.getItem('grocery')
    if (grocery) {
        grocery = JSON.parse(grocery)
        for (var i = 0; i<grocery.length; i++) {
            listGrocery(grocery[i])
        }
    }
}

// Lists grocery items
var listGrocery = function(item) {
    var itemRow = document.createElement("tr")
    itemRow.className = "item-row"

    var quantity = document.createElement("td")
    if (item.quantity != null) {
        quantity.textContent = item.quantity
    }
    itemRow.appendChild(quantity)

    var unit = document.createElement("td")
    unit.textContent = item.unit
    itemRow.appendChild(unit)

    var preparationNotes = document.createElement("td")
    preparationNotes.textContent = item.preparationNotes
    itemRow.appendChild(preparationNotes)

    var product = document.createElement("td")
    product.textContent = item.product
    itemRow.appendChild(product)

    var removeEl = document.createElement("td")
    var remove = document.createElement("button")
    remove.textContent = "Remove Item"
    remove.classList = "button is-danger";
    remove.id = item.product
    remove.addEventListener("click", function(event) {
        event.stopPropagation();
        event.preventDefault()
        var list = JSON.parse(localStorage.getItem('grocery'))
        for (var i = 0;i<list.length; i++) {
            if (list[i].product == event.target.id) {
                list.splice(i, 1)
                break;
            }
        }
        if (list.length == 0) {
            localStorage.removeItem('grocery')
        }
        else {
            localStorage.setItem('grocery', JSON.stringify(list))
        }
        event.target.closest('.item-row').remove()
    })
    removeEl.appendChild(remove)
    itemRow.appendChild(removeEl)
    document.getElementById("grocery-table").appendChild(itemRow)
}
getGroceries()
getMyMeals()