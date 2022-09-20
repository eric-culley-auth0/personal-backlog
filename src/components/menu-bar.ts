import Component from "./base-component.js";

export default class MenuBar extends Component<HTMLDivElement, HTMLElement> {
    dropDownBtn: HTMLButtonElement;

    constructor() {
        super('menu-bar', 'app', true, 'menu');
        
        this.dropDownBtn = this.element.querySelector('#drop-down-btn') as HTMLButtonElement;
       
        this.configure();
    }

    menuDrop(): void {
        const upMenu = document.querySelector('.up-menu') as HTMLFormElement;
        const downMenu = document.querySelector('.down-menu') as HTMLFormElement;
        if (upMenu) {
            const inputForm = document.querySelector('.up-menu')!;
            inputForm.classList.add('down-menu');
            inputForm.classList.remove('up-menu');
        }
        if (downMenu) {
            const inputForm = document.querySelector('.down-menu')!;
            inputForm.classList.add('up-menu');
            inputForm.classList.remove('down-menu');
        }
    } 

    configure(): void {
        this.dropDownBtn.addEventListener('click', this.menuDrop);
    }

    renderContent(): void {
        
    }
}