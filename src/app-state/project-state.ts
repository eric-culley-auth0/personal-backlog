import { Project, ProjectPriority, ProjectStatus } from '../models/project-model.js'

// Project State Management
type Listener = (items: Project[]) => void;

export class ProjectState {
    private projects: Project[] = [];
    private listeners: Listener[] = [];

    private static instance: ProjectState;

    private constructor() { 
        if (localStorage) {
            console.log(localStorage);
        }
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(title: string, description: string, priority: ProjectPriority) {
        const newProject = new Project(Math.random().toString(), title, description, priority, ProjectStatus.Backlog)
        this.projects.push(newProject)
        this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(prj => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn);
    }

    private updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}

export const projectState = ProjectState.getInstance();
