import Component from "./base-component";
import autobind from "../decorators/autobind";
import { projectState } from "../app-state/project-state";
import { Validatable, validate } from "../util/validation";
import { ProjectPriority } from "../models/project-model";

// Project Input Class
export default class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    priorityInput: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');

        this.titleInput = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInput = this.element.querySelector('#description') as HTMLInputElement;
        this.priorityInput = this.element.querySelector('#priority') as HTMLInputElement;

        this.configure()
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler);
        this.element.classList.add('up-menu');
    }

    renderContent(): void {}

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const formInput = this.gatherFormInput();
        if (Array.isArray(formInput)) {
            const [title, description, priority] = formInput;
            projectState.addProject(title, description, priority);
            this.clearInputs();
        }
    }

    private gatherFormInput(): [string, string, ProjectPriority] | void {
        const enteredTitle = this.titleInput.value;
        const enteredDescription = this.descriptionInput.value;
        const enteredPriority = this.priorityInput.value;
        let priorityEnum!: ProjectPriority;
        switch (this.priorityInput.value) {
            case '1': {
                priorityEnum = ProjectPriority.Low;
                break;
            }
            case '2': {
                priorityEnum = ProjectPriority.Medium;
                break;
            }
            case '3': {
                priorityEnum = ProjectPriority.High;
                break;
            }
        }
       
        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
            minLength: 1,
            maxLength: 32
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 1
        }
        const priorityValidatable: Validatable = {
            value: +enteredPriority,
            required: true,
            min: 1,
            max: 3
        }

        if (
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(priorityValidatable)
        ) {
            alert("Invalid input, please try again.");
            return;
        } else {
            return [enteredTitle, enteredDescription, priorityEnum];
        }
    }

    private clearInputs() {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.priorityInput.value = '';
    }
}
