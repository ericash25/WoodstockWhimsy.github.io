// script.js
// Description: loads recipes from recipes.json to use on the website.
// Created 2/27/2026 by Eric Ashenfelter
// Last updated 2/27/2026 by Eric Ashenfelter


// found here: https://gomakethings.com/fixing-safaris-back-button-browser-cache-issue-with-vanilla-js/
/**
* If browser back button was used, flush cache
* This ensures that user will always see an accurate, up-to-date view based on their state
* https://stackoverflow.com/questions/8788802/prevent-safari-loading-from-cache-when-back-button-is-clicked
*/

window.onpageshow = function(event) {
    if (event.persisted) {
		window.location.reload();
	}
};

async function loadRecipeList() {

    const response = await fetch('recipes.json');
    const recipes = await response.json();

    recipes.sort((a,b)=>a.title.localeCompare(b.title));

    let listHTML = "";
    let letterHTML = "";
    let prevLetter = "";

    /*const list = document.getElementById('recipe-list');*/

    recipes.forEach(recipe => {
        const name = recipe.title;
        const slug = recipe.slug;

        const firstLetter = name.charAt(0).toUpperCase();

        if (firstLetter !== prevLetter) {
            listHTML += `<li id="${firstLetter}">`;
            letterHTML += `<a href="#${firstLetter}" class="letters">${firstLetter}</a>`;
        }

        else {
            listHTML += "<li>";
        }

        listHTML += `<a href="recipePage.html?recipe=${slug}">${name}</a></li>`;

        prevLetter = firstLetter;
        
    });

    document.getElementById("recipe-list").innerHTML = listHTML;
    document.getElementById("letter-filter").innerHTML = letterHTML;
}

loadRecipeList()

/*
async function loadRecipe(filename) {
    const response = await fetch('recipes/${filename}');
    const markdown = await response.text();

    const html = marked.parse(markdown);

    document.getElementById('recipe-container').innerHTML = html;

}

// My version of getting list of recipes from JSON file
$(document).ready(async function() {
    const files = await (await fetch("recipes.json")).json();
    files.sort();

    let listOfRecipes = '';
    let listOfLetters = '';
    let prevLetter = '';

    for (i in files) {
        let url = files[i].file;
        let anchor = url.replace('.md', '');
        let name = files[i].title;
        let firstLetter = name.charAt(0);
        if (firstLetter != prevLetter) {
            listOfRecipes += '<li id="' + firstLetter + '">';
            listOfLetters += '<a href="#' + firstLetter + '" class="letters">' + firstLetter + '</a>';
        }
        else {
            listOfRecipes += '<li>';
        }
        listOfRecipes += '<a href="recipepage.html#' + anchor + '">' + name + '</a></li>';
        prevLetter = firstLetter;
    }
    $('#recipe-list').html(listOfRecipes);
    $('#letter-filter').html(listOfLetters);
    //$('#footer').prepend(nameToLink(randFile, 'random') + '<br>');
});
*/

/*
// Code from github to load list of recipes from JSON file
$(docuement).ready(async function() {
    // Get JSON file with list of recipes and sort them
    var files = await (await fetch("recipes.json")).json();
    files.sort();

    var randFile = files[Math.floor(Math.random() * files.length)];

    var listOfRecipes = '';
    var listOfLetters = '';
    var prevLetter = '';
    for (var i in files) {
        var url = files[i];
        console.log(url);
        var anchor = url.replace('.md', '');
        var name = anchor.split('-').join(' ');
        var firstLetter = name.charAt(0).toUpperCase();
        if (firstLetter != prevLetter) {
            listOfRecipes += '<li id="' + firstLetter + '">';
            listOfLetters += '<a href="#' + firstLetter + '">' + firstLetter + '</a>';
        }
        else {
            listOfRecipes += '<li>';
        }
        listOfRecipes += '<a href="recipepage.html#' + anchor + '">' + name + '</a></li>';
        prevLetter = firstLetter;
    }
    $('#recipe-list').html(listOfRecipes);
    $('#navigation').html(listOfLetters);
    $('#footer').prepend(nameToLink(randFile, 'random') + '<br>');
});
*/

/*
// handy function to create links in the markdown text
// via: https://stackoverflow.com/a/3890175/1167783
function linkify(str) {
	// urls starting with http://, https://, or ftp://
	var httpPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
	str = str.replace(httpPattern, '<a href="$1" target="_blank">$1</a>');

	// urls starting with "www." (without // before it, or it'd re-link the ones done above)
	var wwwPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
	str = str.replace(wwwPattern, '$1<a href="http://$2" target="_blank">$2</a>');

	// change email addresses to mailto: links
	var emailPattern = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
	str = str.replace(emailPattern, '<a href="mailto:$1">$1</a>');

	return str;
}

function nameToLink(fileName, name) {
	var anchor = fileName.replace('.md', '');
	return '<a href="recipe.html#' + anchor + '">' + name + '</a></li>';
}
*/