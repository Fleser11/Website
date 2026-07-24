const headerTemplate = document.createElement('template');


headerTemplate.innerHTML = `
    <style>


    header {
        background-color: var(--nav-bg, #381d2a);
        color:rgb(255, 255, 255);
        border-width:0px;
        width:100vw;
        position: sticky;
        top: 0;
        z-index: 10;

    }

    nav {
        display: flex;
        background-color: var(--nav-bg, #381d2a);
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

    nav a:focus-visible,
    .theme-toggle:focus-visible {
        outline: 2px solid var(--color-orange, #ffa552);
        outline-offset: -2px;
    }

    nav li{
        display:inline;
        padding-left: clamp(8px, 4vw, 40px);
        padding-right: clamp(8px, 4vw, 40px);

    }

    nav ul{
        padding:0px;
        width:100vw;
        display:flex;
        justify-content:center;
        align-items: center;
        box-sizing: border-box;
    }

    .theme-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: clamp(8px, 4vw, 40px);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.4);
        background: transparent;
        color: rgb(255, 255, 255);
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        flex-shrink: 0;
    }

    .theme-toggle:hover {
        background-color: var(--color-rust, #ba5624);
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

        .theme-toggle {
            margin: 6px 0 0 0;
        }
    }

    </style>
    <header>
        <nav>
            <ul>
                <li><a href="#home" title="Home">Home</a></li>
                <li><a href="#about" title="More about me">About</a></li>
                <li><a href="#skills" title="My skills">Skills</a></li>
                <li><a href="#portfolio" title="My projects">Portfolio</a></li>
                <li><a href="#awards" title="Awards and recognition">Awards</a></li>
                <li><a href="#resume" title="My resume and experience">Resume</a></li>
                <li><a href="#contact" title="Reach out">Contact</a></li>
                <li>
                    <button type="button" class="theme-toggle" aria-label="Switch to dark theme" aria-pressed="false" title="Toggle dark mode">&#9788;</button>
                </li>
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
        shadowRoot.appendChild(headerTemplate.content.cloneNode(true));

        const toggle = shadowRoot.querySelector('.theme-toggle');
        toggle.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('theme-toggle-request'));
        });

        this._toggle = toggle;
        this._syncToggle();

        document.addEventListener('theme-changed', () => this._syncToggle());
    }

    _syncToggle() {
        if (!this._toggle) return;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
            || (document.documentElement.getAttribute('data-theme') !== 'light'
                && window.matchMedia('(prefers-color-scheme: dark)').matches);
        this._toggle.textContent = isDark ? '☽' : '☀';
        this._toggle.setAttribute('aria-pressed', String(isDark));
        this._toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
}

customElements.define('header-component', Header);
