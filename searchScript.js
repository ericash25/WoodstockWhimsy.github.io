// Search Java Script
// Description: Load list of tags used in recipes
// Created 3/9/2026 by Eric Ashenfelter
// Last updated 3/9/2026 by Eric Ashenfelter

// options:

var shortenURLs = false;


// create markdown converter
// var md = new showdown.Converter();

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

// a little function to get only the domain from a full url
// https://stackoverflow.com/a/8498668/1167783
function getDomain(url) {
	var a = document.createElement('a');
	a.href = url;
	return a.hostname;
}

// ChatGPT's search page solution

document.addEventListener("DOMContentLoaded", function () {

let tagData = {};
let allRecipes = [];

const tagSection = document.getElementById("tagSection");
const resultsSection = document.getElementById("searchResults");
const resultsList = document.getElementById("results");
const tagList = document.getElementById("tagList");
const searchBarInput = document.getElementById("searchBarInput");
const suggestionsBox = document.getElementById("searchSuggestions");
const backButton = document.getElementById("backButton");

fetch("tags.json")
.then(res => res.json())
.then(data => {

    tagData = data;

    buildRecipeIndex();
    buildTagList();
    checkURLTag();

});

function buildRecipeIndex() {
    const seen = new Set();

    Object.values(tagData).forEach(recipeList => {
        recipeList.forEach(recipe => {

            if(!seen.has(recipe.title)) {
                allRecipes.push(recipe);
                seen.add(recipe.title);
            }
        });
    });
}


function buildTagList(){

    const tags = Object.keys(tagData).sort();

    tags.forEach(tag => {

        const li = document.createElement("li");

        const link = document.createElement("a");

        link.href = `search.html?tag=${tag}`;
        link.textContent = tag;

        link.addEventListener("click", function(e){
            e.preventDefault();
            showResults(tagData[tag], `Category: ${tag}`);
            history.replaceState({}, "", `search.html?tag=${tag}`);
        });

        li.appendChild(link);
        tagList.appendChild(li);

    });

}


function showResults(recipeList, tagName=null){

    tagSection.classList.add("hidden");
    resultsSection.classList.remove("hidden");

    resultsList.innerHTML = "";

    if(tagName){
        const header = document.createElement("h2");
        header.innerHTML = `${tagName} (${recipeList.length})`;
        resultsList.appendChild(header);
    }

    recipeList.forEach(recipe => {

        const li = document.createElement("li");
        
        li.innerHTML = `
        <div class="recipeCard">
            <a href="recipepage.html?recipe=${recipe.slug}">
                <h3>${recipe.title}</h3>
            </a>
        </div>
        `;
        /*
        const link = document.createElement("a");
        link.href = recipe.file;
        link.textContent = recipe.title;

        li.appendChild(link);
        */
        resultsList.appendChild(li);

    });

}


function checkURLTag(){

    const params = new URLSearchParams(window.location.search);

    const tag = params.get("tag");

    if(tag && tagData[tag]){
        showResults(tagData[tag], `Category: ${tag}`);
    }

}


searchBarInput.addEventListener("input", function(){

    const query = this.value.toLowerCase();

    if(query.length === 0){
        suggestionsBox.classList.add("hidden");
        resultsSection.classList.add("hidden");
        tagSection.classList.remove("hidden");
        return;
    }

    const matches = allRecipes
        .filter(r => r.title.toLowerCase().includes(query))
        .slice(0,6);
    
    suggestionsBox.innerHTML = "";

    matches.forEach(recipe => {
        const div = document.createElement("div");

        div.innerText = recipe.title;

        div.onclick = () => {
            window.location.href = recipe.file;
        };

        suggestionsBox.appendChild(div);
    });

    
    suggestionsBox.classList.remove("hidden");

    const results = allRecipes.filter(r =>
        r.title.toLowerCase().includes(query)
    );

    showResults(results, `Search: "${query}"`);
});

/* Hide search suggestions if Enter key is pressed */
searchBarInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        suggestionsBox.classList.add("hidden");
    }
});

/* Hide search suggestions if click outside of input */
searchBarInput.addEventListener('click', function(e) {
    if (!WebTransportDatagramDuplexStream.contains(e.target)) {
        suggestionsBox.classList.add("hidden");
    }
});


backButton.addEventListener("click", function(){

    resultsSection.classList.add("hidden");
    tagSection.classList.remove("hidden");

    resultsList.innerHTML = "";
    searchBarInput.value = "";

    history.replaceState({}, "", "search.html");

});

});


/*
// Load list of tags from tags.JSON file

$(document).ready(async function() {
    const tagFile = await (await fetch("tags.json")).json();

    let listOfTags = '';

    for (i in tagFile) {
        let tag = tagFile[i];
        console.log(tag)
        listOfTags += '<li><a href="tag'
    }

    $('tagList').html(listOfTags);
    
});

*/

