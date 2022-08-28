// Project
class Project {
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public people: number, 
        public status: ProjectStatus 
    ) {}
}

enum ProjectStatus {
    Active, 
    Finished
}

// Project State Management
class ProjectState {
    private projects: Project[] = [];
    private listeners: any[] = [];

    private static instance: ProjectState;

    private constructor() { }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active)
        this.projects.push(newProject)
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }

    addListener(listenerFn: Function) {
        this.listeners.push(listenerFn);
    }
}




// Project Input Class
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
        const formInput = this.gatherFormInput();
        if (Array.isArray(formInput)) {
            const [title, description, people] = formInput;
            // console.log(title, description, people);
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
    }

    private gatherFormInput(): [string, string, number] | void {
        const enteredTitle = this.titleInput.value;
        const enteredDescription = this.descriptionInput.value;
        const enteredPeople = this.peopleInput.value;
        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        if (
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            alert("Invalid input, please try again.");
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private clearInputs() {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    }
}




// ProjectList Class
class List {
    templateElement: HTMLTemplateElement;
    appElement: HTMLDivElement;
    list: HTMLElement;
    type: 'active' | 'completed';
    assignedProjects: Project[];

    constructor(type: "active" | 'completed') {
        this.type = type;
        this.assignedProjects = [];
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;

        this.appElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true)

        this.list = importedNode.firstElementChild as HTMLElement;
        this.list.id = `${this.type}-projects`;

        projectState.addListener((projects: any[]) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });

        this.loadList();
        this.renderContent();
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
        for (const project of this.assignedProjects) {
            const listItem = document.createElement('li');
            listItem.textContent = project.title;
            listEl.appendChild(listItem);
        }
    }

    private loadList() {
        this.appElement.insertAdjacentElement('beforeend', this.list);
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.list.querySelector('ul')!.id = listId;
        this.list.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }
}




// Validation Logic
interface Validatable {
    value?: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.toString().trim().length > 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length > validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value > validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value < validatableInput.max;
    }
    return isValid
}

// autobind decorator
function autobind(
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




// Instantiate Code
const projectState = ProjectState.getInstance();
const projectInput = new ProjectInput();
const activeProjectList = new List('active');
const completedProjectList = new List('completed');