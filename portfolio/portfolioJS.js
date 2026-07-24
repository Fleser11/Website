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
            links: entryData.links,
            featured: entryData.featured || false,
            blurb: entryData.blurb || stripHtml(entryData.body).split(/(?<=[.!?])\s/)[0] || ""
        };
    }));

    renderFilters();
    renderGrid();
    setupModal();
}

function stripHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent || "";
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

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function cardMarkup(entry) {
    const previewTags = entry.tags.slice(0, 3)
        .map(tag => `<li>${escapeHtml(tag)}</li>`).join("");
    const media = entry.cover
        ? `<div class="portfolio-card-media" style="background-image:url('${entry.cover}')"></div>`
        : `<div class="portfolio-card-media portfolio-card-placeholder"></div>`;
    return media
        + (entry.featured ? `<span class="portfolio-card-badge">Featured</span>` : "")
        + `<span class="portfolio-card-title">${escapeHtml(entry.title)}</span>`
        + `<div class="portfolio-card-overlay">`
        + `<span class="portfolio-card-overlay-title">${escapeHtml(entry.title)}</span>`
        + (entry.blurb ? `<p class="portfolio-card-overlay-blurb">${escapeHtml(entry.blurb)}</p>` : "")
        + (previewTags ? `<ul class="portfolio-card-overlay-tags">${previewTags}</ul>` : "")
        + `<span class="portfolio-card-overlay-cta">Learn more &rarr;</span>`
        + `</div>`;
}

function makeCard(entry, i) {
    const card = document.createElement("button");
    card.className = "portfolio-card";
    card.style.animationDelay = `${i * 40}ms`;
    card.setAttribute("aria-label", `${entry.title} — view project details`);
    card.innerHTML = cardMarkup(entry);
    card.addEventListener("click", () => openModal(entry, card));
    return card;
}

function renderGrid() {
    const grid = document.getElementById("portfolio-grid");
    grid.innerHTML = "";

    const visibleEntries = (activeTags.size === 0
        ? allEntries
        : allEntries.filter(entry => entry.tags.some(tag => activeTags.has(tag))))
        .slice()
        .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    visibleEntries.forEach((entry, i) => {
        grid.appendChild(makeCard(entry, i));
    });
}

let lastFocusedElement = null;

function openModal(entry, triggerEl) {
    const modal = document.getElementById("portfolio-modal");
    const content = modal.querySelector(".portfolio-modal-content");
    const panel = modal.querySelector(".portfolio-modal-panel");

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

    panel.setAttribute("aria-label", entry.title);

    if (modalCloseTimer) {
        clearTimeout(modalCloseTimer);
        modalCloseTimer = null;
    }
    lastFocusedElement = triggerEl || document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("open"));
    document.body.classList.add("modal-open");
    modal.querySelector(".portfolio-modal-close").focus();
}

function closeModal() {
    const modal = document.getElementById("portfolio-modal");
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
    modalCloseTimer = setTimeout(() => { modal.hidden = true; modalCloseTimer = null; }, 200);
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
    }
    lastFocusedElement = null;
}

function setupModal() {
    const modal = document.getElementById("portfolio-modal");
    const panel = modal.querySelector(".portfolio-modal-panel");
    modal.querySelector(".portfolio-modal-backdrop").addEventListener("click", closeModal);
    modal.querySelector(".portfolio-modal-close").addEventListener("click", closeModal);
    document.addEventListener("keydown", (event) => {
        if (modal.hidden) return;
        if (event.key === "Escape") {
            closeModal();
            return;
        }
        if (event.key === "Tab") {
            const focusable = panel.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
}
