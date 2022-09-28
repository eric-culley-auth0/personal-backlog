import { Project, ProjectPriority, ProjectStatus, StoredProjectData } from '../models/project-model'

// Project State Management
type Listener = (items: Project[]) => void;

export class ProjectState {
    private projects: Project[] = [];
    private listeners: Listener[] = [];

    private static instance: ProjectState;

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    fetchStoredProjects(): void {
        if (localStorage.length) {
            for (let i = 0; i < localStorage.length; i++) {  
                const [title, description, priority, status]: StoredProjectData = JSON.parse(localStorage.getItem(localStorage.key(i)!)!);
                const storedProject: Project = new Project(
                    localStorage.key(i)!,
                    title,
                    description,
                    priority,
                    status
                ) 
                this.projects.push(storedProject);
                this.updateListeners();
            }
        }
    }

    addProject(title: string, description: string, priority: ProjectPriority) {
        const id = Math.random().toString();
        // Add to LocalStorage
        localStorage.setItem(id, JSON.stringify([title, description, priority, 0]));
        // Add to projects array
        const newProject = new Project(id, title, description, priority, ProjectStatus.Backlog)
        this.projects.push(newProject)
        this.updateListeners();
        console.log(this.projects)
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(prj => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
        // Update LocalStorage
        const [title, description, priority]: StoredProjectData = JSON.parse(localStorage.getItem(projectId)!);
        localStorage.removeItem(projectId);
        localStorage.setItem(projectId, JSON.stringify([title, description, priority, newStatus]))
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
