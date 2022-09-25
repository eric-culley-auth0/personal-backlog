import { projectState } from './app-state/project-state.js';
import MenuBar from './components/menu-bar.js';
import ProjectInput from './components/project-input.js';
import List from './components/project-list.js';

// Instantiate Code
new ProjectInput();
new List('backlog');
new List('active');
new List('complete');
new MenuBar();

// Fetch Data from LocalStorage
projectState.fetchStoredProjects();