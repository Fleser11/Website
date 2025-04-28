
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
        let entryResponse = await fetch(entries[i].path + ".json");
        let entryData = await entryResponse.json();


        portfolioMain.innerHTML += `
            <portfolio-entry>
                <h1 slot="title">${entries[i].title}</h1>
                <div slot="body">${entryData.body}</div>
                <div slot="tags">${entryData.tags}</div>
                <div slot="links">${entryData.links}</div>
            `
    }
}