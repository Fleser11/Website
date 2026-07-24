
const footerTemplate = document.createElement('template');

footerTemplate.innerHTML = `
    <style>
    footer{
        display: flex;
        background-color: var(--color-plum, #381d2a);
        color:rgb(223, 223, 223);
        bottom:0;
        width:100vw;
        content-align:center;
        justify-content:center;

    }
    </style>

    <footer>
        <p>Product of Connor <br> </p>
    </footer>

`;
class Footer extends HTMLElement{
    constructor(){
        super();
    }


    connectedCallback(){
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(footerTemplate.content);
    }
}

customElements.define('footer-component', Footer);
