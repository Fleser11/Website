

const portfolioEntryTemplate = document.createElement('template');

portfolioEntryTemplate.innerHTML = `
    <style>

        #tags {
            list-style:none; 
            text-align:center;
            padding:0px;
            margin:0px;
        }

        #portfolioEntry {
            margin: 5% 20% 2% 20%;
            box-shadow: 0px 0px 20px 10px grey;
            padding: 1% 3% 2% 3%;
        }
        

            

    </style>
    <div id="portfolioEntry">
        <h1><slot name="title"></slot></h1>
        <div id="title"><slot name="title"></slot></div>
        <div id="body"><slot name="body"></slot></div>
        <ul id="tags"><slot name="tags"></slot></ul>
        <ul id="links"><slot name="links"></slot></ul>

    </div>


`;


class PortfolioEntry extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(portfolioEntryTemplate.content.cloneNode(true));
    }
}

customElements.define('portfolio-entry', PortfolioEntry);




