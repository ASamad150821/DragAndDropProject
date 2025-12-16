"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
;
class Project {
    constructor(id, title, description, numOfPeople, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.numOfPeople = numOfPeople;
        this.status = status;
    }
}
function autobind(target, methodName, descriptor) {
    let originalMethod = descriptor.value;
    let adjustedDescriptor = {
        configurable: true,
        get() {
            let boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjustedDescriptor;
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class ProjectState1 extends State {
    constructor() {
        super();
        this.projects = [];
    }
    ;
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = new ProjectState1();
            return this.instance;
        }
    }
    addProject(title, description, numOfPeople) {
        let projecttoadd = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(projecttoadd);
        this.reRunTheListenersAsSomethingHasChanged();
    }
    switchProjectStatus(projectID, newStatus) {
        let projectochange = this.projects.find(project => project.id === projectID);
        if (projectochange && newStatus !== projectochange.status) {
            projectochange.status = newStatus;
            this.reRunTheListenersAsSomethingHasChanged();
        }
    }
    ;
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    reRunTheListenersAsSomethingHasChanged() {
        for (let listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
let projectState = ProjectState1.getInstance();
class Component {
    constructor(templateElementID, hostElementID, insertAtStart, newElementID) {
        let templateEl = document.getElementById(templateElementID);
        let hostEl = document.getElementById(hostElementID);
        if (templateEl && hostEl) {
            this.templateElement = templateEl;
            this.hostElement = hostEl;
        }
        else {
            throw new Error("Null value for either the template element or the host element");
        }
        let copiedHTMLContent = document.importNode(this.templateElement.content, true);
        this.element = copiedHTMLContent.firstElementChild;
        if (newElementID) {
            this.element.id = newElementID;
        }
        ;
        this.insertAtStart = insertAtStart;
        this.attach(this.insertAtStart);
    }
    attach(insertAtStart) {
        this.hostElement.insertAdjacentElement((insertAtStart) ? 'afterbegin' : 'beforeend', this.element);
    }
}
class ProjectItem extends Component {
    constructor(hostID, projecttodisplay) {
        super("single-project", hostID, false, projecttodisplay.id);
        this.projecttorender = projecttodisplay;
        this.configure();
        this.renderContent();
    }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    dragStartHandler(event) {
        event.dataTransfer.setData('text/plain', this.projecttorender.id);
        event.dataTransfer.effectAllowed = 'move';
        console.log(this.projecttorender.status);
    }
    dragEndHandler(event) {
        console.log(this.projecttorender.status);
    }
    renderContent() {
        let h2Header = this.element.querySelector("h2");
        h2Header.innerHTML = this.projecttorender.title;
        let h3Header = this.element.querySelector("h3");
        h3Header.innerHTML = this.projecttorender.description;
        let paragraphtorender = this.element.querySelector("p");
        paragraphtorender.innerHTML = this.renderDetailedNumberOfPeopleInformation() + ` Assigned`;
    }
    renderDetailedNumberOfPeopleInformation() {
        if (this.projecttorender.numOfPeople === 1) {
            return `1 Person`;
        }
        else {
            return `${this.projecttorender.numOfPeople} People`;
        }
    }
}
__decorate([
    autobind
], ProjectItem.prototype, "dragStartHandler", null);
__decorate([
    autobind
], ProjectItem.prototype, "dragEndHandler", null);
;
class ProjectList extends Component {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    ;
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            this.element.querySelector('ul').classList.add('droppable');
        }
    }
    dropHandler(event) {
        console.log(event.dataTransfer.getData('text/plain'));
        let prjID = event.dataTransfer.getData('text/plain');
        projectState.switchProjectStatus(prjID, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }
    ;
    dragLeaveHandler(event) {
        this.element.querySelector('ul').classList.remove('droppable');
    }
    ;
    renderContent() {
        let listID = `${this.type}-project-list`;
        this.element.querySelector('ul').id = listID;
        this.element.querySelector('h2').innerHTML = `${this.type.toUpperCase()} PROJECTS`;
    }
    renderProjects(projects) {
        let listElGrabbedByItsID = document.getElementById(`${this.type}-project-list`);
        listElGrabbedByItsID.innerHTML = '';
        for (let prj of projects) {
            new ProjectItem(this.element.querySelector("ul").id, prj);
        }
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        projectState.addListener((projects) => {
            let relevantProjects = projects.filter(project => {
                if (this.type === 'active') {
                    return project.status === ProjectStatus.Active;
                }
                ;
                return project.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects(this.assignedProjects);
        });
    }
}
__decorate([
    autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dropHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dragLeaveHandler", null);
class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true);
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.numOfPeopleInputElement = this.element.querySelector('#people');
        this.configure();
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler1);
    }
    submitHandler1(event) {
        event.preventDefault();
        let userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            let title = userInput[0];
            let description = userInput[1];
            let people = userInput[2];
            projectState.addProject(title, description, people);
        }
        this.clearFields();
    }
    gatherUserInput() {
        let titleEntered = this.titleInputElement.value;
        let descriptionEntered = this.descriptionInputElement.value;
        let peopleEntered = parseFloat(this.numOfPeopleInputElement.value);
        let titleToValidate = {
            value: titleEntered,
            required: true
        };
        let descriptionToValidate = {
            value: descriptionEntered,
            required: true,
            minLengthOfString: 3
        };
        let peopleToValidate = {
            value: peopleEntered,
            required: true,
            maxValueOfPeople: 7
        };
        if (!(this.validate1(titleToValidate)) || !(this.validate1(descriptionToValidate)) || !(this.validate1(peopleToValidate))) {
            throw new Error("Invalid input, please try again");
        }
        else {
            let tupletoreturn = [titleEntered, descriptionEntered, peopleEntered];
            return tupletoreturn;
        }
    }
    validate1(validatableInput) {
        let isValid = true;
        if (validatableInput.required && (validatableInput.value.toString().trim().length == 0 || validatableInput.value.toString().trim() == '0')) {
            isValid = false;
        }
        else {
            isValid = true;
        }
        if (validatableInput.minLengthOfString != null) {
            isValid = isValid && validatableInput.value.toString().trim().length >= validatableInput.minLengthOfString;
        }
        if (validatableInput.maxLengthOfString != null) {
            isValid = isValid && validatableInput.value.toString().trim().length <= validatableInput.maxLengthOfString;
        }
        if (validatableInput.minValueOfPeople != null && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value >= validatableInput.minValueOfPeople;
        }
        if (validatableInput.maxValueOfPeople != null && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value <= validatableInput.maxValueOfPeople;
        }
        return isValid;
    }
    clearFields() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.numOfPeopleInputElement.value = '';
    }
    renderContent() { }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler1", null);
let prjInput = new ProjectInput();
let activeProjectSection = new ProjectList('active');
let finishedProjectSection = new ProjectList('finished');
//# sourceMappingURL=app.js.map
