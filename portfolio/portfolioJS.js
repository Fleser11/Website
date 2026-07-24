const DEFAULT_TAGS = ["Leadership", "Software Engineering", "Data Science"];

let allEntries = [];
const activeTags = new Set();
let modalCloseTimer = null;

async function loadEntries() {
    const response = await fetch("portfolio/entries.json");
    const data = await response.json();
    const index = data.entries;

    allEntries = await Promise.all(index.map(async (entry) => {
        const entryResponse = await fetch("portfolio/" + entry.path + "/.json");
        const entryData = await entryResponse.json();
        return {
            title: entry.title,
            cover: entryData.cover || null,
            body: entryData.body,
            tags: entryData.tags,
            links: entryData.links
        };
    }));

    renderFilters();
    renderGrid();
    setupModal();
}

function makeChip(label, tag) {
    const chip = document.createElement("button");
    chip.className = "filter-chip";
    chip.textContent = label;
    if (tag) chip.dataset.tag = tag;
    const isActive = tag ? activeTags.has(tag) : activeTags.size === 0;
    chip.classList.toggle("active", isActive);
    chip.addEventListener("click", () => {
        if (tag === null) {
            activeTags.clear();
        } else if (activeTags.has(tag)) {
            activeTags.delete(tag);
        } else {
            activeTags.add(tag);
        }
        renderFilters();
        renderGrid();
    });
    return chip;
}

function renderFilters() {
    const filterBar = document.getElementById("portfolio-filters");
    filterBar.innerHTML = "";

    const allTags = [...new Set(allEntries.flatMap(entry => entry.tags))].sort();
    const extraTags = allTags.filter(tag => !DEFAULT_TAGS.includes(tag));

    const chipRow = document.createElement("div");
    chipRow.className = "filter-chip-row";
    chipRow.appendChild(makeChip("All", null));
    DEFAULT_TAGS.forEach(tag => {
        if (allTags.includes(tag)) chipRow.appendChild(makeChip(tag, tag));
    });

    const select = document.createElement("select");
    select.className = "filter-dropdown";
    const placeholder = document.createElement("option");
    placeholder.textContent = "More tags…";
    placeholder.value = "";
    select.appendChild(placeholder);
    extraTags.forEach(tag => {
        const opt = document.createElement("option");
        opt.value = tag;
        opt.textContent = tag;
        select.appendChild(opt);
    });
    select.addEventListener("change", () => {
        if (select.value) {
            activeTags.add(select.value);
            renderFilters();
            renderGrid();
        }
    });
    chipRow.appendChild(select);
    filterBar.appendChild(chipRow);

    const activeExtra = [...activeTags].filter(tag => !DEFAULT_TAGS.includes(tag));
    if (activeExtra.length) {
        const activeRow = document.createElement("div");
        activeRow.className = "filter-chip-row active-extra-row";
        activeExtra.forEach(tag => {
            const chip = document.createElement("button");
            chip.className = "filter-chip active removable";
            chip.innerHTML = `${tag} <span class="remove-x">&times;</span>`;
            chip.addEventListener("click", () => {
                activeTags.delete(tag);
                renderFilters();
                renderGrid();
            });
            activeRow.appendChild(chip);
        });
        filterBar.appendChild(activeRow);
    }
}

function renderGrid() {
    const grid = document.getElementById("portfolio-grid");
    grid.innerHTML = "";

    const visibleEntries = activeTags.size === 0
        ? allEntries
        : allEntries.filter(entry => entry.tags.some(tag => activeTags.has(tag)));

    visibleEntries.forEach((entry, i) => {
        const card = document.createElement("button");
        card.className = "portfolio-card";
        card.style.animationDelay = `${i * 40}ms`;
        card.innerHTML = (entry.cover
            ? `<div class="portfolio-card-media" style="background-image:url('${entry.cover}')"></div>`
            : `<div class="portfolio-card-media portfolio-card-placeholder"></div>`)
            + `<span class="portfolio-card-title">${entry.title}</span>`;
        card.addEventListener("click", () => openModal(entry));
        grid.appendChild(card);
    });
}

function openModal(entry) {
    const modal = document.getElementById("portfolio-modal");
    const content = modal.querySelector(".portfolio-modal-content");

    const tagStr = '<ul class="tag-list">' + entry.tags.map(tag => `<li>${tag}</li>`).join("") + '</ul>';
    const linkStr = entry.links.length
        ? '<ul class="link-list">' + entry.links.map(link => `<li><a href="${link.url}">${link.label}</a></li>`).join("") + '</ul>'
        : '<p class="no-links">No public links for this project.</p>';

    content.innerHTML = `
        <h1>${entry.title}</h1>
        <div class="portfolio-body">${entry.body}</div>
        <h2>Tags</h2>
        ${tagStr}
        <h2>Links</h2>
        ${linkStr}
    `;

    if (modalCloseTimer) {
        clearTimeout(modalCloseTimer);
        modalCloseTimer = null;
    }
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("open"));
    document.body.classList.add("modal-open");
}

function closeModal() {
    const modal = document.getElementById("portfolio-modal");
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
    modalCloseTimer = setTimeout(() => { modal.hidden = true; modalCloseTimer = null; }, 200);
}

function setupModal() {
    const modal = document.getElementById("portfolio-modal");
    modal.querySelector(".portfolio-modal-backdrop").addEventListener("click", closeModal);
    modal.querySelector(".portfolio-modal-close").addEventListener("click", closeModal);
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) closeModal();
    });
}
