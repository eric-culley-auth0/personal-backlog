import Component from "./base-component";
import { DragTarget } from "../models/drag-and-drop";
import { Project } from "../models/project-model";
import autobind from "../decorators/autobind";
import { projectState } from "../app-state/project-state";
import { ProjectStatus } from "../models/project-model";
import Item from "./project-item";

// ProjectList Class
export default class List extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: 'backlog' | 'active' | 'complete') {
        super('project-list', 'list-container', false,`${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        
        this.configure();
        this.renderContent();

    }

    @autobind
    dragOverHandler(event: DragEvent): void {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
    }

    @autobind
    dropHandler(event: DragEvent): void {
        
        const projId = event.dataTransfer!.getData('text/plain');

        const droppedList = document.getElementsByClassName('droppable');

        switch (droppedList[0].id) {
            case 'backlog-projects-list':
                projectState.moveProject(projId, ProjectStatus.Backlog);
            break
            case 'active-projects-list':
                projectState.moveProject(projId, ProjectStatus.Active);
            break
            case 'complete-projects-list':
                projectState.moveProject(projId, ProjectStatus.Complete);
            break
        }
        droppedList[0].classList.remove('droppable');
    }

    @autobind
    dragLeaveHandler(_: DragEvent): void {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    configure(): void {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('drop', this.dropHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        projectState.addListener((projects: Project[]) => {
            const relevantProjects =  projects.filter((prj) => {
                switch (this.type) {
                    case 'backlog':
                        return prj.status === ProjectStatus.Backlog;
                    case 'active':
                        return prj.status === ProjectStatus.Active;
                    case 'complete':
                        return prj.status === ProjectStatus.Complete;  
                }
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }

    renderContent(): void {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
        listEl.innerHTML = '';
        for (const project of this.assignedProjects) {
            new Item(this.element.querySelector('ul')!.id, project);
        }
    }
}