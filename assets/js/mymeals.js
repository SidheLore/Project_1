// FROM BULMA: Adds navbar menu dropdown functionality 
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
var listMeal = function(meal) {
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
        fillModal(meal, 'meal')
    })
    rmvBtn.addEventListener('click', function(event) {
        event.stopPropagation()
        event.preventDefault()
        var storedMeals = JSON.parse(localStorage.getItem('mymeals'));
        for (var i = 0; i<storedMeals.length; i++) {
            if (storedMeals[i].idMeal == meal.idMeal) {
                storedMeals.splice(i, 1)
            }
        }
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
var fillModal = function(object, action) {
    if (action == 'meal') {
        var mealImg = object.strMealThumb
        document.getElementById('modal-img').setAttribute('src', mealImg)
        
        var mealDesc = object.strMeal
        var mealIns = object.strInstructions
        
        document.getElementById('meal-desc').textContent = mealDesc
        document.getElementById('meal-ins').textContent = mealIns
        initModal('meal-modal');
        getIngredients(object);
    }
    else {
        if (action == 'edit') {
            document.getElementById("quantity").value = object.quantity

            document.getElementById("unit").value = object.unit

            document.getElementById("prep-notes").value = object.preparationNotes

            document.getElementById("product").value = object.product
        }
        else {
            document.getElementById("quantity").value = null

            document.getElementById("unit").value = null

            document.getElementById("prep-notes").value = null

            document.getElementById("product").value = null

            document.getElementById("quantity").placeholder = object.quantity

            document.getElementById("unit").placeholder = object.unit

            document.getElementById("prep-notes").placeholder = object.preparationNotes

            document.getElementById("product").placeholder = object.product
        }

        var saveBtn = document.getElementById("save-ingredient")
        saveBtn.onclick = function(event) {
            event.stopPropagation()
            var updatedIngredient = {
                quantity: document.getElementById("quantity").value,
                unit: document.getElementById("unit").value,
                preparationNotes: document.getElementById("prep-notes").value,
                product: document.getElementById("product").value
            }
            if (action == 'edit') {
                var groceries = localStorage.getItem('grocery')
                groceries = JSON.parse(groceries)
                var location = parseInt(saveBtn.name);
                groceries[location] = updatedIngredient;
                localStorage.setItem('grocery', JSON.stringify(groceries))
                getGroceries()
            }
            else if (action == 'new') {
                var groceries = localStorage.getItem('grocery')
                if (groceries) {
                    groceries = JSON.parse(groceries);
                    var newItem = [];
                    newItem.push(updatedIngredient)
                    groceries = newItem.concat(groceries)
                }
                else {
                    groceries = []
                    groceries.push(updatedIngredient)
                }
                localStorage.setItem('grocery', JSON.stringify(groceries))
                getGroceries()
            }
            document.getElementById('ingredient-modal').classList.remove('is-active')

        }
        initModal('ingredient-modal')

    }
}

// Initializes the modal with the 'is-active' class
var initModal = function(modalID) {
    var modal = document.getElementById(modalID)
    var background = document.getElementById(modalID + '-background')
    var modalClose = document.getElementById(modalID + '-close')
    modal.classList.add('is-active')

    modalClose.addEventListener("click", function() {
        modal.classList.remove('is-active')
    })
    background.addEventListener("click", function() {
        modal.classList.remove('is-active')
    })
    if (modalID == 'ingredient-modal') {
        document.getElementById('cancel-ingredient').addEventListener("click", function() {
            modal.classList.remove('is-active')
        })
    }
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
    var groceryTable = document.getElementById("grocery-table")
    while (groceryTable.firstChild) {
        groceryTable.firstChild.remove()
    }
    var grocery = localStorage.getItem('grocery')
    if (grocery) {
        grocery = JSON.parse(grocery)
        for (var i = 0; i<grocery.length; i++) {
            listGrocery(grocery[i], i)
        }
    }
}

// Lists grocery items
var listGrocery = function(item, i) {
    var itemRow = document.createElement("tr")
    itemRow.className = "item-row"
    itemRow.id = i.toString()

    var selectEl = document.createElement("td")
    var select = document.createElement("input")
    select.type = "checkbox"
    select.id = 'check-' + i.toString();
    select.className = 'select-ing'
    selectEl.appendChild(select)
    itemRow.appendChild(selectEl)
    itemRow.onclick = function() {
        if (select.checked) {
            select.checked = false;
        }
        else {
            select.checked = true;
        }
    }
    
    var quantity = document.createElement("td")
    if (item.quantity) {
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

    var actionsEl = document.createElement("td")
    var remove = document.createElement("button")
    remove.textContent = "Remove"
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
    actionsEl.appendChild(remove)

    var editBtn = document.createElement("button")
    editBtn.className = 'button'
    editBtn.textContent = 'Edit'
    editBtn.addEventListener("click", function(event) {
        event.stopPropagation()
        event.preventDefault()
        document.getElementById('save-ingredient').name = i.toString()
        fillModal(item, "edit")
        initModal('ingredient-modal')
    })
    actionsEl.appendChild(editBtn);
    

    itemRow.appendChild(actionsEl)
    document.getElementById("grocery-table").appendChild(itemRow)
}

// Removes all selected ingredients
var removeSelected = function() {
    var groceries = JSON.parse(localStorage.getItem('grocery'))
    var newGroceries = []
    for (var i = 0; i<groceries.length;i++) {
        if (!(document.getElementById('check-' + i.toString()).checked)) {
            newGroceries.push(groceries[i])
        }
    }

    if (newGroceries.length == 0) {
        localStorage.removeItem('grocery')
    }
    else {
        localStorage.setItem('grocery', JSON.stringify(newGroceries))
    }
    getGroceries()
}

document.getElementById('add-item').addEventListener('click',  function(event) {
    event.stopPropagation()
    event.preventDefault()
    var object = {
        quantity: 'Quantity',
        unit: 'Unit',
        preparationNotes: 'Preparation Notes',
        product: 'Product'
    }
    fillModal(object, 'new')
})

getGroceries()
getMyMeals()