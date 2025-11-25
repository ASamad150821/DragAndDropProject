"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
class ProjectInput {
    constructor() {
        let templateElretrieved = document.getElementById("project-input");
        let hostElretrieved = document.getElementById("app");
        if (templateElretrieved && hostElretrieved) {
            this.templateElement = templateElretrieved;
            this.hostElement = hostElretrieved;
        }
        else {
            throw new Error("null value - unable to retrieve either the form or the application");
        }
        let improvedHTMLContent = document.importNode(this.templateElement.content, true);
        this.formElement = improvedHTMLContent.firstElementChild;
        this.titleInputElement = this.formElement.querySelector("#title");
        this.descriptionInputElement = this.formElement.querySelector("#description");
        this.peopleInputElement = this.formElement.querySelector("#people");
        this.configure2();
        this.attach();
    }
    gatherUserInput() {
        let titleEnteredAsString = this.titleInputElement.value;
        let descriptionEnteredAsString = this.descriptionInputElement.value;
        let peopleEnteredAsString = parseInt(this.peopleInputElement.value);
        if (titleEnteredAsString.trim().length === 0 || descriptionEnteredAsString.trim().length === 0 || peopleEnteredAsString === 0) {
            throw new Error("Invalid input - please try again!");
        }
        else {
            let tupletoreturn = [titleEnteredAsString, descriptionEnteredAsString, peopleEnteredAsString];
            return tupletoreturn;
        }
    }
    ClearFields() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    submitHandler2(event) {
        event.preventDefault();
        let userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            let title = userInput[0];
            let desc = userInput[1];
            let people = userInput[2];
            console.log(title, desc, people);
        }
        this.ClearFields();
    }
    configure2() {
        this.formElement.addEventListener('submit', this.submitHandler2);
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler2", null);
const prjInput = new ProjectInput();
//# sourceMappingURL=app.js.map