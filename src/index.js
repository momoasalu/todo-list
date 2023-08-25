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
        checklist.push(newChecklistItem);
    }

    const deleteChecklistItem = function (checklistItem) {
        if (checklist.includes(checklistItem)) {
            const index = checklist.findIndex((item) => item === checklistItem);
            checklist.splice(index, 1);
        }
    }

    const toggleComplete = function () {
        completed = completed ? false : true;
    }

    const changePriority = function (newPriority) {
        priority = newPriority;
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
        changePriority
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

    aside.appendChild(home);
    aside.appendChild(today);
    aside.appendChild(week);
    aside.appendChild(projects);

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
        container.classList.add(toDo.priority);
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
                columnWidth: 300
            });
        })

        container.classList.add('to-do')
        container.append(title);
        container.append(description);
        container.append(dueDate);
        container.append(checklist);
        container.append(deleteBtn)

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
            columnWidth: 300
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
            columnWidth: 300
        });
    }

    const createToDo = function (title, description, dueDate, priority) {
        const newToDo = List.createToDo(title, description, dueDate, priority);
        main.appendChild(renderToDo(newToDo));
        const toDoItems = main.querySelectorAll('div.to-do');
        resetDataIndex(Array.from(toDoItems));
        new Masonry( main, {
            itemSelector: '.to-do',
            columnWidth: 300
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
                columnWidth: 300
            });
        })

        newProjectNode.textContent = newProject.name;
        newProjectNode.classList.add('project');
        newProjectNode.classList.add(newProject.name);
        newProjectNode.appendChild(deleteBtn);
        projects.appendChild(newProjectNode);

        return newProject;
    }
    
    return {
        createToDo,
        createProject,
    }

})();
