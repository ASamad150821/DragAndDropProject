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
  
  class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    sectionElement: HTMLElement;
    private type : 'active' | 'finished';
  
  
    constructor(type: 'active' | 'finished') {
      let templateElretrieved = document.getElementById("project-list");
      let hostElretrieved = document.getElementById("app");
  
      if(templateElretrieved && hostElretrieved) {
        this.templateElement = templateElretrieved as HTMLTemplateElement;
        this.hostElement = hostElretrieved as HTMLDivElement;
      }
      else {
        throw new Error("null value - unable to retrieve either the form or the application")
      }
  
      let improvedHTMLContent = document.importNode(this.templateElement.content, true);
      this.sectionElement = improvedHTMLContent.firstElementChild as HTMLElement;
  
      this.type = type;
  
      this.sectionElement.id = `${this.type}-projects`;
      this.attach();
      this.renderContent();
    }
  
    private renderContent() {
      let listID = `${this.type}-projects-lists`;
      this.sectionElement.querySelector('ul')!.id = listID;
      this.sectionElement.querySelector('h2')!.innerHTML = this.type.toUpperCase() + ' PROJECTS';
    } 
  
  
    private attach() {
      this.hostElement.insertAdjacentElement('beforeend', this.sectionElement);
    }
  }
  
  
  class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    formElement: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
  
    constructor() {
  
      let templateElretrieved = document.getElementById("project-input");
      let hostElretrieved = document.getElementById("app");
  
      if(templateElretrieved && hostElretrieved) {
        this.templateElement = templateElretrieved as HTMLTemplateElement;
        this.hostElement = hostElretrieved as HTMLDivElement;
      }
      else {
        throw new Error("null value - unable to retrieve either the form or the application")
      }
  
      let improvedHTMLContent = document.importNode(this.templateElement.content, true);
      this.formElement = improvedHTMLContent.firstElementChild as HTMLFormElement;
  
      this.titleInputElement = this.formElement.querySelector("#title") as HTMLInputElement;
      this.descriptionInputElement = this.formElement.querySelector("#description") as HTMLInputElement;
      this.peopleInputElement = this.formElement.querySelector("#people") as HTMLInputElement;
  
      this.configure2()
      this.attach();
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
  
        console.log(title, desc, people);
      }
  
      this.ClearFields();
    }
  
    private configure2() {
      this.formElement.addEventListener('submit', this.submitHandler2);
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
  
    private attach() {
      this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
    }
  
  }
  
  let prjInput = new ProjectInput();
  let activeProjectList = new ProjectList('active');
  let finishedProjectList = new ProjectList('finished');
  
  