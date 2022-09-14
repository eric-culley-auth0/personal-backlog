// Component Class
export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
        templateId: string, 
        appElementId: string, 
        insertAtStart: boolean,
        newElementId?: string
    ) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;

        this.hostElement = document.getElementById(appElementId)! as T;

        const importedNode = document.importNode(this.templateElement.content, true)

        this.element = importedNode.firstElementChild as U;
        if (newElementId) this.element.id = newElementId;

        this.loadElement(insertAtStart);
    }

    private loadElement(insertAtBegining: boolean) {
        this.hostElement.insertAdjacentElement(insertAtBegining ? 'afterbegin' : 'beforeend', this.element);
    }

    abstract configure(): void;
    abstract renderContent(): void;

}