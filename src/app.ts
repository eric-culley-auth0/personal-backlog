// autobind decorator
function autobind (
    _taget: any, 
    _methodName: string, 
    descriptor: PropertyDescriptor
) {
    console.log(descriptor)
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }    
    }
    console.log(adjDescriptor)
    return adjDescriptor;
}

// Project Class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    appElement: HTMLDivElement;
    form: HTMLFormElement;
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        
        this.appElement = document.getElementById('app')! as HTMLDivElement;
        
        const importedNode = document.importNode(this.templateElement.content, true)
        
        this.form = importedNode.firstElementChild as HTMLFormElement;
        this.form.id = 'user-input';

        this.titleInput = this.form.querySelector('#title') as HTMLInputElement;
        this.descriptionInput = this.form.querySelector('#description') as HTMLInputElement;
        this.peopleInput = this.form.querySelector('#people') as HTMLInputElement;

        this.loadForm()
        this.configureSubmitListener()
    }  

    private loadForm() {
        this.appElement.insertAdjacentElement('afterbegin', this.form);
    }

    private configureSubmitListener() {
        this.form.addEventListener('submit', this.submitHandler);
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        console.log(this.titleInput.value);
    }
}

const projectInput = new ProjectInput();