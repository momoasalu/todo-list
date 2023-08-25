
const ToDo = (title, description, dueDate, priority, project, completed, checklist) => {
    /*const checklistItem = (name, checked) => {
        const toggleComplete = {

        }
        return {name, checked}
    }*/

    const toggleComplete = function () {
        completed = completed ? false : true;
    }

    const changePriority = function (newPriority) {
        priority = newPriority;
    }

    //const addChecklistItem

    return {
        title, 
        description, 
        dueDate, 
        checklist,
        priority, 
        project, 
        completed,
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

    const createToDo = function (title, description, dueDate, priority, checklist = []) {
        const newToDo = ToDo(title, description, dueDate, priority, null, false, checklist);
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