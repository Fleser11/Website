const headerTemplate = document.createElement('template');


headerTemplate.innerHTML = `
    <style>


    header {
        background-color: var(--color-plum, #381d2a);
        color:rgb(255, 255, 255);
        border-width:0px;
        width:100vw;
        position: sticky;
        top: 0;
        z-index: 10;

    }
    
    nav { 
        display: flex;
        background-color: var(--bar-color);
        color:rgb(255, 255, 255);
        top:0px;
        /* border-width:0px; */
        width:100vw;
        /* border:0px; */
        list-style:none; 
        text-align:center;
        /* padding: .5vh; */
        /* padding: -1px; */
    
    }
    
    a {
        text-decoration:none;
    
    }
    
    nav a{
        padding:10px 15px 10px 15px;
        border-radius: 10px;
        color: rgb(255, 255, 255);
        transition: background-color 0.2s ease;
    }

    nav a:hover{
        background-color: var(--color-rust, #ba5624);
    }

    nav a:active{
        background-color: var(--color-orange, #ffa552);
    }

    nav li{
        display:inline;
        padding-left: clamp(8px, 5vw, 40px);
        padding-right: clamp(8px, 5vw, 40px);

    }

    nav ul{
        padding:0px;
        width:100vw;
        display:flex;
        justify-content:space-between;
        box-sizing: border-box;
    }

    header-component {
        display: block;
    }

    @media (max-width: 600px) {
        nav ul {
            flex-direction: column;
            align-items: center;
        }

        nav li {
            padding: 6px 0;
        }
    }

    </style>
    <header>
        <nav>
            <ul>
                <li><a href="#home" title="Home">Home</a></li>
                <li><a href="#portfolio" title="My projects">Portfolio</a></li>
                <li><a href="#resume" title="My resume and experience">Resume</a></li>
                <li><a href="#contact" title="Reach out">Contact</a></li>
            </ul>
        </nav>
    </header>
`;

class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(headerTemplate.content);
    }
}

customElements.define('header-component', Header);
