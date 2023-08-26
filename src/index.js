import { format, toDate } from "date-fns";
import Masonry from "masonry-layout";

const ChecklistItem = (name, checked) => {
    const toggleComplete = function () {
        this.checked = checked ? false : true;
    }

    const markComplete = function () {
        this.checked = true;
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
        this.completed = completed ? false : true;
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
        titleInput.setAttribute('required', '');
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

        const dueDate = document.createElement('div');
        dueDate.classList.add('input');
        const dueDateLabel = document.createElement('label');
        dueDateLabel.setAttribute('for', `${purpose}-due-date`);
        dueDateLabel.textContent = 'due date';
        const dueDateInput = document.createElement('input');
        dueDateInput.id = `${purpose}-due-date`;
        dueDateInput.setAttribute('name', `${purpose}-due-date`);
        dueDateInput.setAttribute('type', 'date');
        dueDateInput.setAttribute('required', '');
        dueDate.appendChild(dueDateLabel);
        dueDate.appendChild(dueDateInput);

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
        highPriorityInput.setAttribute('value', 'high');
        highPriorityInput.setAttribute('type', 'radio');
        highPriorityInput.setAttribute('checked', '');
        const medPriorityLabel = document.createElement('label');
        medPriorityLabel.textContent = 'medium';
        medPriorityLabel.setAttribute('for', `${purpose}-medium-priority`);
        const medPriorityInput = document.createElement('input');
        medPriorityInput.id = `${purpose}-medium-priority`;
        medPriorityInput.setAttribute('name', `${purpose}-priority`);
        medPriorityInput.setAttribute('value', 'medium');
        medPriorityInput.setAttribute('type', 'radio');
        const lowPriorityLabel = document.createElement('label');
        lowPriorityLabel.textContent = 'low';
        lowPriorityLabel.setAttribute('for', `${purpose}-low-priority`);
        const lowPriorityInput = document.createElement('input');
        lowPriorityInput.id = `${purpose}-low-priority`;
        lowPriorityInput.setAttribute('name', `${purpose}-priority`);
        lowPriorityInput.setAttribute('value', 'low');
        lowPriorityInput.setAttribute('type', 'radio');
        priority.appendChild(priorityLegend);
        priority.appendChild(highPriorityInput);
        priority.appendChild(highPriorityLabel);
        priority.appendChild(medPriorityInput);
        priority.appendChild(medPriorityLabel);
        priority.appendChild(lowPriorityInput);
        priority.appendChild(lowPriorityLabel);

        form.appendChild(title);
        form.appendChild(description);
        form.appendChild(dueDate);
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
        const inputs = createDialog.querySelectorAll('input');
        let allValid = true;
        Array.from(inputs).forEach((input) => {
            if (!input.checkValidity()) {
                console.log('invalid value!');
                allValid = false;
            }
        });
        if (allValid) {
            e.preventDefault();
            const title = createDialog.querySelector('#create-title').value;
            const description = createDialog.querySelector('#create-description').value;
            const dueDate = createDialog.querySelector('#create-due-date').valueAsDate;
            let priority;
            const priorities = createDialog.querySelectorAll('input[type="radio"]');
            Array.from(priorities).forEach((item) => {
                if (item.checked) {
                    priority = item.value;
                }
            })

            createToDo(title, description, dueDate, priority);

            createDialog.close();
            new Masonry( main, {
                itemSelector: '.to-do',
                columnWidth: 300,
                horizontalOrder: true,
            });
        }
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

    const editProject = document.createElement('div');
    editProject.classList.add('input');
    const editProjectLabel = document.createElement('label');
    editProjectLabel.setAttribute('for', 'edit-project');
    editProjectLabel.textContent = 'project';
    const editProjectSelect = document.createElement('select');
    editProjectSelect.id = 'edit-project';
    editProjectSelect.setAttribute('name', 'edit-project');
    editProject.appendChild(editProjectLabel);
    editProject.appendChild(editProjectSelect);

    const editClose = document.createElement('div');
    createClose.classList.add('close');
    const editConfirmBtn = document.createElement('button');
    editConfirmBtn.textContent = 'confirm';
    const editCancelBtn = document.createElement('button');
    editCancelBtn.textContent = 'cancel';
    editClose.appendChild(editConfirmBtn);
    editClose.appendChild(editCancelBtn);

    const editForm = editDialog.querySelector('form');
    editForm.appendChild(editProject);
    editForm.appendChild(editClose);

    editConfirmBtn.addEventListener('click', (e) => {
        const inputs = editDialog.querySelectorAll('input');
        let allValid = true;
        Array.from(inputs).forEach((input) => {
            if (!input.checkValidity()) {
                allValid = false;
            }
        });
        if (allValid) {
            e.preventDefault();
            const toDo = List.getToDos()[editDialog.getAttribute('data-index')];
            console.log(toDo);

            const title = editDialog.querySelector('#edit-title').value;
            const description = editDialog.querySelector('#edit-description').value;
            const dueDate = editDialog.querySelector('#edit-due-date').valueAsDate;
            let priority;
            const priorities = editDialog.querySelectorAll('input[type="radio"]');
            Array.from(priorities).forEach((item) => {
                if (item.checked) {
                    priority = item.value;
                }
            });
            
            let projectName
            const projects = editDialog.querySelectorAll('option');
            Array.from(projects).forEach((item) => {
                if (item.selected) {
                    projectName = item.value;
                }
            });
            const project = projectName === 'none' ? null : List.getProjects().find((proj) => proj.name === projectName);
            console.log(project);

            editToDo(toDo, title, description, dueDate, priority, project);
            editDialog.removeAttribute('data-index');
            editDialog.close();
            new Masonry( main, {
                itemSelector: '.to-do',
                columnWidth: 300,
                horizontalOrder: true,
            });
        }
    })

    editCancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        editDialog.removeAttribute('data-index');
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
    const createProjectBtn = document.createElement('button');
    createProjectBtn.textContent = 'create new project';
    createProjectBtn.classList.add('create-project');

    projects.appendChild(projectsHeader);
    projects.appendChild(createProjectBtn);

    const createProjectPopUp = document.createElement('div');
    const createProjectForm = document.createElement('form');
    const newProjectName = document.createElement('div');
    const projectNameLabel = document.createElement('label');
    projectNameLabel.setAttribute('for', 'project-name');
    projectNameLabel.textContent = 'name';
    const projectNameInput = document.createElement('input')
    projectNameInput.id = 'project-name';
    projectNameInput.setAttribute('required', '')
    projectNameInput.setAttribute('type', 'text')
    const confirmProjectBtn = document.createElement('button');
    confirmProjectBtn.textContent = 'confirm';
    confirmProjectBtn.setAttribute('type', 'submit');
    const cancelProjectBtn = document.createElement('button');
    cancelProjectBtn.textContent = 'cancel';
    newProjectName.appendChild(projectNameLabel);
    newProjectName.appendChild(projectNameInput);
    createProjectForm.appendChild(newProjectName);
    createProjectForm.appendChild(confirmProjectBtn);
    createProjectForm.appendChild(cancelProjectBtn);
    createProjectPopUp.appendChild(createProjectForm);
    
    createProjectBtn.addEventListener('click', () => {
        createProjectBtn.replaceWith(createProjectPopUp);
    })

    const isUnique = function (projName) {
        let unique = true;
        List.getProjects().forEach((item) => {
            if (item.name === projName) {
                unique = false;
            }
        })
        return unique;
    }

    confirmProjectBtn.addEventListener('click', (e) => {
        if (!isUnique(projectNameInput.value)) {
            projectNameInput.setCustomValidity('project name must be unique');
        }
        if (projectNameInput.checkValidity() && isUnique(projectNameInput.value)) {
            e.preventDefault();
            createProject(projectNameInput.value);
            createProjectForm.reset();
            createProjectPopUp.replaceWith(createProjectBtn);
        }
    })

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
            const projectSelect = editDialog.querySelector('select');
            projectSelect.textContent = '';
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'none';
            defaultOption.setAttribute('value', 'none');
            projectSelect.appendChild(defaultOption);
            List.getProjects().forEach((proj) => {
                const project = document.createElement('option');
                project.setAttribute('value', proj.name);
                project.textContent = proj.name;
                projectSelect.appendChild(project);
            })

            const toDo = List.getToDos()[index];

            const title = editDialog.querySelector('input#edit-title');
            title.defaultValue = toDo.title;
            const description = editDialog.querySelector('textarea#edit-description');
            description.defaultValue = toDo.description;
            const dueDate = editDialog.querySelector('input#edit-due-date');
            dueDate.valueAsDate = toDo.dueDate;
            const priority = toDo.priority;
            const priorities = editDialog.querySelectorAll('input[type="radio"]');
            Array.from(priorities).forEach((item) => {
                if (priority === item.value) {
                    item.setAttribute('checked', '');
                }
            });
            const project = toDo.project;
            const projects = editDialog.querySelectorAll('option');
            const none = editDialog.querySelector('option[value="none"]');
            none.setAttribute('selected', '');
            Array.from(projects).forEach((item) => {
                if (project === null) {
                    return;
                }
                if (project.name === item.textContent) {
                    item.setAttribute('selected', '');
                }
            }); 
        });

        container.classList.add('to-do');
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
        if (document.contains(createProjectBtn)) {
            projects.insertBefore(newProjectNode, createProjectBtn);
        } else {
            projects.insertBefore(newProjectNode, createProjectPopUp);
        }
        

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

    const h = createProject('home');
    const a = List.createToDo('clean', '', new Date(), 'high');
    const b = List.createToDo('cook', '', new Date(), 'medium');
    const c = List.createToDo('do homework', 'i need to do my homework to get good grades', new Date(), 'low');
    const d = List.createToDo('feed cat', 'allergic to onions', new Date(), 'medium')

    createProject('school');

    h.add(a);
    h.add(d);
    a.addChecklistItem('living room');
    a.addChecklistItem('kitchen');

    c.addChecklistItem('math');
    c.addChecklistItem('english');
    c.addChecklistItem('science')
    
    renderProject(h);
    renderAll();

    createToDo('title', 'description', new Date(), 'high');
    createToDo('title', 'description', new Date(), 'high');


    return {
        createToDo,
        createProject,
    }

})();
