// Add Recipe Java Script
// Description: Allows users to create recipe submissions for review.
// Created 10/13/2026 by Eric Ashenfelter
// Last updated 10/13/2026 by Eric Ashenfelter

let ingredientSectionsEnabled = false;
let stepSectionsEnabled = false;
let ingredientIdCounter = 1;

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeIngredients();
        initializeSteps();

        document
            .getElementById(
                "enableIngredientSections"
            )
            .addEventListener(
                "click",
                enableIngredientSections
            );

        document
            .getElementById(
                "enableStepSections"
            )
            .addEventListener(
                "click",
                enableStepSections
            );

        document
            .getElementById("previewBtn")
            .addEventListener(
                "click",
                generatePreview
            );
        
        document
            .getElementById("submitBtn")
            .addEventListener(
                "click",
                submitRecipe
            );
        

    }
);

function makeNumberedList(text) {

    return text
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .map((line, index) =>
            `${index + 1}. ${line}`
        )
        .join("\n");

}

function makeBulletList(text) {

    return text
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .map(line =>
            `* ${line}`
        )
        .join("\n");

}

function initializeIngredients() {

    const container =
        document.getElementById(
            "ingredient-sections"
        );

    const section =
        document.createElement("div");

    section.className =
        "recipe-section-card";

    section.innerHTML = `
        <div class="ingredient-items"></div>

        <button
            type="button"
            class="addIngredient">
            + Add Ingredient
        </button>
    `;

    container.appendChild(section);

    new Sortable(
        section.querySelector(".ingredient-items"),
        {
            group: "ingredients",
            animation: 150,
            handle: ".drag-handle",

            onEnd() {
                updateIngredientNumbers();
                updateIngredientSelectors();
            }
        }
    );

    for(let i=0; i<5; i++) {
        addIngredientRow(section);
    }

    section
        .querySelector(".addIngredient")
        .addEventListener(
            "click",
            () => addIngredientRow(section)
        );
}

function enableIngredientSections() {

    ingredientSectionsEnabled = true;

    addIngredientSection();

    // convert current default section
    // into named section

}

function addIngredientSection(sectionName = "") {

    const container =
        document.getElementById(
            "ingredient-sections"
        );

    const section =
        document.createElement("div");

    section.className =
        "recipe-section-card";

    section.innerHTML = `
        <input
            class="section-name"
            placeholder="Section Name"
            value="${sectionName}"
        >

        <div class="ingredient-items"></div>

        <button
            type="button"
            class="addIngredient">
            + Add Ingredient
        </button>
    `;

    container.appendChild(section);



    new Sortable(
        section.querySelector(".ingredient-items"),
        {
            group: "ingredients",
            animation: 150,
            handle: ".drag-handle",

            onEnd() {
                updateIngredientNumbers();
                updateIngredientSelectors();
            }
        }
    );

    section
        .querySelector(".addIngredient")
        .addEventListener(
            "click",
            () =>
                addIngredientRow(section)
        );

    section
        .querySelector(".section-name")
        .addEventListener(
            "input",
            updateIngredientNumbers
        );

    addIngredientRow(section);

}

function addIngredientRow(section) {

    const container =
        section.querySelector(
            ".ingredient-items"
        );

    const row =
        document.createElement("div");

    const ingredientId = getNextIngredientId();

    row.dataset.ingredientId = ingredientId;

    row.className =
        "ingredient-row-container";

    row.innerHTML = `
        <span class="drag-handle">☰</span>

        <input
            type="text"
            class="ingredient-row"
            placeholder="Ingredient"
        >

        <button
            type="button"
            class="delete-row">
            ✕
        </button>
    `;

    container.appendChild(row);

    row
        .querySelector(".delete-row")
        .addEventListener(
            "click",
            () => {
                row.remove();
                updateIngredientNumbers();
                updateIngredientSelectors();
            }
        );

    row
        .querySelector(".ingredient-row")
        .addEventListener(
            "input",
            () => {
            updateIngredientNumbers();
            updateIngredientSelectors();
            }
        );

    updateIngredientNumbers();
    updateIngredientSelectors();

}

function getNextIngredientId() {
    return `ingredient-${ingredientIdCounter++}`;
}

function generateIngredientsMarkdown() {

    let markdown = "";

    let ingredientNumber = 1;

    document
        .querySelectorAll(
            "#ingredient-sections .recipe-section-card"
        )
        .forEach(section => {

            const sectionName =
                section.querySelector(
                    ".section-name"
                );

            const name =
                sectionName
                    ? sectionName.value.trim()
                    : "";

            if (name) {
                markdown +=
                    `${name}\n\n`;
            }

            section
                .querySelectorAll(
                    ".ingredient-row"
                )
                .forEach(row => {

                    const value =
                        row.value.trim();

                    if (!value) return;

                    markdown +=
                        `${ingredientNumber}. ${value}\n`;

                    ingredientNumber++;

                });

            markdown += "\n";

        });

    return markdown.trim();

}

function getCurrentIngredients() {

    const ingredients = [];

    let number = 1;

    document
        .querySelectorAll(".ingredient-row-container")
            .forEach(rowContainer => {
                const value =
                    rowContainer.querySelector(".ingredient-row").value.trim();

                if (!value) return;

                ingredients.push({

                    id:
                        rowContainer.dataset.ingredientId,
                    number,
                    value
                });

                number++;
            });

    return ingredients;
}

function updateIngredientSelectors() {

    const ingredients =
        getCurrentIngredients();

    document.querySelectorAll(".step-ingredient-selector")
        .forEach(selector => {

            const selectedIds =
                Array.from(
                    selector.querySelectorAll("input:checked")
                )
                .map(
                    checkbox => checkbox.value
                );

            selector.innerHTML = "";

            ingredients.forEach(ingredient => {
                const label =
                    document.createElement("label");

                const isChecked =
                    selectedIds.includes(ingredient.id);

                label.innerHTML = `
                    <input
                        type="checkbox"
                        value="${ingredient.id}"
                        ${isChecked ? "checked" : ""}
                    >

                    ${ingredient.number}.
                    ${ingredient.value}
                `;

                const checkbox = label.querySelector("input");

                checkbox.addEventListener("change", () => {
                    
                    const rowContainer = selector.closest(".step-row-container");
                    
                    updateSelectedIngredientDisplay(rowContainer);

                    updateIngredientButtonText(rowContainer);
                });

                selector.appendChild(label);

            });

            updateSelectedIngredientDisplay(selector.closest(".step-row-container"));

            updateIngredientButtonText(selector.closest(".step-row-container"));
        });
}

function updateIngredientButtonText(rowContainer) {

    const button = rowContainer.querySelector(".toggle-ingredients");

    const count = rowContainer.querySelectorAll(".step-ingredient-selector input:checked").length;

    button.textContent = `Edit Ingredients (${count} selected)`;
} 

function updateSelectedIngredientDisplay(rowContainer) {

    const display =
        rowContainer.querySelector(".selected-ingredients");

    display.innerHTML = "";

    const ingredientLookup = {};

    getCurrentIngredients()
        .forEach(ingredient => {
            ingredientLookup[
                ingredient.id
            ] = ingredient.value;
        });

    rowContainer
        .querySelectorAll(".step-ingredient-selector input:checked")
        .forEach(checkbox => {
            const tag =
                document.createElement("span");

            tag.className = "ingredient-tag";

            tag.textContent = ingredientLookup[checkbox.value] + " ✕";

            tag.dataset.ingredientId = checkbox.value;

            display.appendChild(tag);
        });
}

function getIngredientNumberMap() {

    const map = {};

    getCurrentIngredients().forEach(ingredient => {
        map[
            ingredient.id
        ] = ingredient.number;
    });

    return map;
}

function initializeSteps() {

    const container =
        document.getElementById(
            "step-sections"
        );

    const section =
        document.createElement("div");

    section.className =
        "recipe-section-card";

    section.innerHTML = `
        <div class="step-items"></div>

        <button
            type="button"
            class="addStep">
            + Add Step
        </button>
    `;

    container.appendChild(section);

    new Sortable(
        section.querySelector(".step-items"),
        {
            group: "steps",
            animation: 150,
            handle: ".drag-handle",

            onEnd() {
                updateStepNumbers();
            }
        }
    );

    for(let i=0; i<5; i++) {
        addStepRow(section);
    }

    section
        .querySelector(".addStep")
        .addEventListener(
            "click",
            () => addStepRow(section)
        );
}

function enableStepSections() {

    stepSectionsEnabled = true;

    addStepSection();

    // convert current default section
    // into named section

}

function addStepSection(sectionName = "") {

    const container =
        document.getElementById(
            "step-sections"
        );

    const section =
        document.createElement("div");

    section.className =
        "recipe-section-card";

    section.innerHTML = `
        <input
            class="section-name"
            placeholder="Section Name"
            value="${sectionName}"
        >

        <div class="step-items"></div>

        <button
            type="button"
            class="addStep">
            + Add Step
        </button>
    `;

    container.appendChild(section);

    new Sortable(
        section.querySelector(".step-items"),
        {
            group: "steps",
            animation: 150,
            handle: ".drag-handle",

            onEnd() {
                updateStepNumbers();
            }
        }
    );

    section
        .querySelector(".addStep")
        .addEventListener(
            "click",
            () =>
                addStepRow(section)
        );

    section
        .querySelector(".section-name")
        .addEventListener(
            "input",
            updateStepNumbers
        );


    addStepRow(section);

}

function addStepRow(section) {

    const container =
        section.querySelector(
            ".step-items"
        );

    const row =
        document.createElement("div");

    row.className =
        "step-row-container";

    row.innerHTML = `
        <span class="drag-handle">☰</span>

        <textarea
            rows="2"
            class="step-row"
            placeholder="Step text"
        ></textarea>

        <div
            class="selected-ingredients">
        </div>

        <button
            type="button"
            class="toggle-ingredients">
            Choose Ingredients
        </button>
        
        <div
            class="step-ingredient-selector">
        </div>

        <button
            type="button"
            class="delete-row">
            ✕
        </button>
    `;

    container.appendChild(row);

    row
        .querySelector(".toggle-ingredients")
        .addEventListener("click", () => {

            const selector =
                row.querySelector(".step-ingredient-selector");

            selector.style.display =
                selector.style.display ===
                "block"
                    ? "none"
                    : "block";
        });

    updateIngredientSelectors();

    updateIngredientButtonText(row);

    row
        .querySelector(".delete-row")
        .addEventListener(
            "click",
            () => {
                row.remove();
                updateStepNumbers();
            }
        );

    row
        .querySelector(".step-row")
        .addEventListener(
            "input",
            updateStepNumbers
        );

    updateStepNumbers();

}

function generateStepsMarkdown() {

    let markdown = "";

    let stepNumber = 1;

    document
        .querySelectorAll(
            "#step-sections .recipe-section-card"
        )
        .forEach(section => {

            const sectionName =
                section.querySelector(
                    ".section-name"
                );

            const name =
                sectionName
                    ? sectionName.value.trim()
                    : "";

            if (name) {
                markdown +=
                    `${name}\n\n`;
            }

            section
                .querySelectorAll(
                    ".step-row-container"
                )
                .forEach(rowContainer => {

                    const value =
                        rowContainer.querySelector(".step-row").value.trim();

                    if (!value) return;

                    const selector =
                        rowContainer.querySelector(".step-ingredient-selector");

                    const ingredientMap = getIngredientNumberMap();

                    const ingredientNumbers = 
                        Array
                            .from(
                                selector.querySelectorAll("input:checked")
                            )
                            .map(checkbox => ingredientMap[checkbox.value]).filter(number => number);
                    
                    console.log("Checked ingredients:", ingredientNumbers);

                    let tagText = "";

                    if (ingredientNumbers.length > 0) {
                        tagText = ` {${ingredientNumbers.join(",")}}`;
                    }

                    markdown +=
                        `${stepNumber}. ${value}${tagText}\n`;

                    stepNumber++;

                });

            markdown += "\n";

        });

    return markdown.trim();

}

function updateIngredientNumbers() {

    const list =
        document.getElementById(
            "ingredient-number-list"
        );

    list.innerHTML = "";

    let number = 1;

    document
        .querySelectorAll(
            "#ingredient-sections .recipe-section-card"
        )
        .forEach(section => {

            const sectionName =
                section.querySelector(
                    ".section-name"
                );

            if (
                sectionName &&
                sectionName.value.trim()
            ) {

                const header =
                    document.createElement("div");

                header.textContent =
                    sectionName.value.trim();

                header.className =
                    "number-panel-section";

                list.appendChild(header);

            }

            section
                .querySelectorAll(".ingredient-row")
                .forEach(row => {

                    const value =
                        row.value.trim();

                    if (!value) {
                        return;
                    }

                    const item =
                        document.createElement("li");

                    item.textContent =
                        `${number}. ${value}`;

                    list.appendChild(item);

                    number++;

                });

        });

}

function updateStepNumbers() {

    const list =
        document.getElementById(
            "step-number-list"
        );

    list.innerHTML = "";

    let number = 1;

    document
        .querySelectorAll(
            "#step-sections .recipe-section-card"
        )
        .forEach(section => {

            const sectionName =
                section.querySelector(
                    ".section-name"
                );

            if (
                sectionName &&
                sectionName.value.trim()
            ) {

                const header =
                    document.createElement("div");

                header.textContent =
                    sectionName.value.trim();

                header.className =
                    "number-panel-section";

                list.appendChild(header);

            }

            section
                .querySelectorAll(
                    ".step-row"
                )
                .forEach(row => {

                    const value =
                        row.value.trim();

                    if (!value) {
                        return;
                    }

                    const item =
                        document.createElement("li");

                    item.textContent =
                        `${number}. ${value}`;

                    list.appendChild(item);

                    number++;

                });

        });

}

function generateMarkdown() {

    const title =
        document
            .getElementById("title")
            .value
            .trim();

    const description =
        document
            .getElementById("description")
            .value
            .trim();

    const time =
        document
            .getElementById("time")
            .value
            .trim();

    const servings =
        document
            .getElementById("servings")
            .value
            .trim();

    const ingredients =
        generateIngredientsMarkdown();


    const steps =
        generateStepsMarkdown();

    const notes =
        makeBulletList(
            document
                .getElementById("notes")
                .value
        );

    const basedOn =
        makeBulletList(
            document
                .getElementById("basedon")
                .value
        );

    const tags =
        document
            .getElementById("tags")
            .value
            .trim();

    return `
# ${title}

${description}

## info

* Time: ${time}
* Servings: ${servings}

## ingredients

${ingredients}

## steps

${steps}

## notes

${notes}

## based on

${basedOn}

## tags

${tags}
`.trim();
}

function generatePreview() {

    const validationError =
        validateRecipe();

    if (validationError) {

        showStatus(
            validationError,
            "error"
        );
        return;
    }

    const markdown =
        generateMarkdown();

    document
        .getElementById("preview")
        .textContent = markdown;

}

function validateRecipe() {

    const title =
        document
            .getElementById("title")
            .value
            .trim();

    if (!title) {
        return "Recipe name is required.";
    }

    const ingredients =
        generateIngredientsMarkdown();

    if (!ingredients.trim()) {
        return "Please add at least one ingredient.";
    }

    const steps =
        generateStepsMarkdown();

    if (!steps.trim()) {
        return "Please add at least one step.";
    }

    return null;
}

async function submitRecipe() {

    const validationError =
        validateRecipe();

    if (validationError) {

        showStatus(
            validationError,
            "error"
        );
        return;
    }

    const submitBtn =
        document.getElementById("submitBtn");

    submitBtn.disabled = true;

    submitBtn.textContent = "Submitting...";

    const title =
        document.getElementById("title").value.trim();
    
    const markdown =
        generateMarkdown();

    try {

        const response =
            await fetch(
                "https://woodstock-whimsy-worker.ashenfeltereric11.workers.dev",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                           "application/json"
                    },

                    body: JSON.stringify({
                        title,
                        markdown
                    })
                }
            );

        const result =
            await response.json();

        if (result.success) {

            showStatus(
                "Recipe submitted successfully!",
                "success"
            );
        } else {
            showStatus(
                result.error ||
                "Submission failed.",
                "error"
            );
        }
    }

    catch(error) {
        console.error(error);

        alert(
            "Unable to submit recipe."
        );
    }

    finally {

        submitBtn.disabled = false;

        submitBtn.textContent = "Submit Recipe";
    }
}

function showStatus(message, type) {
    const status =
        document.getElementById(
            "submission-status"
        );

    status.textContent = message;

    status.className =
        type == "success"
        ? "status-success"
        : "status-error";
}
