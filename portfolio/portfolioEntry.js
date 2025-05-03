

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
            margin: 2% 10% 2% 10%;
            box-shadow: 0px 0px 20px 10px grey;
            padding: 1% 3% 2% 3%;
        }
        
        ::slotted(ul) {
            list-style: none;
            display: flex;
            margin: 0px;
            padding-inline-start:0px;

        }

        
        h2 {
            margin: 10px 0px;
        }


    </style>

    <div id="portfolioEntry">
        <slot name="title"></slot>
        <slot name="body"></slot>
        <h2>Tags</h2>
        <slot name="tags"></slot>
        <h2>Links</h2>
        <slot name="links"></slot>
    </div>

    


`;


class PortfolioEntry extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(portfolioEntryTemplate.content.cloneNode(true));

        const tags = shadowRoot.querySelector('slot[name="tags"]');

        tags.addEventListener('slotchange', () =>{
            tags.assignedElements().forEach(ul => {
                ul.querySelectorAll('li').forEach(li =>{
                    li.style.padding = "2px 10px 2px 10px";
                    li.style.margin = "2px 5px 2px 5px";
                    li.style.borderRadius = "20px";
                    li.style.backgroundColor = "rgb(37, 37, 37)";
                    li.style.color = "white";
                }
                )
            })
        })

        const links = shadowRoot.querySelector('slot[name="links"]');
        links.addEventListener('slotchange', () =>{
            links.assignedElements().forEach(ul => {
                ul.querySelectorAll('li').forEach(li =>{
                    li.style.padding = "2px 10px 2px 10px";
                    li.style.margin = "2px 5px 2px 5px";
                    li.style.borderRadius = "20px";
                    li.style.backgroundColor = "rgb(7, 117, 220)";
                    li.style.color = "white";
                

                
                });
                ul.querySelectorAll('a').forEach(a =>{
                    a.style.textDecoration = "none";
                    a.style.color = "white";
                });
            })
        })

    }
}

customElements.define('portfolio-entry', PortfolioEntry);


