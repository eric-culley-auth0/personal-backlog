import Component from "./base-component";
import { Project, ProjectPriority } from "../models/project-model";
import { Draggable } from "../models/drag-and-drop";
import autobind from "../decorators/autobind";

// ProjectItem Class
export default class Item extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id)
        this.project = project;

        this.configure();
        this.renderContent();
    }

    @autobind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    dragEndHandler(_: DragEvent): void {

    }

    configure(): void {
        this.element.addEventListener('dragstart', this.dragStartHandler)
        this.element.addEventListener('dragend', this.dragEndHandler)
    }

    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.project.title;
        switch (this.project.priority) {
            case ProjectPriority.Low:
                this.element.querySelector('h3')!.textContent = "low";
            break;
            case ProjectPriority.Medium:
                this.element.querySelector('h3')!.textContent = "medium";
            break;
            case ProjectPriority.High:
                this.element.querySelector('h3')!.textContent = "high";
            break;
        }
        this.element.querySelector('p')!.textContent = this.project.description;
    }
}