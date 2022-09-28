import Component from "./base-component";

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
        const upLists = document.querySelector('.up-lists') as HTMLDivElement;
        const downLists = document.querySelector('.down-lists') as HTMLDivElement;
        const addBtn = document.querySelector('.add') as HTMLButtonElement;
        const minusBtn = document.querySelector('.minus') as HTMLButtonElement;

        if (upMenu && upLists && addBtn) {
            this.dropDownBtn.textContent = '-';
            // addBtn.classList.add('minus');
            upMenu.classList.add('down-menu');
            upLists.classList.add('down-lists');
            addBtn.classList.remove('add');
            upMenu.classList.remove('up-menu');
            upLists.classList.remove('up-lists');
        }
        if (downMenu && downLists && minusBtn) {
            addBtn.textContent = '+';
            minusBtn.classList.add('add');
            downMenu.classList.add('up-menu');
            downLists.classList.add('up-lists');
            minusBtn.classList.remove('minus');
            downMenu.classList.remove('down-menu');
            downLists.classList.remove('down-lists');
        }
    } 

    configure(): void {
        this.dropDownBtn.addEventListener('click', this.menuDrop);
    }

    renderContent(): void {
        
    }
}