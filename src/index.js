import { addDays, addWeeks, format, formatISO, isAfter, isToday, isWithinInterval, parseJSON } from "date-fns";
import Sortable from "sortable-axis";
import Draggabilly from "draggabilly";
import './style.css';
var Packery = require('packery');

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

    const reorderCheckItems = function (oldIndex, newIndex) {
        const [checkItem] = this.checklist.splice(oldIndex, 1)
        this.checklist.splice(newIndex, 0, checkItem);
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
        reorderCheckItems
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

    const reorderProjects = function (projectList) {
        projects.sort((a, b) => {
            const indexA = projectList.findIndex((item) => a.name === item);
            const indexB = projectList.findIndex((item) => b.name === item);
            return indexA < indexB ? -1 : 1;
        });
        StorageController.updateStorage();
    }

    const reorderToDos = function (oldIndex, newIndex) {
        const [toDo] = toDos.splice(oldIndex, 1)
        toDos.splice(newIndex, 0, toDo);
        StorageController.updateStorage();
    }

    const reorderAll = function (newIndexes) {
        const toDosCopy = toDos.map((a) => a);
        toDos.sort((a, b) => {
            const indexA = toDosCopy.indexOf(a);
            const indexB = toDosCopy.indexOf(b);

            const indexOfIndexA = newIndexes.indexOf(indexA);
            const indexOfIndexB = newIndexes.indexOf(indexB);

            return indexOfIndexA < indexOfIndexB ? -1 : 1;
        })
    }

    return {
        getToDos,
        getProjects,
        createToDo,
        createProject,
        deleteTodo,
        deleteProject,
        getProjectItems,
        addToDoToProject,
        reorderProjects,
        reorderToDos,
        reorderAll,
    }
})();

const UserInterface = (function () {
    let mainLayout;

    const _retitleMain = function (newTitle) {
        const title = document.querySelector('.title');
        title.textContent = newTitle;
    }

    const _renderEmptyMessage = function () {
        const main = document.querySelector('#main');
        if (!main.hasChildNodes()) {
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
        dueDate.classList.add('date');
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

        const highPriority = document.createElement('div');
        const highPriorityLabel = document.createElement('label');
        highPriorityLabel.textContent = 'high';
        highPriorityLabel.setAttribute('for', `${purpose}-high-priority`);
        const highPriorityInput = document.createElement('input');
        highPriorityInput.id = `${purpose}-high-priority`;
        highPriorityInput.setAttribute('name', `${purpose}-priority`);
        highPriorityInput.setAttribute('value', 'high');
        highPriorityInput.setAttribute('type', 'radio');
        highPriorityInput.setAttribute('checked', '');
        highPriority.appendChild(highPriorityLabel);
        highPriority.appendChild(highPriorityInput);
        highPriority.classList.add('high-priority');

        const medPriority = document.createElement('div');
        const medPriorityLabel = document.createElement('label');
        medPriorityLabel.textContent = 'medium';
        medPriorityLabel.setAttribute('for', `${purpose}-medium-priority`);
        const medPriorityInput = document.createElement('input');
        medPriorityInput.id = `${purpose}-medium-priority`;
        medPriorityInput.setAttribute('name', `${purpose}-priority`);
        medPriorityInput.setAttribute('value', 'medium');
        medPriorityInput.setAttribute('type', 'radio');
        medPriority.appendChild(medPriorityLabel);
        medPriority.appendChild(medPriorityInput);
        medPriority.classList.add('medium-priority');

        const lowPriority = document.createElement('div');
        const lowPriorityLabel = document.createElement('label');
        lowPriorityLabel.textContent = 'low';
        lowPriorityLabel.setAttribute('for', `${purpose}-low-priority`);
        const lowPriorityInput = document.createElement('input');
        lowPriorityInput.id = `${purpose}-low-priority`;
        lowPriorityInput.setAttribute('name', `${purpose}-priority`);
        lowPriorityInput.setAttribute('value', 'low');
        lowPriorityInput.setAttribute('type', 'radio');
        lowPriority.appendChild(lowPriorityLabel);
        lowPriority.appendChild(lowPriorityInput);
        
        priority.appendChild(priorityLegend);
        priority.appendChild(highPriority);
        priority.appendChild(medPriority);
        priority.appendChild(lowPriority);

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
                    mainLayout.appended(toDoNode);
                } else if (main.hasAttribute('data-date')) {
                    const newToDo = List.createToDo(title, description, dueDate, priority);
                    if (main.getAttribute('data-date') === 'upcoming') {
                        if (isWithinInterval(newToDo.dueDate, {
                            start: addDays(new Date().setHours(0, 0, 0, 0), 1),
                            end: addWeeks(new Date().setHours(23, 59, 59, 99), 1),
                        })) {
                            const toDoNode = createToDo(newToDo);
                            toDoNode.querySelector('button.delete').remove();
                            toDoNode.querySelector('button.edit').remove();
                            toDoNode.setAttribute('data-index', main.querySelectorAll('.to-do').length);
                            main.appendChild(toDoNode);
                            mainLayout.appended(toDoNode);
                        }
                    } else if (main.getAttribute('data-date') === 'today') {
                        if (isToday(newToDo.dueDate)) {
                            const toDoNode = createToDo(newToDo);
                            toDoNode.querySelector('button.delete').remove();
                            toDoNode.querySelector('button.edit').remove();
                            toDoNode.setAttribute('data-index', main.querySelectorAll('.to-do').length);
                            main.appendChild(toDoNode);
                            mainLayout.appended(toDoNode);
                        }
                    }
                } else {
                    const newToDo = List.createToDo(title, description, dueDate, priority);
                    const toDoNode = createToDo(newToDo)
                    toDoNode.setAttribute('data-index', List.getToDos().length - 1);
                    main.appendChild(toDoNode);
                    mainLayout.appended(toDoNode);
                }

                if (main.querySelector('.empty-message')) {
                    main.querySelector('.empty-message').remove();
                    if (!main.hasChildNodes()) {
                        _renderEmptyMessage();
                    }
                }

                form.reset();
                dialog.close();
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
                form.reset();
                dialog.close();
                mainLayout.shiftLayout();
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

    const buildDeleteDialog =  function () {
        const dialog = document.createElement('dialog');
        dialog.classList.add('delete');

        const message = document.createElement('p');

        message.textContent = 'are you sure you want to delete this?';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'yes, delete';
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'no, cancel';

        deleteBtn.addEventListener('click', () => {
            dialog.close('true')
        });

        cancelBtn.addEventListener('click', () => {
            dialog.close('');
        });

        dialog.appendChild(message);
        dialog.appendChild(deleteBtn);
        dialog.appendChild(cancelBtn);

        document.body.appendChild(dialog);
    }

    const buildHeader = function () {
        const header = document.querySelector('header');

        const filler = document.createElement('div');

        const heading = document.createElement('h1');
        heading.textContent = 'to-do list!';
        header.appendChild(filler);
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

            let index = 0;
            List.getToDos().forEach((item) => {
                if (isToday(item.dueDate)) {
                    const toDoItem = createToDo(item);
                    const editBtn = toDoItem.querySelector('div.buttons-box > button.edit')
                    editBtn.remove();
                    const moveIcon = toDoItem.querySelector('svg.move-icon');
                    moveIcon.remove();
                    toDoItem.setAttribute('data-index', index)
                    main.appendChild(toDoItem);
                    index++;
                }
            });

            if (!main.hasChildNodes()) {
                _renderEmptyMessage();
                return;
            };

            mainLayout = new Packery(main, {
                itemSelector: '.to-do',
                columnWidth: 250,
                gutter: 20
            })

            main.querySelectorAll('.to-do').forEach((item) => {
                const draggie = new Draggabilly(item, {
                    containment: main
                })
                mainLayout.bindDraggabillyEvents(draggie);
            })
    
            
            mainLayout.on('removeComplete', () => {
                if (main.hasAttribute('data-project') || main.hasAttribute('data-date')) {
                    console.log(main.querySelectorAll('.to-do'));
                    _resetAttributes(Array.from(main.querySelectorAll('.to-do')), 'data-index');
                }
            });
        })

        const upcoming = document.createElement('h2');
        upcoming.textContent = 'upcoming';

        upcoming.addEventListener('click', () => {
            _retitleMain('upcoming');
            main.removeAttribute('data-project');
            main.setAttribute('data-date', 'upcoming');
            main.textContent = '';

            let index = 0;
            List.getToDos().forEach((item) => {
                if (isWithinInterval(item.dueDate, {
                    start: addDays(new Date().setHours(0, 0, 0, 0), 1),
                    end: addWeeks(new Date().setHours(23, 59, 59, 99), 1),
                })) {
                    const toDoItem = createToDo(item);
                    const editBtn = toDoItem.querySelector('div.buttons-box > button.edit')
                    editBtn.remove();
                    const moveIcon = toDoItem.querySelector('svg.move-icon');
                    moveIcon.remove();
                    toDoItem.setAttribute('data-index', index)
                    main.appendChild(toDoItem);
                    index++;
                };
            });

            if (!main.hasChildNodes()) {
                _renderEmptyMessage();
                return;
            }

            mainLayout = new Packery(main, {
                itemSelector: '.to-do',
                columnWidth: 250,
                gutter: 20
            })

            main.querySelectorAll('.to-do').forEach((item) => {
                const draggie = new Draggabilly(item, {
                    containment: main
                })
                mainLayout.bindDraggabillyEvents(draggie);
            })

            mainLayout.on('removeComplete', () => {
                if (main.hasAttribute('data-project') || main.hasAttribute('data-date')) {
                    console.log(main.querySelectorAll('.to-do'));
                    _resetAttributes(Array.from(main.querySelectorAll('.to-do')), 'data-index');
                }
            });
        });

        const projects = buildProjectDiv();
        const createBtn = buildNewToDoButton();

        aside.appendChild(home);
        aside.appendChild(today);
        aside.appendChild(upcoming);
        aside.appendChild(projects);
        aside.appendChild(createBtn);
    }

    const buildProjectDiv = function () {
        const projectsDiv = document.createElement('div');
        projectsDiv.classList.add('projects');
        const header = document.createElement('h2');
        header.textContent = 'projects';
        const createBtn = document.createElement('button');
        createBtn.textContent = '+';
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
            projectInput.focus();
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
                _resetAttributes(Array.from(document.querySelector('div.projects').querySelectorAll('div.project')), 'data-id');
                createForm.reset();
                createPopUp.replaceWith(createBtn);
            };

            StorageController.updateStorage();
        });

        cancelBtn.addEventListener('click', () => {
            createForm.reset();
            createPopUp.replaceWith(createBtn);
        });

        Sortable.create(projectsDiv, {
            draggable: '.project',
            handle: '.move-icon',
            fallbackAxis: 'y',
            forceFallback: true,
            onEnd: function () {
                _resetAttributes(Array.from(projectsDiv.querySelectorAll('.project')), 'data-id');
                const projects = Array.from(document.querySelector('aside').querySelectorAll('.project'));
                const projectNames = projects.map((item) => item.querySelector('.name').textContent);
                List.reorderProjects(projectNames);
            }
        });

        return projectsDiv;
    }

    const buildNewToDoButton = function () {
        const createBtn = document.createElement('button');
        createBtn.textContent = 'new to-do';
        createBtn.classList.add('create-to-do');

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

        const buttons = document.createElement('div');
        buttons.classList.add('buttons');

        const popUpBtn = document.createElement('button');
        popUpBtn.classList.add('pop-up');

        const popUpBtnIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        popUpBtnIcon.setAttribute('viewBox', '0 0 24 24')
        const popUpBtnIconTitle = document.createElement('title');
        const popUpBtnIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        popUpBtnIconTitle.textContent = 'menu';
        popUpBtnIconPath.setAttribute('d', 'M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z');

        popUpBtnIcon.appendChild(popUpBtnIconTitle);
        popUpBtnIcon.appendChild(popUpBtnIconPath);
        const popUp = document.createElement('div');

        check.setAttribute('data-order', index);
        if (checkListItem.checked) {
            check.classList.add('checked');
        } else {
            check.classList.add('unchecked')
        }

        const checkBox = document.createElement('div');
        checkBox.classList.add('checklist-checkbox');

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

        popUp.appendChild(deleteBtn);
        popUp.appendChild(editBtn);

        popUpBtn.appendChild(popUpBtnIcon);
        popUp.classList.add('pop-up');

        popUpBtn.addEventListener('click', () => {
            if (check.contains(popUp)) {
                check.removeChild(popUp);
            } else {
                const container = check.parentElement;
                const checkNodes = container.querySelectorAll('div.check-item');
                Array.from(checkNodes).forEach((node) => {
                    if (node.querySelector('div.pop-up')) {
                        const popUp = node.querySelector('div.pop-up');
                        node.removeChild(popUp);
                    }
                });
                check.appendChild(popUp);
            }
        })

        popUpBtnIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (check.contains(popUp)) {
                check.removeChild(popUp);
            } else {
                const container = check.parentElement;
                const checkNodes = container.querySelectorAll('div.check-item');
                Array.from(checkNodes).forEach((node) => {
                    if (node.querySelector('div.pop-up')) {
                        const popUp = node.querySelector('div.pop-up');
                        node.removeChild(popUp);
                    }
                });
                check.appendChild(popUp);
            }
        })

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
            const deleteDialog = document.querySelector('dialog.delete');
            deleteDialog.showModal();

            deleteDialog.addEventListener('click', () => {
                if (deleteDialog.returnValue) {
                    toDo.deleteChecklistItem(checkListItem);
                    const container = check.parentElement;
                    check.remove();
                    _resetAttributes(Array.from(container.querySelectorAll('.check-item')), 'data-order');
                    mainLayout.shiftLayout();
                }
                })
        });

        editBtn.addEventListener('click', () => {
            check.replaceWith(editPopUp);
            editInput.defaultValue = checkText.textContent;
            mainLayout.shiftLayout()
            editInput.focus();
        });

        editConfirmBtn.addEventListener('click', (e) => {
            if (editInput.checkValidity()) {
                checkListItem.changeName(editInput.value);
                e.preventDefault();
                checkText.textContent = editInput.value;
                editPopUp.replaceWith(check);
                check.removeChild(popUp);
                mainLayout.shiftLayout()
            }
        });

        editCancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            editForm.reset();
            editPopUp.replaceWith(check);
            check.removeChild(popUp);
            mainLayout.shiftLayout()
        });

        check.appendChild(checkBox);
        check.appendChild(checkText);
        check.appendChild(popUpBtn);

        return check;
    }

    const createChecklist = function (toDo) {
        const container = document.createElement('div');
        const expander = document.createElement('div');
        expander.classList.add('expander');

        const expandIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        expandIcon.setAttribute('viewBox', '0 0 24 24');

        const expandIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const expandIconTitle = document.createElement('title');

        expandIconTitle.textContent = 'chevron-double-down';
        expandIconPath.setAttribute('d', 'M16.59,5.59L18,7L12,13L6,7L7.41,5.59L12,10.17L16.59,5.59M16.59,11.59L18,13L12,19L6,13L7.41,11.59L12,16.17L16.59,11.59Z');

        const miniIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const miniIconTitle = document.createElement('title');

        miniIconTitle.textContent = 'chevron-double-up';
        miniIconPath.setAttribute('d', 'M7.41,18.41L6,17L12,11L18,17L16.59,18.41L12,13.83L7.41,18.41M7.41,12.41L6,11L12,5L18,11L16.59,12.41L12,7.83L7.41,12.41Z');

        expandIcon.appendChild(expandIconTitle);
        expandIcon.appendChild(expandIconPath);

        expander.appendChild(expandIcon);

        expander.addEventListener('click', () => {
            container.classList.toggle('expanded');
            container.classList.toggle('minimized');

            if (container.classList.contains('expanded')) {
                expandIcon.textContent = '';
                expandIcon.appendChild(miniIconTitle);
                expandIcon.appendChild(miniIconPath);
            } else {
                expandIcon.textContent = '';
                expandIcon.appendChild(expandIconTitle);
                expandIcon.appendChild(expandIconPath);
            }
            mainLayout.shiftLayout();
        })

        container.appendChild(expander);
        container.classList.add('checklist');
        container.classList.add('minimized');

        toDo.checklist.forEach((item) => {
            container.appendChild(createCheckListItem(item, toDo));
        });

        Sortable.create(container, {
            draggable: '.check-item',
            fallbackAxis: 'y',
            forceFallback: true,
            onEnd: function (evt) {
                const oldIndex = evt.item.getAttribute('data-order');
                _resetAttributes(Array.from(container.querySelectorAll('.check-item')), 'data-order');
                const newIndex = evt.item.getAttribute('data-order');
                toDo.reorderCheckItems(oldIndex, newIndex);
            }
        })

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

        const buttonsBox = document.createElement('div');
        buttonsBox.classList.add('buttons-box');

        const checkBox = document.createElement('div');
        checkBox.classList.add('checkbox');

        const title = document.createElement('h4');
        title.textContent = toDo.title;
        title.classList.add('title');

        const titleBox = document.createElement('div');
        titleBox.classList.add('title-box');

        const moveIconContainer = document.createElement('div');

        const moveIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        moveIcon.setAttribute('viewBox', '0 0 22 22');
        moveIcon.classList.add('move-icon');
        const moveIconTitle = document.createElement('title');
        moveIconTitle.textContent = 'gamepad';
        const moveIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        const pathOptions = [
            "M14 1V2H15V7H20V8H21V14H20V15H15V20H14V21H8V20H7V15H2V14H1V8H2V7H7V2H8V1H14M13 15H9V19H13V15Z",
            "M14 1V2H15V7H20V8H21V14H20V15H15V20H14V21H8V20H7V15H2V14H1V8H2V7H7V2H8V1H14M7 9H3V13H7V9M9 15V19H13V15H9Z",
            "M14 1V2H15V7H20V8H21V14H20V15H15V20H14V21H8V20H7V15H2V14H1V8H2V7H7V2H8V1H14M19 9H15V13H19V9M9 15V19H13V15H9Z",
            "M14 1V2H15V7H20V8H21V14H20V15H15V20H14V21H8V20H7V15H2V14H1V8H2V7H7V2H8V1H14M13 3H9V9H3V13H9V19H13V13H19V9H13V3Z",
            "M14 1V2H15V7H20V8H21V14H20V15H15V20H14V21H8V20H7V15H2V14H1V8H2V7H7V2H8V1H14M7 9H3V13H7V9Z",
            "M14 1V2H15V7H20V8H21V14H20V15H15V20H14V21H8V20H7V15H2V14H1V8H2V7H7V2H8V1H14M19 9H15V13H19V9Z",
            "M14 1V2H15V7H20V8H21V14H20V15H15V20H14V21H8V20H7V15H2V14H1V8H2V7H7V2H8V1H14M13 3H9V7H13V3Z",
            "M14 1V2H15V7H20V8H21V14H20V15H15V20H14V21H8V20H7V15H2V14H1V8H2V7H7V2H8V1H14M7 9H3V13H7V9M9 3V7H13V3H9Z",
            "M14 1V2H15V7H20V8H21V14H20V15H15V20H14V21H8V20H7V15H2V14H1V8H2V7H7V2H8V1H14M19 9H15V13H19V9M9 3V7H13V3H9Z"
        ];

        moveIconPath.setAttribute('d', pathOptions[Math.floor(Math.random() * 9)]);
        moveIcon.appendChild(moveIconTitle);
        moveIcon.appendChild(moveIconPath);

        moveIconContainer.appendChild(moveIcon);

        titleBox.appendChild(moveIconContainer);
        titleBox.appendChild(title);
        titleBox.appendChild(checkBox);

        const project = document.createElement('h5');
        project.textContent = toDo.project === null ? '' : toDo.project.name;
        project.classList.add('project');
        const description = document.createElement('p');
        description.textContent = toDo.description;
        description.classList.add('description');
        const dueDate = document.createElement('p');
        dueDate.textContent = format(toDo.dueDate, 'dd MMM yyyy');
        if (isAfter(new Date().setHours(0, 0, 0, 0), toDo.dueDate)) {
            container.classList.add('past');
        } else {
            container.classList.remove('past');
        }
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

        const deleteBtnIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        deleteBtnIcon.setAttribute('viewBox', '0 0 22 22');
        const deleteBtnIconTitle = document.createElement('title');
        const deleteBtnIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        deleteBtnIconTitle.textContent = 'trash';
        deleteBtnIconPath.setAttribute('d', 'M10 7V16H8V7H10M12 7H14V16H12V7M8 2H14V3H19V5H18V19H17V20H5V19H4V5H3V3H8V2M6 5V18H16V5H6Z');

        deleteBtnIcon.appendChild(deleteBtnIconTitle);
        deleteBtnIcon.appendChild(deleteBtnIconPath);

        deleteBtn.appendChild(deleteBtnIcon);

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit');

        const editBtnIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        editBtnIcon.setAttribute('viewBox', '0 0 22 22');
        const editBtnIconTitle = document.createElement('title');
        const editBtnIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        editBtnIconTitle.textContent = 'pencil';
        editBtnIconPath.setAttribute('d', 'M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z');

        editBtnIcon.appendChild(editBtnIconTitle);
        editBtnIcon.appendChild(editBtnIconPath);

        editBtn.appendChild(editBtnIcon);

        checklist.appendChild(addChecklistItemBtn);

        addChecklistItemBtn.addEventListener('click', () => {
            addChecklistItemBtn.replaceWith(addPopUp);
            mainLayout.shiftLayout();
            addInput.focus();
        });

        addConfirmBtn.addEventListener('click', (e) => {
            if (addInput.checkValidity()) {
                e.preventDefault();
                const checkListItem = toDo.addChecklistItem(addInput.value);
                checklist.insertBefore(createCheckListItem(checkListItem, toDo), addPopUp);
                addPopUp.replaceWith(addChecklistItemBtn);

                addForm.reset();
                mainLayout.shiftLayout();
            }
        });

        addCancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addForm.reset();
            addPopUp.replaceWith(addChecklistItemBtn);
            mainLayout.shiftLayout();
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
            const deleteDialog = document.querySelector('dialog.delete');
            deleteDialog.showModal();

            deleteDialog.addEventListener('click', () => {
                if (deleteDialog.returnValue) {
                    List.deleteTodo(toDo);
                    const toDoItem = deleteBtn.parentElement.parentElement;
                    mainLayout.remove(toDoItem);
                    mainLayout.layout();
                    if (!main.hasChildNodes()) {
                        _renderEmptyMessage();
                        return;
                    }
                }
            }, {once: true});
        })

        editBtn.addEventListener('click', () => {
            const editDialog = document.querySelector('dialog.edit');
            const index = editBtn.parentElement.parentElement.getAttribute('data-index');
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
                console.log(List.getToDos());
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
            editDialog.showModal();
        });

        buttonsBox.appendChild(editBtn);
        buttonsBox.appendChild(deleteBtn);

        container.classList.add('to-do');
        container.append(titleBox);
        container.append(project);
        container.append(description);
        container.append(dueDate);
        container.append(checklist);
        container.append(buttonsBox);

        return container;
    }

    const createProject = function (name) {
        const main = document.querySelector('#main');

        const projectNode = document.createElement('div');
        projectNode.setAttribute('data-id', List.getProjects().length);
        const newProject = List.createProject(name);

        const moveIconContainer = document.createElement('div');

        const moveIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        moveIcon.setAttribute('viewBox', '0 0 22 22');
        moveIcon.classList.add('move-icon');
        const moveIconTitle = document.createElement('title');
        moveIconTitle.textContent = 'heart';
        const moveIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        moveIconPath.setAttribute('d', "M12 20H10V19H9V18H8V17H7V16H6V15H5V14H4V13H3V12H2V10H1V5H2V4H3V3H4V2H9V3H10V4H12V3H13V2H18V3H19V4H20V5H21V10H20V12H19V13H18V14H17V15H16V16H15V17H14V18H13V19H12V20M5 11V12H6V13H7V14H8V15H9V16H10V17H12V16H13V15H14V14H15V13H16V12H17V11H18V9H19V6H18V5H17V4H14V5H13V6H12V7H10V6H9V5H8V4H5V5H4V6H3V9H4V11H5Z");
        moveIcon.appendChild(moveIconTitle);
        moveIcon.appendChild(moveIconPath);

        moveIconContainer.appendChild(moveIcon);
        
        const popUpBtn = document.createElement('button');
        popUpBtn.classList.add('pop-up');

        const popUpBtnIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        popUpBtnIcon.setAttribute('viewBox', '0 0 24 24')
        const popUpBtnIconTitle = document.createElement('title');
        const popUpBtnIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        popUpBtnIconTitle.textContent = 'menu';
        popUpBtnIconPath.setAttribute('d', 'M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z');

        popUpBtnIcon.appendChild(popUpBtnIconTitle);
        popUpBtnIcon.appendChild(popUpBtnIconPath);

        const popUp = document.createElement('div');
        const deleteBtn = document.createElement('button');
        const editBtn = document.createElement('button');
        const editPopUp = document.createElement('div');
        const editForm = document.createElement('form');

        const projectText = document.createElement('div');
        projectText.classList.add('name');
        projectText.textContent = newProject.name;

        projectNode.classList.add('project');
        projectNode.setAttribute('data-name', newProject.name);
        projectNode.appendChild(moveIconContainer);
        projectNode.appendChild(projectText);
        projectNode.appendChild(popUpBtn);

        popUp.appendChild(deleteBtn);
        popUp.appendChild(editBtn);
        
        const nameInput = document.createElement('input');
        nameInput.setAttribute('required', '');
        nameInput.setAttribute('type', 'text');
        nameInput.setAttribute('maxlength', 20);

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'confirm';
        confirmBtn.setAttribute('type', 'submit');
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'cancel';

        editForm.appendChild(nameInput);
        editForm.appendChild(confirmBtn);
        editForm.appendChild(cancelBtn);
        editPopUp.appendChild(editForm);

        popUpBtn.appendChild(popUpBtnIcon);
        popUp.classList.add('pop-up');

        popUpBtn.addEventListener('click', () => {
            if (projectNode.contains(popUp)) {
                projectNode.removeChild(popUp);
            } else {
                const projectNodes = document.querySelectorAll('div.project');
                Array.from(projectNodes).forEach((node) => {
                    if (node.querySelector('div.pop-up')) {
                        const popUp = node.querySelector('div.pop-up');
                        node.removeChild(popUp);
                    }
                });
                projectNode.appendChild(popUp);
            }
        });

        popUpBtnIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (projectNode.contains(popUp)) {
                projectNode.removeChild(popUp);
            } else {
                const projectNodes = document.querySelectorAll('div.project');
                Array.from(projectNodes).forEach((node) => {
                    if (node.querySelector('div.pop-up')) {
                        const popUp = node.querySelector('div.pop-up');
                        node.removeChild(popUp);
                    }
                });
                projectNode.appendChild(popUp);
            }
        })

        editBtn.textContent = 'edit';
        
        editBtn.addEventListener('click', () => {
            editPopUp.setAttribute('data-name', editBtn.parentElement.parentElement.getAttribute('data-name'));
            projectNode.replaceWith(editPopUp);
            nameInput.defaultValue = newProject.name;
            nameInput.focus();
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

                projectNode.setAttribute('data-name', projectItem.name);
                projectNode.querySelector('div.name').textContent = projectItem.name;

                if (main.getAttribute('data-project') === oldName) {
                    main.setAttribute('data-project', projectItem.name);
                    const projectItems = main.querySelectorAll('.to-do');
                    Array.from(projectItems).forEach((item) => {
                        item.querySelector('.project').textContent = projectItem.name;
                    });
                    _retitleMain(nameInput.value);
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
                projectNode.removeChild(popUp);
            }
        });

        cancelBtn.addEventListener('click', () => {
            editForm.reset();
            editPopUp.replaceWith(projectNode);
            projectNode.removeChild(popUp);
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
            const projectItem = deleteBtn.parentElement.parentElement;
            const deleteDialog = document.querySelector('dialog.delete');

            deleteDialog.showModal();

            deleteDialog.addEventListener('close', () => {
                if (deleteDialog.returnValue) {
                    let toDoItems = main.querySelectorAll('.to-do');

                    const toRemove = Array.from(toDoItems).filter(item => item.querySelector('.project').textContent === newProject.name);
                    List.deleteProject(newProject);

                    mainLayout.remove(toRemove);

                    if (!main.hasAttribute('data-project')) {
                        mainLayout.layout();
                    } else {
                        main.removeAttribute('data-project');
                        main.removeAttribute('data-date');
                        _retitleMain('home');
                        renderAll();
                    }

                    _resetAttributes(Array.from(document.querySelector('div.projects').querySelectorAll('div.project')), 'data-id');

                    projectItem.remove();

                }
            }, {once: true});
            
        });
        return projectNode;
    }

    const renderAll = function () {
        _retitleMain('home');
        const main = document.querySelector('#main');
        main.textContent = '';
        List.getToDos().forEach((item) => {
            const newNode = createToDo(item);
            main.appendChild(newNode);
        })
        if (!main.hasChildNodes()){
            _renderEmptyMessage();
            return;
        }
        const toDoItems = main.querySelectorAll('div.to-do');
        _resetAttributes(Array.from(toDoItems), 'data-index');

        mainLayout = new Packery(main, {
            itemSelector: '.to-do',
            columnWidth: 250,
            gutter: 20
        })

        main.querySelectorAll('.to-do').forEach((item) => {
            const draggie = new Draggabilly(item, {
                containment: main
            })
            mainLayout.bindDraggabillyEvents(draggie);
        })

        mainLayout.on('dragItemPositioned', reorderAll );
        mainLayout.on('removeComplete', reorderAll );
    }

    const renderProjectItems = function (project) {
        const main = document.querySelector('#main');
        main.textContent = '';
        List.getProjectItems(project).forEach((item) => {
            const toDo = createToDo(item);
            const moveIcon = toDo.querySelector('svg.move-icon');
            moveIcon.remove();
            main.appendChild(toDo);
        })
        if (!main.hasChildNodes()) {
            _renderEmptyMessage();
            return;
        }
        const toDoItems = main.querySelectorAll('div.to-do');
        _resetAttributes(Array.from(toDoItems), 'data-index');

        console.log(mainLayout);

        mainLayout = new Packery(main, {
            itemSelector: '.to-do',
            columnWidth: 250,
            gutter: 20
        })

        main.querySelectorAll('.to-do').forEach((item) => {
            const draggie = new Draggabilly(item, {
                containment: main
            })
            mainLayout.bindDraggabillyEvents(draggie);
        })

        mainLayout.on('removeComplete', () => {
            if (main.hasAttribute('data-project') || main.hasAttribute('data-date')) {
                console.log(main.querySelectorAll('.to-do'));
                _resetAttributes(Array.from(main.querySelectorAll('.to-do')), 'data-index');
            }
        });
    }

    function syncDataIndexes() {
        let index = 0;
        mainLayout.getItemElements().forEach((item) => {
            item.setAttribute('data-index', index);
            index++;
        })
    }

    function reorderAll () {
        const main = document.querySelector('#main');
        if (!main.hasAttribute('data-project') && !main.hasAttribute('data-date')) {
            console.log(mainLayout.getItemElements());
            const newIndexes = mainLayout.getItemElements().map((item) => +item.getAttribute('data-index'));
            console.log(newIndexes);
            List.reorderAll(newIndexes);
            console.log(List.getToDos());
            syncDataIndexes();
            StorageController.updateStorage();
        }
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
            toDoItem = main.querySelector(`.to-do[data-index="${List.getProjectItems(project).indexOf(toDo)}"]`);
        } else {
            toDoItem = main.querySelector(`.to-do[data-index="${List.getToDos().indexOf(toDo)}"]`);
        }

        toDoItem.querySelector('.title').textContent = toDo.title;
        toDoItem.querySelector('.project').textContent = toDo.project === null ? '' : toDo.project.name;
        toDoItem.querySelector('.description').textContent = toDo.description;
        toDoItem.querySelector('.due-date').textContent = format(toDo.dueDate, 'dd MMM yyyy');
        if (isAfter(new Date().setHours(0, 0, 0, 0), toDo.dueDate)) {
            toDoItem.classList.add('past');
        } else {
            toDoItem.classList.remove('past');
        }
        
        toDoItem.setAttribute('data-priority', toDo.priority);
    }

    return {
        buildEditToDoDialog,
        buildNewToDoDialog,
        buildDeleteDialog,
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
        UserInterface.buildDeleteDialog();

        window.addEventListener('click', (e) => {
            const popUpButtons = Array.from(document.querySelectorAll('button.pop-up'));
            if (!popUpButtons.includes(e.target)) {
                if (document.querySelector('div.pop-up')) {
                    const popUps = Array.from(document.querySelectorAll('div.pop-up'));
                    popUps.forEach((popUp) => {
                        popUp.remove();
                    })
                }
            }
        })
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

        if (toDo.completed) {
            newToDo.toggleComplete();
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
        if (localStorage.getItem('projects') && localStorage.getItem('toDos')) {
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

        UserInterface.renderAll();
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
