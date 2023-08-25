
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
    const addToProject = function (toDo) {
        if (!toDos.includes(toDo)) {
            toDos.push(toDo);
            toDo.project = this;
        }
    }

    const removeFromProject = function (toDo) {
        if (toDos.includes(toDo)) {
            toDo.project = null;
            const index = toDos.findIndex(toDo);
            toDos.splice(index, 1);
        }
    }

    return {
        name,
        toDos,
        addToProject,
        removeFromProject
    }
}

const List = (function () {
    let toDos = [];
    const projects = [];

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
        const listIndex = toDos.findIndex(toDo);
        toDos.splice(listIndex, 1);
        if (toDo.project) {
            const projectIndex = toDo.project.toDos.findIndex(toDo);
            toDo.project.toDos.splice(projectIndex, 1);
        }
    }

    const deleteProject = function (proj) {
        toDos = toDos.filter((todo) => todo.project === proj);
        projIndex = projects.indexOf(proj);
        projects.splice(projIndex, 1);
    }

    return {
        toDos,
        projects,
        createToDo,
        createProject,
        deleteTodo,
        deleteProject
    }
})();