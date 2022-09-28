import { projectState } from './app-state/project-state';
import MenuBar from './components/menu-bar';
import ProjectInput from './components/project-input';
import List from './components/project-list';

// Instantiate Code
new ProjectInput();
new List('backlog');
new List('active');
new List('complete');
new MenuBar();

// Fetch Data from LocalStorage
projectState.fetchStoredProjects();