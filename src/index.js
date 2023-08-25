
const ToDo = (title, description, dueDate, priority, project) => {
    return {
        title, 
        description, 
        dueDate, 
        priority, 
        project, 
        completed
    }
}

const Project = (name, todos) => {
    return {
        name,
        todos
    }
}

const List = (function () {
    const toDos = [];
    const projects = [];

    return {
        toDos,
        projects,
    }
})()