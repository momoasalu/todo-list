import { format } from "date-fns";
import Masonry from "masonry-layout";

const ChecklistItem = (name, checked) => {
    const toggleComplete = function () {
        checked = checked ? false : true;
    }

    const markComplete = function () {
        checked = true;
    }

    return {name, checked, toggleComplete, markComplete}
}

const ToDo = (title, description, dueDate, priority, project, completed, checklist) => {
    const addChecklistItem = function (name) {
        const newChecklistItem = ChecklistItem(name, false);
        this.checklist.push(newChecklistItem);
    }

    const deleteChecklistItem = function (checklistItem) {
        if (this.checklist.includes(checklistItem)) {
            const index = this.checklist.findIndex((item) => item === checklistItem);
            this.checklist.splice(index, 1);
        }
    }

    const toggleComplete = function () {
        completed = completed ? false : true;
    }

    const edit = function (newTitle, newDescription, newDueDate, newPriority, newProject) {
        this.title = newTitle;
        this.description = newDescription;
        this.dueDate = newDueDate;
        this.priority = newPriority;
        if (this.project !== newProject && newProject !== null) {
            if (this.project !== null) {
                this.project.remove(this);
            };
            newProject.add(this);
            this.project = newProject;
        } else if (newProject === null) {
            if (this.project !== null) {
                this.project.remove(this);
            }; 
            this.project = null;
        }
    }

    return {
        title, 
        description, 
        dueDate, 
        checklist,
        priority, 
        project, 
        completed,
        addChecklistItem,
        deleteChecklistItem,
        toggleComplete,
        edit,
    }
}

const Project = (name, toDos) => {
    const add = function (toDo) {
        if (!toDos.includes(toDo)) {
            toDos.push(toDo);
            toDo.project = this;
        }
    }

    const remove = function (toDo) {
        if (toDos.includes(toDo)) {
            const index = toDos.findIndex(item => item === toDo);
            toDos.splice(index, 1);
        }
    }

    return {
        name,
        toDos,
        add,
        remove
    }
}

const List = (function () {
    let toDos = [];
    let projects = [];

    const getToDos = function () {
        return toDos.map(item => item);
    }

    const getProjects = function () {
        return projects.map(item => item);
    }

    const createToDo = function (title, description, dueDate, priority) {
        const newToDo = ToDo(title, description, dueDate, priority, null, false, []);
        toDos.push(newToDo);
        return newToDo;
    }

    const createProject = function (name) {
        const newProject = Project(name, []);
        projects.push(newProject);
        return newProject;
    }

    const deleteTodo = function (toDo) {
        if (toDos.includes(toDo)) {
            const index = toDos.findIndex(item => item === toDo);
            toDos.splice(index, 1);
            if (toDo.project) {
                toDo.project.remove(toDo);
            };
        }
    }

    const deleteProject = function (proj) {
        toDos.forEach((item) => {
            if (item.project === proj) {
                deleteTodo(item);
            }
        })
        projectIndex = projects.findIndex(project => project === proj);
        projects.splice(projectIndex, 1);
    }

    const getProjectItems = function (proj) {
        return toDos.filter((item) => item.project === proj);
    }

    return {
        getToDos,
        getProjects,
        createToDo,
        createProject,
        deleteTodo,
        deleteProject,
        getProjectItems
    }
})();

const UserInterface = (function () {

    const _populateForm = function (purpose) {
        const form = document.createElement('form');

        const title = document.createElement('div');
        title.classList.add('input');
        const titleLabel = document.createElement('label');
        titleLabel.setAttribute('for', `${purpose}-title`);
        titleLabel.textContent = 'title';
        const titleInput = document.createElement('input');
        titleInput.id = `${purpose}-title`;
        titleInput.setAttribute('name', `${purpose}-title`);
        titleInput.setAttribute('type', 'text');
        title.appendChild(titleLabel);
        title.appendChild(titleInput);

        const description = document.createElement('div');
        description.classList.add('input');
        const descLabel = document.createElement('label');
        descLabel.setAttribute('for', `${purpose}-description`);
        descLabel.textContent = 'description';
        const descInput = document.createElement('textarea');
        descInput.id = `${purpose}-description`;
        descInput.setAttribute('name', `${purpose}-description`);
        description.appendChild(descLabel);
        description.appendChild(descInput);

        const priority = document.createElement('fieldset');
        priority.classList.add('input');
        priority.classList.add('radio');
        const priorityLegend = document.createElement('legend');
        priorityLegend.textContent = 'priority';
        const highPriorityLabel = document.createElement('label');
        highPriorityLabel.textContent = 'high';
        highPriorityLabel.setAttribute('for', `${purpose}-high-priority`);
        const highPriorityInput = document.createElement('input');
        highPriorityInput.id = `${purpose}-high-priority`;
        highPriorityInput.setAttribute('name', `${purpose}-priority`);
        highPriorityInput.setAttribute('type', 'radio');
        const medPriorityLabel = document.createElement('label');
        medPriorityLabel.textContent = 'medium';
        medPriorityLabel.setAttribute('for', `${purpose}-medium-priority`);
        const medPriorityInput = document.createElement('input');
        medPriorityInput.id = `${purpose}-medium-priority`;
        medPriorityInput.setAttribute('name', `${purpose}-priority`);
        medPriorityInput.setAttribute('type', 'radio');
        const lowPriorityLabel = document.createElement('label');
        lowPriorityLabel.textContent = 'low';
        lowPriorityLabel.setAttribute('for', `${purpose}-low-priority`);
        const lowPriorityInput = document.createElement('input');
        lowPriorityInput.id = `${purpose}-low-priority`;
        lowPriorityInput.setAttribute('name', `${purpose}-priority`);
        lowPriorityInput.setAttribute('type', 'radio');
        priority.appendChild(priorityLegend);
        priority.appendChild(highPriorityInput);
        priority.appendChild(highPriorityLabel);
        priority.appendChild(medPriorityInput);
        priority.appendChild(medPriorityLabel);
        priority.appendChild(lowPriorityInput);
        priority.appendChild(lowPriorityLabel);

        const project = document.createElement('div');
        project.classList.add('input');

        form.appendChild(title);
        form.appendChild(description);
        form.appendChild(priority);
        
        return form;
    }

    const createDialog = document.createElement('dialog');
    createDialog.classList.add('create');
    createDialog.appendChild(_populateForm('create'));

    const createClose = document.createElement('div');
    createClose.classList.add('close');
    const createConfirmBtn = document.createElement('button');
    createConfirmBtn.textContent = 'confirm';
    const createCancelBtn = document.createElement('button');
    createCancelBtn.textContent = 'cancel';
    createClose.appendChild(createConfirmBtn);
    createClose.appendChild(createCancelBtn);

    const createForm = createDialog.querySelector('form');
    createForm.appendChild(createClose);

    createConfirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        createToDo('hello', 'world', new Date(), 'high');
        createDialog.close();
        new Masonry( main, {
            itemSelector: '.to-do',
            columnWidth: 300,
            horizontalOrder: true,
        });
    })

    createCancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const form = createDialog.querySelector('form');
        form.reset();
        createDialog.close();
    })

    const editDialog = document.createElement('dialog');
    editDialog.classList.add('edit');
    editDialog.appendChild(_populateForm('edit'));

    const editClose = document.createElement('div');
    createClose.classList.add('close');
    const editConfirmBtn = document.createElement('button');
    editConfirmBtn.textContent = 'confirm';
    const editCancelBtn = document.createElement('button');
    editCancelBtn.textContent = 'cancel';
    editClose.appendChild(editConfirmBtn);
    editClose.appendChild(editCancelBtn);

    const editForm = editDialog.querySelector('form');
    editForm.appendChild(editClose);

    editConfirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const toDo = List.getToDos()[editDialog.getAttribute('data-index')];
        console.log(toDo);
        editToDo(toDo, 'hello', 'world', new Date(), 'low', null);
        console.log(toDo);
        editDialog.close();
        new Masonry( main, {
            itemSelector: '.to-do',
            columnWidth: 300,
            horizontalOrder: true,
        });
    })

    editCancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const form = editDialog.querySelector('form');
        form.reset();
        editDialog.close();
    })

    const header = document.createElement('header');
    const aside = document.createElement('aside');
    const main = document.createElement('main');

    const heading = document.createElement('h1');
    heading.textContent = 'to-do list!'
    header.appendChild(heading);

    const home = document.createElement('h2');
    home.textContent = 'home';
    const today = document.createElement('h2');
    today.textContent = 'today'; 
    const week = document.createElement('h2');
    week.textContent = 'this week';
    const projects = document.createElement('div');
    const projectsHeader = document.createElement('h2');
    projectsHeader.textContent = 'projects';
    projects.appendChild(projectsHeader);
    const createBtn = document.createElement('button');
    createBtn.textContent = 'create to-do';
    createBtn.addEventListener('click', () => {
        createDialog.showModal();
    })

    aside.appendChild(home);
    aside.appendChild(today);
    aside.appendChild(week);
    aside.appendChild(projects);
    aside.appendChild(createBtn);

    document.body.appendChild(createDialog);
    document.body.appendChild(editDialog);
    document.body.appendChild(header);
    document.body.appendChild(aside);
    document.body.appendChild(main);

    const resetDataIndex = function (array) {
        let index = 0;
        array.forEach((item) => {
            item.setAttribute('data-index', index);
            index++
        })
    }

    const renderChecklist = function (toDo) {
        const container = document.createElement('div');
        container.classList.add('checklist-item');
        toDo.checklist.forEach((item) => {
            const check = document.createElement('div');
            check.textContent = item.name;
            container.appendChild(check);
        })

        return container;
    }

    const renderToDo = function (toDo) {
        const container = document.createElement('div');

        const title = document.createElement('h4');
        title.textContent = toDo.title;
        const description = document.createElement('p');
        description.textContent = toDo.description;
        const dueDate = document.createElement('p');
        dueDate.textContent = format(toDo.dueDate, 'dd MMMM yyyy');
        container.setAttribute('data-priority', toDo.priority);
        const checklist = renderChecklist(toDo);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'delete';
        deleteBtn.addEventListener('click', () => {
            List.deleteTodo(toDo);
            const toDoItem = deleteBtn.parentElement
            main.removeChild(toDoItem);
            const toDoItems = main.querySelectorAll('div.to-do');
            resetDataIndex(Array.from(toDoItems));
            new Masonry( main, {
                itemSelector: '.to-do',
                columnWidth: 300,
                horizontalOrder: true,
            });
        })

        const editBtn = document.createElement('button');
        editBtn.textContent = 'edit';
        editBtn.addEventListener('click', () => {
            editDialog.showModal();
            const index = editBtn.parentElement.getAttribute('data-index');
            editDialog.setAttribute('data-index', index);
            const form = editDialog.querySelector('form');
        });

        container.classList.add('to-do')
        container.append(title);
        container.append(description);
        container.append(dueDate);
        container.append(checklist);
        container.append(deleteBtn);
        container.append(editBtn);

        return container;
    }

    const renderAll = function () {
        main.textContent = '';
        List.getToDos().forEach((item) => {
            const toDo = renderToDo(item);
            main.appendChild(toDo);
        })
        const toDoItems = main.querySelectorAll('div.to-do');
        resetDataIndex(Array.from(toDoItems));
        new Masonry( main, {
            itemSelector: '.to-do',
            columnWidth: 300,
            horizontalOrder: true,
        });
    }

    const renderProject = function (project) {
        main.textContent = '';
        List.getProjectItems(project).forEach((item) => {
            const toDo = renderToDo(item);
            main.appendChild(toDo);
        })
        const toDoItems = main.querySelectorAll('div.to-do');
        resetDataIndex(Array.from(toDoItems));
        new Masonry( main, {
            itemSelector: '.to-do',
            columnWidth: 300,
            horizontalOrder: true,
        });
    }

    const createToDo = function (title, description, dueDate, priority) {
        const newToDo = List.createToDo(title, description, dueDate, priority);
        main.appendChild(renderToDo(newToDo));
        const toDoItems = main.querySelectorAll('div.to-do');
        resetDataIndex(Array.from(toDoItems));
        new Masonry( main, {
            itemSelector: '.to-do',
            columnWidth: 300,
            horizontalOrder: true,
        });
    }

    const createProject = function (name) {
        const newProject = List.createProject(name);
        const newProjectNode = document.createElement('div');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'delete';
        
        deleteBtn.addEventListener('click', () => {
            let toDoItems = main.querySelectorAll('.to-do');
            let index = 0;
            Array.from(toDoItems).forEach((item) => {
                if (List.getToDos()[index].project === newProject) {
                    main.removeChild(item);
                }
                index++;
            })

            List.deleteTodo(newProject);
            resetDataIndex(Array.from(main.querySelectorAll('.to-do')));
            const projectItem = deleteBtn.parentElement;
            projects.removeChild(projectItem);

            new Masonry( main, {
                // options
                itemSelector: '.to-do',
                columnWidth: 300,
                horizontalOrder: true,
            });
        })

        newProjectNode.textContent = newProject.name;
        newProjectNode.classList.add('project');
        newProjectNode.classList.add(newProject.name);
        newProjectNode.appendChild(deleteBtn);
        projects.appendChild(newProjectNode);

        return newProject;
    }

    const editToDo = function (toDo, newTitle, newDescription, newDueDate, newPriority, newProject) {
        toDo.edit(newTitle, newDescription, newDueDate, newPriority, newProject);
        let toDoItem = main.querySelector(`.to-do[data-index="${List.getToDos().findIndex((item) => item === toDo)}"]`)
        toDoItem.textContent = '';

        const title = document.createElement('h4');
        title.textContent = toDo.title;
        const description = document.createElement('p');
        description.textContent = toDo.description;
        const dueDate = document.createElement('p');
        dueDate.textContent = format(toDo.dueDate, 'dd MMMM yyyy');
        toDoItem.setAttribute('data-priority', toDo.priority);
        const checklist = renderChecklist(toDo);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'delete';
        deleteBtn.addEventListener('click', () => {
            List.deleteTodo(toDo);
            const toDoItem = deleteBtn.parentElement
            main.removeChild(toDoItem);
            const toDoItems = main.querySelectorAll('div.to-do');
            resetDataIndex(Array.from(toDoItems));
            new Masonry( main, {
                itemSelector: '.to-do',
                columnWidth: 300,
                horizontalOrder: true,
            });
        })

        const editBtn = document.createElement('button');
        editBtn.textContent = 'edit';
        editBtn.addEventListener('click', () => {
            editDialog.showModal();
            const index = editBtn.parentElement.getAttribute('data-index');
            editDialog.setAttribute('data-index', index);
            const form = editDialog.querySelector('form');
            console.log(form);
        });

        toDoItem.appendChild(title);
        toDoItem.appendChild(description);
        toDoItem.appendChild(dueDate);
        toDoItem.appendChild(checklist);
        toDoItem.appendChild(deleteBtn);
        toDoItem.appendChild(editBtn);
    }
    
    return {
        createToDo,
        createProject,
    }

})();
