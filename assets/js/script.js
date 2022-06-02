// Types = 
var searchInputEl = document.getElementById('search-input')
var selectTypeEl = document.getElementById('type-select')

input = 'chicken';
type = 'area';

var getMeals = function(input, type) {
    if (type == 'category') {
        url = 'www.themealdb.com/api/json/v1/1/filter.php?c=' + input;
    }
    else if (type == 'area') {
        url = 'www.themealdb.com/api/json/v1/1/filter.php?a=' + input;
    }
    else {
        url = 'www.themealdb.com/api/json/v1/1/filter.php?i=' + input;
    }
    fetch(url)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            })
        }
        else {
            alert("No Results Found") // switch alert to modal or return message
        }
    })
    .catch(function(error) {
        alert("Error") // switch alerts to modals
})
}


selectTypeEl.addEventListener("change", function() {
    type = selectTypeEl.value;
    if (type == 'area') {
        searchInputEl.setAttribute('placeholder', 'e.g. Canadian, European, etc.')
    }
    else if (type == 'category') {
        searchInputEl.setAttribute('placeholder', 'e.g. seafood, vegetarian, etc.')
    }
    else {
        searchInputEl.setAttribute('placeholder', 'e.g. chicken, broccoli, etc.')
    }
})