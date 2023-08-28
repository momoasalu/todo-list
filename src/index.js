import { format, formatISO, isThisWeek, isToday, parseJSON } from "date-fns";
import Masonry from "masonry-layout";
import './style.css';

const ChecklistItem = (name, checked) => {
    const toggleComplete = function () {
        this.checked = this.checked ? false : true;
        StorageController.updateStorage();
    }

    const markComplete = function () {
        this.checked = true;
    }

    const markIncomplete = function() {
        this.checked = false;
    }

    const changeName = function (newName) {
        this.name = newName;
        StorageController.updateStorage();
    }

    return {name, checked, toggleComplete, markComplete, markIncomplete, changeName}
}

const ToDo = (title, description, dueDate, priority, project, completed, checklist) => {
    const setProject = function (newProject) {
        this.project = newProject;
    }

    const addChecklistItem = function (name, checked=false) {
        const newChecklistItem = ChecklistItem(name, checked);
        this.checklist.push(newChecklistItem);
        StorageController.updateStorage();
        return newChecklistItem;
    }

    const deleteChecklistItem = function (checklistItem) {
        if (this.checklist.includes(checklistItem)) {
            const index = this.checklist.indexOf(checklistItem);
            this.checklist.splice(index, 1);
            StorageController.updateStorage();
        }
    }

    const toggleComplete = function (all = true) {
        this.completed = this.completed ? false : true;
        if (all) {
            this.checklist.forEach((checkitem) => {
                if (this.completed === false) {
                    checkitem.markIncomplete();
                } else {
                    checkitem.markComplete();
                }
            })
        }
        StorageController.updateStorage();
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
            this.setProject(newProject);
        } else if (newProject === null) {
            if (this.project !== null) {
                this.project.remove(this);
            }; 
            this.setProject(null);
        }
        StorageController.updateStorage();
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
        setProject,
    }
}

const Project = (name, toDos) => {
    const add = function (toDo) {
        if (!toDos.includes(toDo)) {
            toDos.push(toDo);
        }
    }

    const remove = function (toDo) {
        if (toDos.includes(toDo)) {
            const index = toDos.findIndex(item => item === toDo);
            toDos.splice(index, 1);
        }
    }

    const changeName = function (newName) {
        this.name = newName;
        StorageController.updateStorage();
    }

    return {
        name,
        toDos,
        add,
        remove,
        changeName,
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

    const addToDoToProject = function (toDo, project) {
        toDo.project = project;
        project.toDos.push(toDo);
        StorageController.updateStorage();
    }

    const createToDo = function (title, description, dueDate, priority, project = null) {
        const newToDo = ToDo(title, description, dueDate, priority, project, false, []);
        toDos.push(newToDo);
        StorageController.updateStorage();
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
            StorageController.updateStorage();
        }
    }

    const deleteProject = function (proj) {
        toDos.forEach((item) => {
            if (item.project === proj) {
                deleteTodo(item);
            }
        })
        const projectIndex = projects.findIndex(project => project === proj);
        projects.splice(projectIndex, 1);
        StorageController.updateStorage();
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
        getProjectItems,
        addToDoToProject
    }
})();

const UserInterface = (function () {
    const _retitleMain = function (newTitle) {
        const title = document.querySelector('.title');
        title.textContent = newTitle;
    }

    const _renderEmptyMessage = function () {
        const main = document.querySelector('#main');
        if (main.childNodes.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.classList.add('empty-message');
            emptyMessage.textContent = 'no tasks here!'
            main.appendChild(emptyMessage);
        }
    }

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
    const buildNewToDoDialog = function () {
        const main = document.querySelector('#main');

        const dialog = document.createElement('dialog');
        dialog.classList.add('create');
        const form = _populateForm('create');
        dialog.appendChild(form);

        const closeDiv = document.createElement('div');
        closeDiv.classList.add('close');
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'confirm';
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'cancel';
        closeDiv.appendChild(confirmBtn);
        closeDiv.appendChild(cancelBtn);

        form.appendChild(closeDiv);

        confirmBtn.addEventListener('click', (e) => {
            const inputs = dialog.querySelectorAll('input');
            let allValid = true;
            Array.from(inputs).forEach((input) => {
                if (!input.checkValidity()) {
                    allValid = false;
                }
            });
            if (allValid) {
                e.preventDefault();
                const title = dialog.querySelector('#create-title').value;
                const description = dialog.querySelector('#create-description').value;
                const dueDate = dialog.querySelector('#create-due-date').valueAsDate;
                let priority;
                const priorities = dialog.querySelectorAll('input[type="radio"]');
                Array.from(priorities).forEach((item) => {
                    if (item.checked) {
                        priority = item.value;
                    }
                });

                if (main.hasAttribute('data-project')) {
                    const project = List.getProjects().find((item) => item.name === main.getAttribute('data-project'));
                    const newToDo = List.createToDo(title, description, dueDate, priority, project);
                    const toDoNode = createToDo(newToDo)
                    toDoNode.setAttribute('data-index', List.getProjectItems(project).length - 1);
                    main.appendChild(toDoNode);
                } else if (main.hasAttribute('data-date')) {
                    const newToDo = List.createToDo(title, description, dueDate, priority);
                    if (document.querySelector('.title').textContent === 'this week') {
                        if (isThisWeek(newToDo.dueDate)) {
                            const toDoNode = createToDo(newToDo);
                            toDoNode.removeChild(toDoNode.querySelector('button.delete'));
                            toDoNode.removeChild(toDoNode.querySelector('button.edit'));
                            main.appendChild(toDoNode);
                        }
                    } else if (document.querySelector('.title').textContent === 'today') {
                        if (isToday(newToDo.dueDate)) {
                            const toDoNode = createToDo(newToDo);
                            toDoNode.removeChild(toDoNode.querySelector('button.delete'));
                            toDoNode.removeChild(toDoNode.querySelector('button.edit'));
                            main.appendChild(toDoNode);
                        }
                    }
                } else {
                    const newToDo = List.createToDo(title, description, dueDate, priority);
                    const toDoNode = createToDo(newToDo)
                    toDoNode.setAttribute('data-index', List.getToDos().length - 1);
                    main.appendChild(toDoNode);
                }

                if (main.querySelector('.empty-message')) {
                    main.querySelector('.empty-message').remove();
                }

                form.reset();
                dialog.close();

                new Masonry( main, {
                    itemSelector: '.to-do',
                    columnWidth: 300,
                    horizontalOrder: true,
                });
            }
        });

        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            form.reset();
            dialog.close();
        });

        document.body.appendChild(dialog);
    }

    const buildEditToDoDialog = function () {
        const main = document.querySelector('#main');
        const dialog = document.createElement('dialog');
        dialog.classList.add('edit');
        const form = _populateForm('edit');
        dialog.appendChild(form);

        const projectInput = document.createElement('div');
        projectInput.classList.add('input');
        const projectLabel = document.createElement('label');
        projectLabel.setAttribute('for', 'edit-project');
        projectLabel.textContent = 'project';
        const projectSelect = document.createElement('select');
        projectSelect.id = 'edit-project';
        projectSelect.setAttribute('name', 'edit-project');
        projectInput.appendChild(projectLabel);
        projectInput.appendChild(projectSelect);

        const closeDiv = document.createElement('div');
        closeDiv.classList.add('close');
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'confirm';
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'cancel';
        closeDiv.appendChild(confirmBtn);
        closeDiv.appendChild(cancelBtn);

        form.appendChild(projectInput);
        form.appendChild(closeDiv);

        confirmBtn.addEventListener('click', (e) => {
            const inputs = dialog.querySelectorAll('input');
            let allValid = true;
            Array.from(inputs).forEach((input) => {
                if (!input.checkValidity()) {
                    allValid = false;
                }
            });
            if (allValid) {
                e.preventDefault();

                let toDo;
                if (main.hasAttribute('data-project')) {
                    let project = List.getProjects().find((item) => item.name === main.getAttribute('data-project'));
                    toDo = List.getProjectItems(project)[dialog.getAttribute('data-index')];
                } else {
                    toDo = List.getToDos()[dialog.getAttribute('data-index')];
                }

                const title = dialog.querySelector('#edit-title').value;
                const description = dialog.querySelector('#edit-description').value;
                const dueDate = dialog.querySelector('#edit-due-date').valueAsDate;
                let priority;
                const priorities = dialog.querySelectorAll('input[type="radio"]');
                Array.from(priorities).forEach((item) => {
                    if (item.checked) {
                        priority = item.value;
                    }
                });
                
                let projectName
                const projects = dialog.querySelectorAll('option');
                Array.from(projects).forEach((item) => {
                    if (item.selected) {
                        projectName = item.value;
                    }
                });
                const project = projectName === 'none' ? null : List.getProjects().find((proj) => proj.name === projectName);

                editToDo(toDo, title, description, dueDate, priority, project);
                dialog.removeAttribute('data-index');
                dialog.close();
                new Masonry( main, {
                    itemSelector: '.to-do',
                    columnWidth: 300,
                    horizontalOrder: true,
                });
            }
        });

        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            dialog.removeAttribute('data-index');
            form.reset();
            dialog.close();
        });

        document.body.appendChild(dialog);
    }

    const buildHeader = function () {
        const header = document.querySelector('header');

        const heading = document.createElement('h1');
        heading.textContent = 'to-do list!'
        header.appendChild(heading);

    }

    const buildSidebar = function () {
        const main = document.querySelector('#main');

        const aside = document.querySelector('aside');
    
        const home = document.createElement('h2');
        home.textContent = 'home';

        home.addEventListener('click', () => {
            main.removeAttribute('data-project');
            main.removeAttribute('data-date');
            renderAll();
        });

        const today = document.createElement('h2');
        today.textContent = 'today'; 

        today.addEventListener('click', () => {
            _retitleMain('today');
            main.removeAttribute('data-project');
            main.setAttribute('data-date', 'today');
            main.textContent = '';

            List.getToDos().forEach((item) => {
                if (isToday(item.dueDate)) {
                    const toDoItem = createToDo(item);
                    const deleteBtn = toDoItem.querySelector('button.delete');
                    const editBtn = toDoItem.querySelector('button.edit');
                    toDoItem.removeChild(deleteBtn);
                    toDoItem.removeChild(editBtn);
                    main.appendChild(toDoItem);
                }
            });

            if (!main.hasChildNodes()) {
                _renderEmptyMessage();
                return;
            }

            new Masonry( main, {
                itemSelector: '.to-do',
                columnWidth: 300,
                horizontalOrder: true,
            });

        })

        const week = document.createElement('h2');
        week.textContent = 'this week';

        week.addEventListener('click', () => {
            _retitleMain('this week');
            main.removeAttribute('data-project');
            main.setAttribute('data-date', 'week');
            main.textContent = '';

            List.getToDos().forEach((item) => {
                if (isThisWeek(item.dueDate)) {
                    const toDoItem = createToDo(item);
                    const deleteBtn = toDoItem.querySelector('button.delete');
                    const editBtn = toDoItem.querySelector('button.edit');
                    toDoItem.removeChild(deleteBtn);
                    toDoItem.removeChild(editBtn);
                    main.appendChild(toDoItem);
                };
            });

            if (!main.hasChildNodes()) {
                _renderEmptyMessage();
                return;
            }

            new Masonry( main, {
                itemSelector: '.to-do',
                columnWidth: 300,
                horizontalOrder: true,
            });
        });

        const projects = buildProjectDiv();
        const createBtn = buildNewToDoButton();

        aside.appendChild(home);
        aside.appendChild(today);
        aside.appendChild(week);
        aside.appendChild(projects);
        aside.appendChild(createBtn);
    }

    const buildProjectDiv = function () {
        const projectsDiv = document.createElement('div');
        projectsDiv.classList.add('projects');
        const header = document.createElement('h2');
        header.textContent = 'projects';
        const createBtn = document.createElement('button');
        createBtn.textContent = 'new project';
        createBtn.classList.add('create-project');

        projectsDiv.appendChild(header);
        projectsDiv.appendChild(createBtn);

        const createPopUp = document.createElement('div');
        createPopUp.classList.add('create-pop-up')
        const createForm = document.createElement('form');
        const projectInput = document.createElement('input')
        projectInput.id = 'project-name';
        projectInput.setAttribute('required', '')
        projectInput.setAttribute('type', 'text')
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'confirm';
        confirmBtn.setAttribute('type', 'submit');
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'cancel';

        createForm.appendChild(projectInput);
        createForm.appendChild(confirmBtn);
        createForm.appendChild(cancelBtn);

        createPopUp.appendChild(createForm);
        
        createBtn.addEventListener('click', () => {
            createBtn.replaceWith(createPopUp);
        })

        confirmBtn.addEventListener('click', (e) => {
            const projectNames = List.getProjects().map((item) => item.name);
            if (projectNames.includes(projectInput.value)) {
                projectInput.setCustomValidity('project name must be unique');
            };
            if (projectInput.checkValidity() && !projectNames.includes(projectInput.value)) {
                e.preventDefault();
                if (document.querySelector('.create-project')) {
                    projectsDiv.insertBefore(createProject(projectInput.value), document.querySelector('.create-project'));
                } else {
                    projectsDiv.insertBefore(createProject(projectInput.value), document.querySelector('.create-pop-up'));
                }
                createForm.reset();
                createPopUp.replaceWith(createBtn);
            };

            StorageController.updateStorage();
        });

        cancelBtn.addEventListener('click', () => {
            createForm.reset();
            createPopUp.replaceWith(createBtn);
        });

        return projectsDiv;
    }

    const buildNewToDoButton = function () {
        const createBtn = document.createElement('button');
        createBtn.textContent = 'create to-do';

        createBtn.addEventListener('click', () => {
            const createDialog = document.querySelector('dialog.create');
            createDialog.showModal();
        });

        return createBtn;
    }

    const buildMain = function () {
        const main = document.querySelector('main');

        const title = document.createElement('h1');
        title.textContent = 'home';
        title.classList.add('title');

        const mainBox = document.createElement('div');
        mainBox.id = 'main';

        main.appendChild(title);
        main.appendChild(mainBox);
    }

    const _resetAttributes = function (array, attr) {
        let index = 0;
        array.forEach((item) => {
            item.setAttribute(attr, index);
            index++
        })
    }

    const createCheckListItem = function (checkListItem, toDo) {
        const index = toDo.checklist.indexOf(checkListItem);
        const check = document.createElement('div');
        check.setAttribute('data-order', index);
        if (checkListItem.checked) {
            check.classList.add('checked');
        } else {
            check.classList.add('unchecked')
        }

        const checkBox = document.createElement('div');
        checkBox.classList.add('checklist-checkbox');
        checkBox.style.backgroundColor = 'green';
        checkBox.style.width = '30px';
        checkBox.style.height = '30px';

        const checkText = document.createElement('p');
        checkText.textContent = checkListItem.name;
        check.classList.add('check-item');

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'delete';
        const editBtn = document.createElement('button');
        editBtn.textContent = 'edit';

        const editPopUp = document.createElement('div');
        const editForm = document.createElement('form');
        const editInput = document.createElement('input');
        editInput.setAttribute('type', 'text');
        editInput.setAttribute('required', '');
        const editConfirmBtn = document.createElement('button');
        editConfirmBtn.textContent = 'confirm'
        const editCancelBtn = document.createElement('button');
        editCancelBtn.textContent = 'cancel';

        editForm.appendChild(editInput);
        editForm.appendChild(editConfirmBtn);
        editForm.appendChild(editCancelBtn);
        editPopUp.appendChild(editForm);

        checkBox.addEventListener('click', () => {
            checkListItem.toggleComplete();
            if (toDo.completed) {
                toDo.toggleComplete(false);
                check.parentElement.parentElement.classList.add('unchecked');
                check.parentElement.parentElement.classList.remove('checked');
            }
            check.classList.toggle('unchecked');
            check.classList.toggle('checked');
        })

        deleteBtn.addEventListener('click', () => {
            toDo.deleteChecklistItem(checkListItem);
            const container = check.parentElement;
            check.remove();
            _resetAttributes(Array.from(container.querySelectorAll('.check-item')), 'data-order');
        });

        editBtn.addEventListener('click', () => {
            check.replaceWith(editPopUp);
            editInput.defaultValue = checkText.textContent;
        });

        editConfirmBtn.addEventListener('click', (e) => {
            if (editInput.checkValidity()) {
                checkListItem.changeName(editInput.value);
                e.preventDefault();
                checkText.textContent = editInput.value;
                editPopUp.replaceWith(check);
            }
        });

        editCancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            editForm.reset();
            editPopUp.replaceWith(check);
        })

        check.appendChild(checkBox);
        check.appendChild(checkText);
        check.appendChild(deleteBtn);
        check.appendChild(editBtn);

        return check;
    }

    const createChecklist = function (toDo) {
        const container = document.createElement('div');
        container.classList.add('checklist');
        toDo.checklist.forEach((item) => {
            container.appendChild(createCheckListItem(item, toDo));
        });

        return container;
    }

    const createToDo = function (toDo) {
        const main = document.querySelector('#main');
        const container = document.createElement('div');

        if (toDo.completed) {
            container.classList.add('checked');
        } else {
            container.classList.add('unchecked');
        }

        const checkBox = document.createElement('div');
        checkBox.classList.add('checkbox');
        checkBox.style.backgroundColor = 'red';
        checkBox.style.width = '30px';
        checkBox.style.height = '30px';

        const title = document.createElement('h4');
        title.textContent = toDo.title;
        title.classList.add('title');
        const project = document.createElement('h5');
        project.textContent = toDo.project === null ? '' : toDo.project.name;
        project.classList.add('project');
        const description = document.createElement('p');
        description.textContent = toDo.description;
        description.classList.add('description');
        const dueDate = document.createElement('p');
        dueDate.textContent = format(toDo.dueDate, 'dd MMM yyyy').toLowerCase();
        container.setAttribute('data-priority', toDo.priority);
        dueDate.classList.add('due-date');
        const checklist = createChecklist(toDo);

        const addChecklistItemBtn = document.createElement('button');
        addChecklistItemBtn.classList.add('add-checklist');
        addChecklistItemBtn.textContent = '+';

        const addPopUp = document.createElement('div');
        const addForm = document.createElement('form');
        const addInput = document.createElement('input');
        addInput.setAttribute('type', 'text');
        addInput.setAttribute('required', '');
        const addConfirmBtn = document.createElement('button');
        addConfirmBtn.textContent = 'confirm'
        const addCancelBtn = document.createElement('button');
        addCancelBtn.textContent = 'cancel';

        addForm.appendChild(addInput);
        addForm.appendChild(addConfirmBtn);
        addForm.appendChild(addCancelBtn);
        addPopUp.appendChild(addForm);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.textContent = 'delete';

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit');
        editBtn.textContent = 'edit';

        checklist.appendChild(addChecklistItemBtn);

        addChecklistItemBtn.addEventListener('click', () => {
            addChecklistItemBtn.replaceWith(addPopUp);
        });

        addConfirmBtn.addEventListener('click', (e) => {
            if (addInput.checkValidity()) {
                e.preventDefault();
                const checkListItem = toDo.addChecklistItem(addInput.value);
                checklist.insertBefore(createCheckListItem(checkListItem, toDo), addPopUp);
                addPopUp.replaceWith(addChecklistItemBtn);

                addForm.reset();
                
                new Masonry( main, {
                    itemSelector: '.to-do',
                    columnWidth: 300,
                    horizontalOrder: true,
                });
            }
        });

        addCancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addForm.reset();
            addPopUp.replaceWith(addChecklistItemBtn);
        })

        checkBox.addEventListener('click', () => {
            toDo.toggleComplete();
            container.classList.toggle('checked');
            container.classList.toggle('unchecked');

            Array.from(container.querySelectorAll('.check-item')).forEach((item) => {
                if (toDo.completed) {
                    item.classList.remove('unchecked');
                    item.classList.add('checked');
                } else {
                    item.classList.remove('checked');
                    item.classList.add('unchecked');
                }
            })
        }) 

        deleteBtn.addEventListener('click', () => {
            List.deleteTodo(toDo);
            const toDoItem = deleteBtn.parentElement
            main.removeChild(toDoItem);
            if (!main.hasChildNodes()) {
                _renderEmptyMessage();
                return;
            }
            const toDoItems = main.querySelectorAll('div.to-do');
            _resetAttributes(Array.from(toDoItems), 'data-index');
            new Masonry( main, {
                itemSelector: '.to-do',
                columnWidth: 300,
                horizontalOrder: true,
            });
        })

        editBtn.addEventListener('click', () => {
            const editDialog = document.querySelector('dialog.edit');
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
            
            let toDo;
            if (main.hasAttribute('data-project')) {
                const project = List.getProjects().find((item) => item.name === main.getAttribute('data-project'));
                toDo = List.getProjectItems(project)[index];
            } else {
                toDo = List.getToDos()[index];
            }

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
        container.append(checkBox);
        container.append(title);
        container.append(project);
        container.append(description);
        container.append(dueDate);
        container.append(checklist);
        container.append(deleteBtn);
        container.append(editBtn);

        return container;
    }

    const createProject = function (name) {
        const main = document.querySelector('#main');

        const newProject = List.createProject(name);
        const projectNode = document.createElement('div');
        const deleteBtn = document.createElement('button');
        const editBtn = document.createElement('button');
        const editPopUp = document.createElement('div');
        const editForm = document.createElement('form');

        const projectText = document.createElement('div');
        projectText.classList.add('name');
        projectText.textContent = newProject.name;

        projectNode.classList.add('project');
        projectNode.setAttribute('data-name', newProject.name);
        projectNode.appendChild(projectText);
        projectNode.appendChild(deleteBtn);
        projectNode.appendChild(editBtn);
        
        const nameInput = document.createElement('input');
        nameInput.setAttribute('required', '');
        nameInput.setAttribute('type', 'text');

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'confirm';
        confirmBtn.setAttribute('type', 'submit');
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'cancel';

        editForm.appendChild(nameInput);
        editForm.appendChild(confirmBtn);
        editForm.appendChild(cancelBtn);
        editPopUp.appendChild(editForm);

        editBtn.textContent = 'edit';
        
        editBtn.addEventListener('click', () => {
            editPopUp.setAttribute('data-name', editBtn.parentElement.getAttribute('data-name'));
            projectNode.replaceWith(editPopUp);
            nameInput.defaultValue = newProject.name;
        })

        confirmBtn.addEventListener('click', (e) => {
            const projectItem = List.getProjects().find((item) => item.name === editPopUp.getAttribute('data-name'));
            const projIndex = List.getProjects().indexOf(projectItem);
            const modifiedProjectList = List.getProjects();
            modifiedProjectList.splice(projIndex, 1)
            const projectNames = modifiedProjectList.map((item) => item.name);

            if (projectNames.includes(nameInput.value)) {
                nameInput.setCustomValidity('project name must be unique');
            }
            if (nameInput.checkValidity() && !projectNames.includes(nameInput.value)) {
                e.preventDefault();
                const oldName = projectItem.name;
                projectItem.changeName(nameInput.value);
                _retitleMain(nameInput.value);

                projectNode.setAttribute('data-name', projectItem.name);
                projectNode.querySelector('div.name').textContent = projectItem.name;

                if (main.getAttribute('data-project') === oldName) {
                    main.setAttribute('data-project', projectItem.name);
                    const projectItems = main.querySelectorAll('.to-do');
                    Array.from(projectItems).forEach((item) => {
                        item.querySelector('.project').textContent = projectItem.name;
                    })
                } else if (!main.hasAttribute('data-project')) {
                    let index = 0;
                    Array.from(document.querySelectorAll('.to-do')).forEach((item) => {
                        const project = List.getToDos()[index].project
                        if (project !== null && project.name === projectItem.name) {
                            item.querySelector('.project').textContent = projectItem.name;
                        }
                        index++;
                    })
                }

                editForm.reset();
                editPopUp.replaceWith(projectNode);
            }
        });

        cancelBtn.addEventListener('click', () => {
            editForm.reset();
            editPopUp.replaceWith(projectNode);
        })

        projectText.addEventListener('click', () => {
            _retitleMain(newProject.name);
            main.setAttribute('data-project', newProject.name);
            main.removeAttribute('data-date');
            renderProjectItems(newProject);
            if (!main.hasChildNodes()) {
                _renderEmptyMessage();
            }
        })

        deleteBtn.textContent = 'delete';
        
        deleteBtn.addEventListener('click', () => {
            let toDoItems = main.querySelectorAll('.to-do');
            let index = 0;
            Array.from(toDoItems).forEach((item) => {
                if (List.getToDos()[index].project === newProject) {
                    main.removeChild(item);
                }
                index++;
            });

            _resetAttributes(Array.from(main.querySelectorAll('.to-do')), 'data-index');
            const projectItem = deleteBtn.parentElement;
            projectItem.remove();

            List.deleteProject(newProject);

            if (main.hasAttribute('data-project')) {
                main.removeAttribute('data-project');
                main.removeAttribute('data-date');
                _retitleMain('home');
                renderAll();
            }

            new Masonry( main, {
                itemSelector: '.to-do',
                columnWidth: 300,
                horizontalOrder: true,
            });
        })

        return projectNode;
    }

    const renderAll = function () {
        _retitleMain('home');
        const main = document.querySelector('#main');
        main.textContent = '';
        List.getToDos().forEach((item) => {
            main.appendChild(createToDo(item));
        })
        if (!main.hasChildNodes()){
            _renderEmptyMessage();
            return;
        }
        const toDoItems = main.querySelectorAll('div.to-do');
        _resetAttributes(Array.from(toDoItems), 'data-index');
        new Masonry( main, {
            itemSelector: '.to-do',
            columnWidth: 300,
            horizontalOrder: true,
        });
    }

    const renderProjectItems = function (project) {
        const main = document.querySelector('#main');
        main.textContent = '';
        List.getProjectItems(project).forEach((item) => {
            const toDo = createToDo(item);
            main.appendChild(toDo);
        })
        if (!main.hasChildNodes()) {
            _renderEmptyMessage();
            return;
        }
        const toDoItems = main.querySelectorAll('div.to-do');
        _resetAttributes(Array.from(toDoItems), 'data-index');
        new Masonry( main, {
            itemSelector: '.to-do',
            columnWidth: 300,
            horizontalOrder: true,
        });
    }
    
    const editToDo = function (toDo, newTitle, newDescription, newDueDate, newPriority, newProject) {
        const main = document.querySelector('#main');
        
        const oldProject = toDo.project;
        toDo.edit(newTitle, newDescription, newDueDate, newPriority, newProject);
        let toDoItem;
        if (main.hasAttribute('data-project')) {
            if (oldProject !== newProject) {
                renderProjectItems(oldProject);
                return;
            }
            let project = List.getProjects().find((item) => item.name === main.getAttribute('data-project'));
            toDoItem = main.querySelector(`.to-do[data-index="${List.getProjectItems(project).findIndex((item) => item === toDo)}"]`);
        } else {
            toDoItem = main.querySelector(`.to-do[data-index="${List.getToDos().findIndex((item) => item === toDo)}"]`);
        }

        toDoItem.querySelector('.title').textContent = toDo.title;
        toDoItem.querySelector('.project').textContent = toDo.project === null ? '' : toDo.project.name;
        toDoItem.querySelector('.description').textContent = toDo.description;
        toDoItem.querySelector('.due-date').textContent = format(toDo.dueDate, 'dd MMM yyyy').toLowerCase();
        
        toDoItem.setAttribute('data-priority', toDo.priority);
    }

    return {
        buildEditToDoDialog,
        buildNewToDoDialog,
        buildHeader,
        buildSidebar,
        buildMain,
        createToDo,
        createProject,
        renderAll,
        renderProjectItems,
        editToDo,
    }

})();

const DOMBuilder = (function () {
    const buildDefaultPage = function() {
        document.body.appendChild(document.createElement('header'));
        document.body.appendChild(document.createElement('aside'));
        document.body.appendChild(document.createElement('main'));
        UserInterface.buildHeader();
        UserInterface.buildMain();
        UserInterface.buildSidebar();
        UserInterface.buildNewToDoDialog();
        UserInterface.buildEditToDoDialog();
    }

    return {
        buildDefaultPage,
    }
})()

const StorageController = (function() {
    const _reduceChecklist = function (toDo) {
        const checkList = [];
        toDo.checklist.forEach((item) => {
            checkList.push(JSON.stringify(item));
        })
        return JSON.stringify(checkList);
    }

    const _reduceTodo = function (toDo) {
        return {
            title: toDo.title,
            description: toDo.description,
            dueDate: formatISO(toDo.dueDate),
            checkList: _reduceChecklist(toDo),
            priority: toDo.priority,
            project: toDo.project === null ? "" : toDo.project.name,
            completed: toDo.completed,
        }
    }

    const _expandToDo = function (toDo) {
        const newToDo = List.createToDo(
            toDo.title, 
            toDo.description, 
            parseJSON(toDo.dueDate), 
            toDo.priority,
        )

        if (toDo.project) {
            const project = List.getProjects().find(item => item.name === toDo.project);
            List.addToDoToProject(newToDo, project);
        }

        const checkList = JSON.parse(toDo.checkList) 
        checkList.forEach((item) => {
            const checkListItem = JSON.parse(item)
            newToDo.addChecklistItem(checkListItem.name, checkListItem.checked);
        });

        return(newToDo);
    }

    const updateStorage = function () {
        const JSONtoDos = JSON.stringify(List.getToDos().map((item) => _reduceTodo(item)));
        localStorage.setItem('toDos', JSONtoDos);

        const JSONprojects = JSON.stringify(List.getProjects().map((item) => item.name));
        localStorage.setItem('projects', JSONprojects);
    }

    const populateFromStorage = function () {
        if (localStorage.getItem('projets') && localStorage.getItem('toDos')) {
            const JSONprojects = JSON.parse(localStorage.getItem('projects'));

            const projectsDiv = document.querySelector('div.projects')
            const createProjectBtn = document.querySelector('button.create-project');

            JSONprojects.forEach((item) => {
                projectsDiv.insertBefore(UserInterface.createProject(item), createProjectBtn)
            });

            const JSONtoDos = JSON.parse(localStorage.getItem('toDos'));
            JSONtoDos.forEach(item => {_expandToDo(item)});

            UserInterface.renderAll();
        }
    }

    return {
        updateStorage,
        populateFromStorage,
    }
})();

window.addEventListener('load', () => {
    DOMBuilder.buildDefaultPage();
    StorageController.populateFromStorage();
})
