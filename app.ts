//Drag and Drop Interfaces
//Implement the interface below to any class that represents a UI element that can be draggable
interface Draggable {
  dragStartHandler(event: DragEvent) : void;
  dragEndHandler(event: DragEvent) : void;
}

//Implement the interface below to any class that represents a UI element that can take in (is a recipient of) a draggable UI element
interface DragTarget {
  dragOverHandler(event: DragEvent): void; //Method that will contain a condition to check if the UI element that you are dragging into is a valid drop target.
  dropHandler(event: DragEvent): void; // Method to react to the actual drop that happens - completes the drop
  dragLeaveHandler(event: DragEvent): void; // Provide a UI update after the drop - reset the UI
}

//Validation 
type ValidationObject = {
  value: string | number,
  required?: boolean,
  minLengthOfString?: number,
  maxLengthOfString?: number,
  minValueOfPeople?: number,
  maxValueOfPeople?: number 
}

enum ProjectStatus {
  Active,
  Finished
};

//Project Type
class Project {
  constructor(public id: string, public title: string, public description: string, public numOfPeople: number, public status: ProjectStatus) {}
}

//Autobind decorator
function autobind(target: any, methodName: any, descriptor: PropertyDescriptor) {
  let originalMethod =  descriptor.value;
  let adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      let boundFn = originalMethod.bind(this);
      return boundFn;
    }
  } 
  return adjustedDescriptor;
}

//Project State Management
type ListenerFunction<T> = (projects: T[]) => void;

abstract class State<T> {
  protected listeners: ListenerFunction<T>[] = [];

  constructor() {}

  addListener(listenerFn: ListenerFunction<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState1 extends State<Project>{
  private projects: Project[] = [] //Holds an array of projects
  private static instance: ProjectState1;

  private constructor() {
    super();
  };

  static getInstance() {

    if(this.instance) {
      return this.instance
    } else {
    this.instance = new ProjectState1();
    return this.instance; }
  }

   addProject(title: string, description: string, numOfPeople: number) {
    //Use the newly created Project Class here
    let projecttoadd = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active)
    this.projects.push(projecttoadd);

    this.reRunTheListenersAsSomethingHasChanged();
  }

  switchProjectStatus(projectID: string, newStatus: ProjectStatus){
    let projectochange = this.projects.find(project => project.id === projectID);
    if(projectochange && newStatus !== projectochange.status) {
      projectochange.status = newStatus;
      this.reRunTheListenersAsSomethingHasChanged();
    }
  };

  addListener(listenerFn: ListenerFunction<Project>) {
    this.listeners.push(listenerFn);
  }

  reRunTheListenersAsSomethingHasChanged() {
    for(let listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); //HERE IS WHEN THE LISTENER FUNCTIONS WILL BE CALLED - THIS IS WHERE THE PROJECTS ARRAY COMES FROM!
    }
  }

} 

/*class ProjectState {
    private projects: Project[] = [] //Holds an array of projects
    private static instance: ProjectState;
    private listeners: ListenerFunction[] = [];

    private constructor() {};

    static getInstance() {

      if(this.instance) {
        return this.instance
      } else {
      this.instance = new ProjectState();
      return this.instance; }
    }

     addProject(title: string, description: string, numOfPeople: number) {
      //Use the newly created Project Class here
      let projecttoadd = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active)
      this.projects.push(projecttoadd);

      for(let listenerFn of this.listeners) {
        listenerFn(this.projects.slice()); //HERE IS WHEN THE LISTENER FUNCTIONS WILL BE CALLED - THIS IS WHERE THE PROJECTS ARRAY COMES FROM!
      }
    }

    addListener(listenerFn: ListenerFunction) {
      this.listeners.push(listenerFn);
    }
} */
let projectState = ProjectState1.getInstance();

//Component Base Class
abstract class Component <T extends HTMLElement, U extends HTMLElement>{
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;
  insertAtStart: boolean;

  constructor(templateElementID: string, hostElementID: string, insertAtStart: boolean, newElementID?: string) {
    let templateEl = document.getElementById(templateElementID);
    let hostEl = document.getElementById(hostElementID);

    if(templateEl && hostEl) {
      this.templateElement = templateEl as HTMLTemplateElement;
      this.hostElement = hostEl as T;
    }
    else{
      throw new Error("Null value for either the template element or the host element");
    }

   let copiedHTMLContent = document.importNode(this.templateElement.content, true);
   this.element = copiedHTMLContent.firstElementChild as U;

   if(newElementID) {
   this.element.id = newElementID;
   };

   this.insertAtStart = insertAtStart;

   this.attach(this.insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement((insertAtStart) ? 'afterbegin' : 'beforeend', this.element)
  }

  abstract configure() : void; // Used when submitting a form, clicking a button etc
  abstract renderContent() : void;
}


//ProjectItem Class - Responsible for rendering a project onto the list
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{

  private projecttorender: Project;

  constructor(hostID: string, projecttodisplay: Project) {
  super("single-project", hostID, false, projecttodisplay.id);
  this.projecttorender = projecttodisplay;

  this.configure();
  this.renderContent();
}

configure() {
  this.element.addEventListener('dragstart', this.dragStartHandler);
  this.element.addEventListener('dragend', this.dragEndHandler);
}

@autobind //Code to run after starting the hovering process
dragStartHandler(event: DragEvent): void {
  event.dataTransfer!.setData('text/plain', this.projecttorender.id);
  event.dataTransfer!.effectAllowed = 'move';

  console.log(this.projecttorender.status);
}

@autobind //Code to run after the entire hovering process has been completed
dragEndHandler(event: DragEvent): void {
  console.log(this.projecttorender.status);
}

renderContent(){
 let h2Header = this.element.querySelector("h2")!
 h2Header.innerHTML = this.projecttorender.title;

 let h3Header = this.element.querySelector("h3")!;
 h3Header.innerHTML = this.projecttorender.description;

 let paragraphtorender = this.element.querySelector("p")!;
 paragraphtorender.innerHTML = this.renderDetailedNumberOfPeopleInformation() + ` Assigned`;

}

private renderDetailedNumberOfPeopleInformation() {
if(this.projecttorender.numOfPeople === 1)
{
  return `1 Person`
}
else{
  return `${this.projecttorender.numOfPeople} People`;
}
}

};

//Render the section that shows both active and finished project lists
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{

  assignedProjects: Project[] = [];

  constructor(private type: 'active' | 'finished') {
    super("project-list", "app", false,`${type}-projects`);
    this.configure();
    this.renderContent();
  };
  
  @autobind //What to do when hovering over the target element
  dragOverHandler(event: DragEvent) {
    //Condition to check if an element can be dropped in here
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault(); //Open the gates to allow dragging to happen.
      this.element.querySelector('ul')!.classList.add('droppable');
    }
  }
    
  @autobind // What to do after letting go of the mouse to complete hovering.
  dropHandler(event: DragEvent): void {
    console.log(event.dataTransfer!.getData('text/plain'));
    let prjID = event.dataTransfer!.getData('text/plain');
    projectState.switchProjectStatus(prjID, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
  };
  
  @autobind //Finishing touches in the (previous) target element after letting go of the mouse to complete hovering
  dragLeaveHandler(event: DragEvent): void {
    this.element.querySelector('ul')!.classList.remove('droppable');
  };

   renderContent() {
    let listID = `${this.type}-project-list`;
    this.element.querySelector('ul')!.id = listID;
    this.element.querySelector('h2')!.innerHTML = `${this.type.toUpperCase()} PROJECTS`;
  }

  private renderProjects(projects: Project[]) {
    let listElGrabbedByItsID = document.getElementById(`${this.type}-project-list`) as HTMLUListElement;
    listElGrabbedByItsID.innerHTML = '';
    for(let prj of projects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prj); //Use the ID of the unordered list, NOT THE ID Of the entire section that holds the unordered list - as the unordered list is the correct host element of each item in the list. 
    }
  }

  configure() {

    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

        //Setting up the structure of the callback functions (that are going to be added) in here
        projectState.addListener((projects: Project[]) => {
     
          let relevantProjects = projects.filter(project => {
            
            if(this.type === 'active') {
              return project.status === ProjectStatus.Active;
            };
      
            return project.status === ProjectStatus.Finished;
            
          })
           
            this.assignedProjects = relevantProjects;
            this.renderProjects(this.assignedProjects);
          })
  }

}

//Render the form onto the div marked as the application
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  numOfPeopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true);

   this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
   this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
   this.numOfPeopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

   this.configure();

  }

    configure() {
    this.element.addEventListener('submit', this.submitHandler1);
  }

  @autobind
  private submitHandler1(event: Event) {
    event.preventDefault();

    let userInput = this.gatherUserInput();

    if(Array.isArray(userInput)) {
      let title = userInput[0];
      let description = userInput[1];
      let people = userInput[2];

      projectState.addProject(title, description, people);
    }
    this.clearFields();
  }

  private gatherUserInput(): [string, string, number] | Error {
    let titleEntered = this.titleInputElement.value ;
    let descriptionEntered = this.descriptionInputElement.value;
    let peopleEntered = parseFloat(this.numOfPeopleInputElement.value);

    let titleToValidate: ValidationObject = {
      value: titleEntered,
      required: true
    };

    let descriptionToValidate: ValidationObject = {
      value: descriptionEntered,
      required: true,
      minLengthOfString: 3
    };

    let peopleToValidate : ValidationObject = {
      value: peopleEntered,
      required: true,
      maxValueOfPeople: 7
    }

    if(!(this.validate1(titleToValidate)) || !(this.validate1(descriptionToValidate)) || !(this.validate1(peopleToValidate))){
      throw new Error("Invalid input, please try again")
    } else {
      let tupletoreturn : [string, string, number] = [titleEntered,descriptionEntered, peopleEntered];
      return tupletoreturn;
    }
  }

  private validate1(validatableInput: ValidationObject) {
    let isValid : boolean = true
    
    if(validatableInput.required && (validatableInput.value.toString().trim().length == 0 || validatableInput.value.toString().trim() == '0')) 
      {
        isValid = false ;
      }
      else {
        isValid = true;
      }
  
    if(validatableInput.minLengthOfString != null) {
      isValid = isValid && validatableInput.value.toString().trim().length >= validatableInput.minLengthOfString
    }
  
    if(validatableInput.maxLengthOfString != null) {
      isValid = isValid && validatableInput.value.toString().trim().length <= validatableInput.maxLengthOfString
    }
  
    if(validatableInput.minValueOfPeople != null && typeof validatableInput.value === 'number')
    {
      isValid = isValid && validatableInput.value >= validatableInput.minValueOfPeople;
    }
  
    if(validatableInput.maxValueOfPeople != null && typeof validatableInput.value === 'number')
      {
        isValid = isValid && validatableInput.value <= validatableInput.maxValueOfPeople
      }
  
    return isValid;
  }

  private clearFields() {
    this.titleInputElement.value = '' ;
    this.descriptionInputElement.value = '';
    this.numOfPeopleInputElement.value = '';
  }

  renderContent() {}
}

let prjInput = new ProjectInput();
let activeProjectSection = new ProjectList('active');
let finishedProjectSection = new ProjectList('finished');
