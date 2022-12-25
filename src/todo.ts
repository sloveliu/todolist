import { v4 as uuidv4 } from 'uuid';
import edit from "./assets/edit.png";
import trash from "./assets/trash.png";

type TodoList = {
	[key: string]: TodoDetail;
};
type TodoDetail = {
	todoText: string;
	completed: boolean;
};

export default class Todo {
	todoList: TodoList;
	todoElement: HTMLDivElement;
	addTodoBtn: HTMLButtonElement;
	newTodoModal: HTMLDivElement;
	updateTodoModal: HTMLDivElement;
	addNewModalCross: HTMLDivElement;
	updateModalCross: HTMLDivElement;
	addTodoTextInput: HTMLInputElement;
	updateTodoTextInput: HTMLInputElement;
	addNewBtn: HTMLButtonElement;
	updateModalBtn: HTMLButtonElement;
	updateTodoBtn: Element[];
	deleteTodoBtn: Element[];
	constructor() {
		this.todoList = {};
		this.todoElement = document.querySelector('#todoElement') as HTMLDivElement;
		this.addTodoBtn = document.querySelector('#addTodoBtn') as HTMLButtonElement;
		this.newTodoModal = document.querySelector('#newTodoModal') as HTMLDivElement;
		this.updateTodoModal = document.querySelector('#updateTodoModal') as HTMLDivElement;
		this.addNewModalCross = document.querySelector('#addNewModalCross') as HTMLDivElement;
		this.updateModalCross = document.querySelector('#updateModalCross') as HTMLDivElement;
		this.addTodoTextInput = document.querySelector('#addTodoTextInput') as HTMLInputElement;
		this.updateTodoTextInput = document.querySelector('#updateTodoTextInput') as HTMLInputElement;
		this.addNewBtn = document.querySelector('#addNewBtn') as HTMLButtonElement;
		this.updateModalBtn = document.querySelector('#updateModalBtn') as HTMLButtonElement;
		this.getLocalStorage();
		this.events();
	}
	events() {
		this.renderTodo();
		this.addTodoBtn.addEventListener('click', e =>
			this.toggleAddNewModal(e)
		);
		this.addNewModalCross.addEventListener('click', e =>
			this.toggleAddNewModal(e)
		);
		this.updateModalCross.addEventListener('click', e =>
			this.toggleUpdateModal(e)
		);
		this.addNewBtn.addEventListener('click', e => this.addTodo(e));
		this.updateModalBtn.addEventListener('click', e => this.updateTodo(e));
		this.todoElement.addEventListener('click', e => {
			if (e !== null && e.target instanceof HTMLElement) {
				const element = e.target;
				const id = element.dataset.id as string;
				if (element.id === 'toggleComplete') {
					this.toggleTodo(id);
				}
				if (element.id === 'deleteTodoBtn') {
					this.deleteTodo(id);
				}
				if (element.id === 'updateTodoBtn') {
					this.updateTodoTextInput.value = this.todoList[id].todoText;
					this.updateTodoModal.dataset.id = String(id);
					this.toggleUpdateModal();
				}
			}
		});
	}
	renderTodo() {
		let viewTodo: string = '';
		if (!this.todoList) return;
		Object.entries(this.todoList).forEach(([key, value]) => {
			if (value.completed) {
				viewTodo += `
            <li class="border-b border-purple-400 text-xl py-4 flex justify-between items-center">
        <div class="flex items-center">
          <img id="toggleComplete" data-id="${key}" class="w-8 mr-2"
            src="https://cdn.glitch.com/0946ee55-e0f2-43ff-b69c-572b4d821198%2Fcheckbox.png?v=1577886293867" />
          ${value.todoText}
        </div>
        <div class="flex">
        <img id="updateTodoBtn" data-id="${key}" class="updateTodoBtn" style="width: 18px; margin-right: 5px;" />
        <img id="deleteTodoBtn" data-id="${key}" class="deleteTodoBtn" style="width: 18px;"/>
        </div>
      </li>
            `;
			} else {
				viewTodo += `
            <li class="border-b border-purple-400 text-xl py-4 flex justify-between items-center">
              <div class="flex items-center">
                <span id="toggleComplete" data-id="${key}" class="inline-block mr-2 w-8 h-8 bg-purple-200"></span>${value.todoText}
              </div>
              <div class="flex">
                <img id="updateTodoBtn" data-id="${key}" class="updateTodoBtn" style="width: 18px; margin-right: 5px;" />
                <img id="deleteTodoBtn" data-id="${key}" class="deleteTodoBtn" style="width: 18px;"/>
              </div>
            </li>
            `;
			}
		});
		this.todoElement.innerHTML = viewTodo;
		this.updateTodoBtn = Array.from(document.querySelectorAll('.updateTodoBtn'));
		this.deleteTodoBtn = Array.from(document.querySelectorAll('.deleteTodoBtn'));
		this.updateTodoBtn.forEach(element => {
			(element as HTMLImageElement).src = edit;
		});
		this.deleteTodoBtn.forEach(element => {
			(element as HTMLImageElement).src = trash;
		});
	}
	deleteTodo(id: string) {
		console.log(id);
		delete this.todoList[id];
		this.setLocalStorage();
		this.renderTodo();
	}
	toggleTodo(id: string) {
		this.todoList[id].completed = !this.todoList[id].completed;
		this.setLocalStorage();
		this.renderTodo();
	}
	addTodo(e: MouseEvent) {
		e.preventDefault();
		this.todoList[uuidv4()] = {
			todoText: this.addTodoTextInput.value,
			completed: false,
		};
		this.addTodoTextInput.value = '';
		this.setLocalStorage();
		this.toggleAddNewModal();
		this.renderTodo();
	}
	updateTodo(e: MouseEvent) {
		e.preventDefault();
		const id = this.updateTodoModal.dataset.id as string;
		this.todoList[id].todoText = this.updateTodoTextInput.value;
		this.updateTodoModal.dataset.id = '';
		this.setLocalStorage();
		this.toggleUpdateModal();
		this.renderTodo();
	}

	toggleAddNewModal(e: MouseEvent | null = null) {
		e && e.preventDefault();
		this.newTodoModal.classList.toggle('hidden');
	}
	toggleUpdateModal(e: MouseEvent | null = null) {
		e && e.preventDefault();
		this.updateTodoModal.classList.toggle('hidden');
	}
	getLocalStorage() {
		let data = localStorage.getItem("todoList");
		if (data) this.todoList = JSON.parse(data);
	}
	setLocalStorage() {
		localStorage.setItem('todoList', JSON.stringify(this.todoList));
	}
}