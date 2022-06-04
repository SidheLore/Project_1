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

var getMyMeals = function() {
    var myMeals = localStorage.getItem('mymeals');
    if (myMeals) {
        myMeals = JSON.parse(myMeals);
        for (var i = 0; i<myMeals.length;i++) {
            listMeal(myMeals[i])
        }
    }
}

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
        console.log(meal)
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

var fillModal = function(meal) {
    mealImg = meal.strMealThumb
    document.getElementById('modal-img').setAttribute('src', mealImg)
    
    mealDesc = meal.strMeal
    mealIns = meal.strInstructions
    
    document.getElementById('meal-desc').textContent = mealDesc
    document.getElementById('meal-ins').textContent = mealIns
    initModal()
}

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

getMyMeals()