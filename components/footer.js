
const footerTemplate = document.createElement('template');

footerTemplate.innerHTML = `
    <style>
    footer{
        display: flex;
        background-color: var(--footer-bg, #381d2a);
        color:rgb(223, 223, 223);
        bottom:0;
        width:100vw;
        content-align:center;
        justify-content:center;

    }
    </style>

    <footer role="contentinfo">
        <p>Product of Connor <br> </p>
    </footer>

`;
class Footer extends HTMLElement{
    constructor(){
        super();
    }


    connectedCallback(){
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(footerTemplate.content.cloneNode(true));
    }
}

customElements.define('footer-component', Footer);
