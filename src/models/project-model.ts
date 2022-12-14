// Project
export class Project {
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public priority: ProjectPriority, 
        public status: ProjectStatus 
    ) {}
}

// Model of project stored in localstorage
export type StoredProjectData = [
    title: string, 
    description: string, 
    priority: ProjectPriority, 
    status: ProjectStatus 
]

export enum ProjectStatus {
    Backlog,
    Active, 
    Complete
}

export enum ProjectPriority {
    Low, 
    Medium,
    High
}