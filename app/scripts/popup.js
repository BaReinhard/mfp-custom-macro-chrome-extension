'use strict';

function syncData() {
    chrome.storage.local.get(['authorization',"mfp-user-id", "protein","fat","carbs", 'calories', 'macro_data'], function(headers) {
                console.log(headers);
                let data = parseData(JSON.parse(headers.macro_data), headers.protein, headers.fat, headers.carbs, headers.calories)
                let xhttp = new XMLHttpRequest();
                xhttp.open("POST", "https://api.myfitnesspal.com/v2/nutrient-goals", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.setRequestHeader("Authorization", headers.authorization);
                xhttp.setRequestHeader("mfp-user-id", headers['mfp-user-id']);
                xhttp.setRequestHeader("mfp-client-id", "mfp-main-js");
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this)
                    }
                };
                xhttp.send(JSON.stringify(data));
            
        
        
    });
}

function parseData(data, protein, fat, carbs, calories) {
    data.item.default_goal.energy.value = calories;
    data.item.default_goal.protein = protein;
    data.item.default_goal.fat = fat;
    data.item.default_goal.carbohydrates = carbs;
    data.item.daily_goals = data.item.daily_goals.map(goal=>{
        goal.calories = calories;
        goal.protein = protein;
        goal.fat = fat;
        goal.carbohydrates = carbs;
        return goal;
    })
    return data;
}

document.addEventListener('DOMContentLoaded', function() {
    var submit = document.getElementById('submit');
    submit.addEventListener('click', function() {
        console.log("clicked")
        let protein = document.getElementById("protein").value;
        let fat = document.getElementById("fat").value;
        let calories = document.getElementById('calories').value;
        let carbs = document.getElementById('carbs').value
        chrome.storage.local.set({protein,fat,calories,carbs}, function() {
            console.log("completed")
            syncData();
          });
    })
});