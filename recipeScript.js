// Recipe List Java Script
// Description: Load all markdown files from recipes folder to use for website.
// Created 2/27/2026 by Eric Ashenfelter
// Last updated 2/27/2026 by Eric Ashenfelter



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

async function loadRecipe() {
    
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("recipe");

    if (!slug) {
        window.location.href = "./";
        return
    }

    try {
        const response = await fetch(`recipes/${slug}.json`);
        const recipe = await response.json();

        document.title = recipe.title + " | Woodstock Whimsy";

        document.getElementById("title").innerHTML = `<h1>${recipe.title}</h1>`;
        document.getElementById("info").innerHTML = linkify(recipe.info_html);
        document.getElementById("ingredients").innerHTML = linkify(recipe.ingredients_html);
        document.getElementById("steps").innerHTML = linkify(recipe.steps_html);
        document.getElementById("notes").innerHTML = linkify(recipe.notes_html);
        document.getElementById("basedon").innerHTML = linkify(recipe.basedon_html);

        // Ingredients checkboxes
        document.querySelectorAll("#ingredients li").forEach(li => {
            li.innerHTML = `<label><input type="checkbox"> ${li.innerHTML}</label>`
        });

        // Steps checkboxes
        document.querySelectorAll("#steps li").forEach(li => {
            li.innerHTML = `<input type="checkbox" class="step-check"> ${li.innerHTML}`
        });
    } 
    
    catch(e) {
        window.location.href = "./"
    }
}

loadRecipe();


/*
// options:

var shortenURLs = false;

// create markdown converter
var md = new showdown.Converter();

// a little function to get only the domain from a full url
// https://stackoverflow.com/a/8498668/1167783
function getDomain(url) {
	var a = document.createElement('a');
	a.href = url;
	return a.hostname;
}

// My version of loading recipe from file

$(document).ready(function() {
    // Get recipe name from url link
    let filename = window.location.hash;
    filename = filename.replace('#', '');
    filename = 'recipes/' + filename + '.md';

    // Load recipe from file
    $.ajax({
        url: filename,
        success: function(recipe) {
            // Convert markdown to html, split into sections
            recipe = md.makeHtml(recipe);
            let sections = recipe.split('<h');

            // Iterate sections and add to body
            let foundTitle = false;
            for (let i in sections) {
                // Get from array, add start of header tag back in
                let section = sections[i];
                section = '<h' + section;

                // Regex to get id from header (auto-added by the markdown parser)
                let idPattern = new RegExp('id="(.*?)"');
                let id = idPattern.exec(section);

                // If no match (happens at the start of the file for some reason), just skip
                if (id === null) {
                    continue;
                }

                // Remove id from header (for css later)
                section = section.replace(idPattern, '');

                // If this is the first non-null match, add 'title' id instead of the recipe name
                if (!foundTitle) {
                    id = 'title';
                    foundTitle = true;

                    // Change page title
                    let elems = $(section);
                    let pageTitle = elems[0].innerHTML + ' | Woodstock Whimsy';
                    $(document).prop('title', pageTitle);
                }
                // For all others, get id from regex match
                else {
                    id = id[1];
                }
                // Make any urls into links
                section = linkify(section);

                // Convert ingredients list items into checkboxes
                if (id.toLowerCase() === "ingredients") {
                    section = section.replace(/<li>(.*?)<\/li>/g, function(match, item) {
                        return `<li><label><input type="checkbox"> ${item}</label></li>`;
                    });
                }
                
                // Convert ordered steps list into checkboxes and numbers
                if (id.toLowerCase() === "steps") {
                    section = section.replace(/<li>(.*?)<\/li>/g, function(match, item) {
                        return `
                            <li class="step-item">
                                <input type="checkbox" class="step-check">
                                <span class="step-text">${item}</span>
                            </li>
                        `;
                    });
                }

                //Place html inside its section
                $('#' + id).html(section);
            }
            
            // Nicen things up

            // Add time and quantity labels in info section
            var time = $('#info li:eq(0)');
            var makes = $('#info li:eq(1)');
            $('#info ul').html('<li><span id="time">TIME: </span>' + time.text() + '</li><li><span id="makes">MAKES: </span>' + makes.text() + '</li>');

            // Load recipe images
            let recipeName = window.location.hash.replace('#', '');
            let imgFolder = 'images/';
            let imgExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

            // Try sequential image names
            let imgIndex = 1;

            function tryLoadImage() {
                let foundAny = false;
                imgExtensions.forEach(ext => {
                    let imgPath = `${imgFolder}${recipeName}-img-${imgIndex}.${ext}`;

                    // Check if image exists
                    $.ajax({
                        url: imgPath,
                        type: 'HEAD',
                        success: function() {
                            // If found, append it
                            $('#recipe-img').append(
                                `<img src="${imgPath}" alt="${recipeName} image ${imgIndex}" class="recipe-photo">`
                            );
                            foundAny = true;
                        }
                    });
                });

                // If at least one index matched, try next index
                if (foundAny) {
                    imgIndex++;
                    setTimeout(tryLoadImage, 100);  // small delay to allow for async HEAD checks
                }
            }

            // Start checking for images
            tryLoadImage();
        },


        // If no recipe listed or some problem, redirect to main page
        error: function() {
            window.location.href = './';
        }
    });
});
*/


/*
// Github version of loading recipe from file
// once document is loaded, load recipe from file
$(document).ready(function() {
    console.log('starting function');
    // extract which recipe from url anchor
    var filename = window.location.hash;
    console.log('filename initalized');
    filename = filename.replace('#', '');
    console.log('replaced hash');
    filename = 'recipes/' + filename + '.md';
    console.log('added .md');

    // load the recipe
    $.ajax({
        url: filename,
        success: function(recipe) {
            console.log(`Loading: {recipe}`);
            //convert markdown to html, split into sections
            recipe = md.makeHtml(recipe);
            var sections = recipe.split('<h');

            // iterate sections, add to body
            var foundTitle = false;
            for (var i in sections) {
                // get from array, add start of header tag back in
                var section = sections[i];
                section = '<h' + section;

                // regex to get id from header (auto-added by the markdown parser)
                var idPattern = new RegExp('id="(.*?)"');
                var id = idPattern.exec(section);

                // if no match (happens at the start of the file), just skip
                if (id === null) {
                    continue;
                }

                // remove id from header (for css later)
                section = section.replace(idPattern, '');
                
                // if this is the first non-null match, add 'title' id instead of the recipe name
                if (!foundTitle) {
                    id = 'title';
                    foundTitle = true;

                    // change page title too
                    var elems = $(section);
                    var pageTitle = elems[0].innerHTML + ' | Woodstock Whimsy'
                    $(document).prop('title', pageTitle);
                }
                // for all others, get id from regex match
                else {
                    id = id[1];
                }

                // make any urls into links
                section = linkify(section);

                // place the html inside its sections
                $('#' + id).html(section);
            }

            // a few more bits to nice things up

            // opt: remove cruft from 'based on' links
            if (shortenURLs) {
                $('#basedon a').each( function() {
                    var url = $(this).text();
                    url = getDomain(url);
                    $(this).text(url);
                });
            }

            // in the ingredients, make things in parentheses a bit lighter
            $('#ingredients li').each( function() {
                var str = $(this).text();
                str = str.replace(/\(([^)]+)\)/g, '<span class="paren">($1)</span>');
                $(this).html(str);
            });

            // in info, add labels to time/quantity
            var time = $('#info li:eq(0)');
            var makes = $('#info li:eq(0)');
            $('#info ul').html('<li><span id="time">TIME </span>' + time.text() + '</li><li><span id="makes">MAKES </span>' + makes.text() + '</li>');

            // add some links re the recipes
            var recipeName = $('h1').text().toLowerCase();
            recipeName = recipeName.replace(' ', '+');

            // link icon svg code
            // via: https://fontawesome.com/icons/external-link-alt
            var linkIcon = '<svg class="linkIcon" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">';
			linkIcon += '<path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>';
			linkIcon += '</svg>';

            // click a step to highlight it
            $('#steps li').click( function() {
                if ( $(this).hasClass('highlight') ) {
                    $(this).removeClass('highlight');
                }
                else {
                    $('.highlight').removeClass('highlight');
                    $(this).addClass('highlight');
                }
            });
        },

        // no recipe listed or some problem? redirect to main page
        error: function() {
            window.location.href = './';
        }
    });

    // L/R arrow keys shift the step highlight
    $(document).keydown(function(e) {
        switch(e.which) {
            case 37:                // left
                var curr = $('.highlight');
                curr.removeClass('highlight');
                curr.prev().addClass('highlight');
                break;
            case 39:
                var curr = $('.highlight');
                curr.removeClass('highlight');
                curr.next().addClass('highlight');
                break;
            default:
                return;
        }
        // e.preventDefault(); ignore normal L/R behavior (probably don't want to do this, since we want to use L/R for the back button, etc)
    });
});
*/