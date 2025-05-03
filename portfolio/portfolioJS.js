
async function loadEntries(){

    // var entries;
    // const entries = fetch("entries.json").then(response =>
    //     entries = response.json()
    // );

    const response = await fetch("entries.json");


    const portfolioMain = document.getElementById("portfolio-main");
    const data = await response.json();
    const entries = data.entries;
    for(let i = 0; i < entries.length; i++){
        let entryResponse = await fetch(entries[i].path + "/.json");
        let entryData = await entryResponse.json();
        console.log(entryData);

        let tagStr = '<li>' + entryData.tags.join("</li><li>") + '</li>';

        let linkStr = '';
        entryData.links.forEach(link => {
            linkStr += `<li><a href="${link.url}">${link.label}</a></li>`;
        });

        portfolioMain.innerHTML += `
            <portfolio-entry>
                <h1 slot="title">${entries[i].title}</h1>
                <div slot="body">${entryData.body}</div>
                <ul slot="tags">${tagStr}</ul>
                <ul slot="links">${linkStr}</ul>
            </portfolio-entry>
            `
        
    }
}