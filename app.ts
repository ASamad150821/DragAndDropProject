//Project Type 
enum ProjectStatus {
  Active, //0
  Finished //1
};

class Project {

  constructor(public id: string, public title: string, public description: string, public numOfPeople: number, public status: ProjectStatus) {

  }

}
//

//Project State Management

//type Listener = (items: Project[]) => void;

/*class ProjectState{
  private projects: Project[] = []; //Upon submitting a project, it should be entered as an index in this array here.
  private static instance: ProjectState;
  private listeners: Listener[] = [];

  private constructor() {}

  addProject(title: string, description: string, numOfPeople: number) {
    let projectretrieved = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active)

    this.projects.push(projectretrieved)

    for(let listenerFn of this.listeners)
    {
      listenerFn(this.projects.slice());
    }
  }

  static getInstance() {
   
    if(this.instance) {
      return this.instance;
    }
   
    this.instance = new ProjectState();
    return this.instance
  }


  addListenerFunction(listenerfn: Listener) {
    this.listeners.push(listenerfn);
  }

}*/

/*type Listener1 = (items: Project[]) => void;

class State1{
  private listeners: Listener1[] = [];

  addListenerFunction(listenerfn: Listener1) {
    this.listeners.push(listenerfn);
  }
} */

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListenerFunction(listenerfn: Listener<T>) {
    this.listeners.push(listenerfn);
  }
}

class ProjectState extends State<Project>{
  private projects: Project[] = []; //Upon submitting a project, it should be entered as an index in this array here.
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
   
    if(this.instance) {
      return this.instance;
    }
   
    this.instance = new ProjectState();
    return this.instance
  }

  addProject(title: string, description: string, numOfPeople: number) {
    let projectretrieved = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active)

    this.projects.push(projectretrieved)

    for(let listenerFn of this.listeners)
    {
      listenerFn(this.projects.slice());
    }
  }

}


let projectState1 = ProjectState.getInstance();

//autobind director
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
  //
  
  //Validation logic
  type ValidationObject = {
    value: string | number,
    required?: boolean,
    minLengthOfString?: number,
    maxLengthOfString?: number,
    minValueOfPeople?: number,
    maxValueOfPeople?: number 
  }
  
  function validate2(objecttovalidate: ValidationObject) {
    
    let isValid : boolean = true
    
    if(objecttovalidate.required) 
    {
      isValid = isValid && objecttovalidate.value.toString().trim().length !== 0 && objecttovalidate.value.toString().trim() !== '0';
    }
  
    if(objecttovalidate.minLengthOfString != null && typeof objecttovalidate.value === 'string') {
      isValid = isValid && objecttovalidate.value.toString().trim().length >= objecttovalidate.minLengthOfString
    }
  
    if(objecttovalidate.maxLengthOfString != null && typeof objecttovalidate.value === 'string') {
      isValid = isValid && objecttovalidate.value.toString().trim().length <= objecttovalidate.maxLengthOfString
    }
  
    if(objecttovalidate.minValueOfPeople != null && typeof objecttovalidate.value === 'number')
    {
      isValid = isValid && objecttovalidate.value >= objecttovalidate.minValueOfPeople;
    }
  
    if(objecttovalidate.maxValueOfPeople != null && typeof objecttovalidate.value === 'number')
      {
        isValid = isValid && objecttovalidate.value <= objecttovalidate.maxValueOfPeople
      }
    return isValid;
  }
  //

  //Component Class - responsible for general rendering and attachment of a component onto the application

  abstract class Component <T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    insertAtBeginning1: boolean;

    constructor(templateID: string, hostElementID: string, insertAtBeginning2: boolean, newElementID?: string,) {
      let templateElretrieved = document.getElementById(templateID);
      let hostElretrieved = document.getElementById(hostElementID);
      this.insertAtBeginning1 = insertAtBeginning2;

      if(templateElretrieved && hostElretrieved) {
        this.templateElement = templateElretrieved as HTMLTemplateElement;
        this.hostElement = hostElretrieved as T;
      }
      else {
        throw new Error("null value - unable to retrieve either the form or the application")
      }

      let copiedHTMLContent = document.importNode(this.templateElement.content, true);
      this.element = copiedHTMLContent.firstElementChild as U;
      
      if(newElementID) {
        this.element.id = newElementID;
      }

      this.attach(this.insertAtBeginning1);
    }

    private attach(insertAtBeginning3: boolean) {
      this.hostElement.insertAdjacentElement(insertAtBeginning3 ? 'afterbegin' : 'beforeend', this.element);
    }

    abstract configure(): void;
    abstract renderContent(): void;
  }

  class ProjectList extends Component<HTMLDivElement, HTMLElement> {
 
    private assignedProjects: Project[];
  
    constructor(private type: 'active' | 'finished') {
      
      super('project-list', 'app', false, `${type}-projects`);
      this.assignedProjects = [];

      //After initialising all of the variables needed to render project content onto the app, but just before attaching onto the app and executing the method to actually render project content

      this.configure();
      this.renderContent();
    };

    private renderProjects() {

     let ListElementFoundByItsID = document.getElementById(`${this.type}-projects-lists`)! as HTMLUListElement;

     ListElementFoundByItsID.innerHTML = '';

     for(let prjItem of this.assignedProjects) {
     let newproject = document.createElement('li');
     newproject.innerHTML = prjItem.title;
     ListElementFoundByItsID.appendChild(newproject);
     }

    }

    renderContent() {
      let listID = `${this.type}-projects-lists`;
      this.element.querySelector('ul')!.id = listID;
      this.element.querySelector('h2')!.innerHTML = this.type.toUpperCase() + ' PROJECTS';
    } 
  
    configure(): void {
      projectState1.addListenerFunction((projects: Project[]) => {
      
        let filteredProjects = projects.filter(project => {
          if(this.type === 'active')
          {
            return project.status === ProjectStatus.Active
          }

         return project.status === ProjectStatus.Finished;
        })

        this.assignedProjects = filteredProjects;
        this.renderProjects();
      });
    }
  
  }
  
  
  class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {

    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
  
    constructor() {
      super("project-input", "app", true);

      this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

      this.configure()
    }
  
    
  private validate(objecttovalidate: ValidationObject) {
    
    let isValid : boolean = true
    
    if(objecttovalidate.required && (objecttovalidate.value.toString().trim().length == 0 || objecttovalidate.value.toString().trim() == '0')) 
    {
      isValid = false ;
    }
    else {
      isValid = true;
    }
  
    if(objecttovalidate.minLengthOfString != null && typeof objecttovalidate.value === 'string') {
      isValid = isValid && objecttovalidate.value.toString().trim().length >= objecttovalidate.minLengthOfString
    }
  
    if(objecttovalidate.maxLengthOfString != null && typeof objecttovalidate.value === 'string') {
      isValid = isValid && objecttovalidate.value.toString().trim().length <= objecttovalidate.maxLengthOfString
    }
  
    if(objecttovalidate.minValueOfPeople != null && typeof objecttovalidate.value === 'number')
    {
      isValid = isValid && objecttovalidate.value >= objecttovalidate.minValueOfPeople;
    }
  
    if(objecttovalidate.maxValueOfPeople != null && typeof objecttovalidate.value === 'number')
      {
        isValid = isValid && objecttovalidate.value <= objecttovalidate.maxValueOfPeople
      }
  
    return isValid;
  }
  
    private gatherUserInput() : [string, string, number] | Error {
      let titleEnteredAsString = this.titleInputElement.value
      let descriptionEnteredAsString = this.descriptionInputElement.value
      let peopleEnteredAsString = parseInt(this.peopleInputElement.value);
  
      let titleToValidate : ValidationObject = {
        value: titleEnteredAsString,
        required: true
      }
  
      let descriptionToValidate: ValidationObject = {
        value: descriptionEnteredAsString,
        required: true,
        minLengthOfString: 4
      }
  
      let peopleToValidate: ValidationObject = {
        value: peopleEnteredAsString,
        required: true,
        minValueOfPeople: 1,
        maxValueOfPeople: 10
      }
  
      if(!this.validate(titleToValidate) || !this.validate(descriptionToValidate) || !this.validate(peopleToValidate)) {
        throw new Error("Invalid Input");
      } 
      else {
        let tupletoreturn : [string, string, number] = [titleEnteredAsString,descriptionEnteredAsString, peopleEnteredAsString];
        return tupletoreturn;
      }
  
      }
  
    private ClearFields() {
      this.titleInputElement.value = '';
      this.descriptionInputElement.value = '';
      this.peopleInputElement.value = '';
    }
  
    @autobind
    private submitHandler2(event: Event) {
      event.preventDefault();
      let userInput = this.gatherUserInput();
  
      if(Array.isArray(userInput)) {
        let title = userInput[0];
        let desc = userInput[1];
        let people = userInput[2];
        
        projectState1.addProject(title, desc, people);
      }
  
      this.ClearFields();
    }
  
    configure() {
      this.element.addEventListener('submit', this.submitHandler2);
    }  
  
   /* private configure1() {
      this.formElement.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log(this.titleInputElement.value);
        console.log(this.descriptionInputElement.value);
        console.log(this.peopleInputElement.value);
      })
    }  */
  
     /* private submitHandler3(event: Event) {
        event.preventDefault();
        console.log(this.titleInputElement.value);
        console.log(this.descriptionInputElement.value);
        console.log(this.peopleInputElement.value);
      }
    
      private configure3() {
        this.formElement.addEventListener('submit', this.submitHandler3.bind(this));
      }  */

    renderContent(): void {} ;
  
  }
  
  let prjInput = new ProjectInput();
  let activeProjectList = new ProjectList('active');
  let finishedProjectList = new ProjectList('finished');


  
