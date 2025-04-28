const headerTemplate = document.createElement('template');


headerTemplate.innerHTML = `
    <style>


    header {
        background-color:#323e81;
        color:rgb(255, 255, 255);
        border-width:0px;
        width:100vw;
    
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
    }
    
    nav a:hover{
        background-color:rgb(75, 75, 75)
    }

    nav a:active{
        background-color:rgb(100, 100, 100)
    }

    nav li{
        display:inline;
        padding-left:5vw;
        padding-right:5vw;
        
    }
    
    nav ul{
        padding:0px;
        width:100vw;
        display:flex;
        justify-content:space-between;
    }

    header-component {
        display: block;
    }

    </style>
    <header>
        <nav>
            <ul>
                <li><a href="../home/index.html" title="Home">Home</a></li>
                <li><a href="../portfolio/portfolio.html" title="My resume and experience">Portfolio</a></li>
                <li><a href="../resume/resume.html" title="My resume and experience">Resume</a></li>

                <li><a href="../contact/contact.html" title="Reach out">Contact</a></li>

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
