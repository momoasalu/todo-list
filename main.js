/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/

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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0I7QUFDaEIsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuY29uc3QgVG9EbyA9ICh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBwcm9qZWN0LCBjb21wbGV0ZWQsIGNoZWNrbGlzdCkgPT4ge1xuICAgIC8qY29uc3QgY2hlY2tsaXN0SXRlbSA9IChuYW1lLCBjaGVja2VkKSA9PiB7XG4gICAgICAgIGNvbnN0IHRvZ2dsZUNvbXBsZXRlID0ge1xuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtuYW1lLCBjaGVja2VkfVxuICAgIH0qL1xuXG4gICAgY29uc3QgdG9nZ2xlQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbXBsZXRlZCA9IGNvbXBsZXRlZCA/IGZhbHNlIDogdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGFuZ2VQcmlvcml0eSA9IGZ1bmN0aW9uIChuZXdQcmlvcml0eSkge1xuICAgICAgICBwcmlvcml0eSA9IG5ld1ByaW9yaXR5O1xuICAgIH1cblxuICAgIC8vY29uc3QgYWRkQ2hlY2tsaXN0SXRlbVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGUsIFxuICAgICAgICBkZXNjcmlwdGlvbiwgXG4gICAgICAgIGR1ZURhdGUsIFxuICAgICAgICBjaGVja2xpc3QsXG4gICAgICAgIHByaW9yaXR5LCBcbiAgICAgICAgcHJvamVjdCwgXG4gICAgICAgIGNvbXBsZXRlZCxcbiAgICAgICAgdG9nZ2xlQ29tcGxldGUsXG4gICAgICAgIGNoYW5nZVByaW9yaXR5XG4gICAgfVxufVxuXG5jb25zdCBQcm9qZWN0ID0gKG5hbWUsIHRvRG9zKSA9PiB7XG4gICAgY29uc3QgYWRkVG9Qcm9qZWN0ID0gZnVuY3Rpb24gKHRvRG8pIHtcbiAgICAgICAgaWYgKCF0b0Rvcy5pbmNsdWRlcyh0b0RvKSkge1xuICAgICAgICAgICAgdG9Eb3MucHVzaCh0b0RvKTtcbiAgICAgICAgICAgIHRvRG8ucHJvamVjdCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZW1vdmVGcm9tUHJvamVjdCA9IGZ1bmN0aW9uICh0b0RvKSB7XG4gICAgICAgIGlmICh0b0Rvcy5pbmNsdWRlcyh0b0RvKSkge1xuICAgICAgICAgICAgdG9Eby5wcm9qZWN0ID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdG9Eb3MuZmluZEluZGV4KHRvRG8pO1xuICAgICAgICAgICAgdG9Eb3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIHRvRG9zLFxuICAgICAgICBhZGRUb1Byb2plY3QsXG4gICAgICAgIHJlbW92ZUZyb21Qcm9qZWN0XG4gICAgfVxufVxuXG5jb25zdCBMaXN0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgdG9Eb3MgPSBbXTtcbiAgICBjb25zdCBwcm9qZWN0cyA9IFtdO1xuXG4gICAgY29uc3QgY3JlYXRlVG9EbyA9IGZ1bmN0aW9uICh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBjaGVja2xpc3QgPSBbXSkge1xuICAgICAgICBjb25zdCBuZXdUb0RvID0gVG9Ebyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBudWxsLCBmYWxzZSwgY2hlY2tsaXN0KTtcbiAgICAgICAgdG9Eb3MucHVzaChuZXdUb0RvKTtcbiAgICAgICAgcmV0dXJuIG5ld1RvRG87XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlUHJvamVjdCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3QgPSBQcm9qZWN0KG5hbWUsIFtdKTtcbiAgICAgICAgcHJvamVjdHMucHVzaChuZXdQcm9qZWN0KTtcbiAgICAgICAgcmV0dXJuIG5ld1Byb2plY3Q7XG4gICAgfVxuXG4gICAgY29uc3QgZGVsZXRlVG9kbyA9IGZ1bmN0aW9uICh0b0RvKSB7XG4gICAgICAgIGNvbnN0IGxpc3RJbmRleCA9IHRvRG9zLmZpbmRJbmRleCh0b0RvKTtcbiAgICAgICAgdG9Eb3Muc3BsaWNlKGxpc3RJbmRleCwgMSk7XG4gICAgICAgIGlmICh0b0RvLnByb2plY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3RJbmRleCA9IHRvRG8ucHJvamVjdC50b0Rvcy5maW5kSW5kZXgodG9Ebyk7XG4gICAgICAgICAgICB0b0RvLnByb2plY3QudG9Eb3Muc3BsaWNlKHByb2plY3RJbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBkZWxldGVQcm9qZWN0ID0gZnVuY3Rpb24gKHByb2opIHtcbiAgICAgICAgdG9Eb3MgPSB0b0Rvcy5maWx0ZXIoKHRvZG8pID0+IHRvZG8ucHJvamVjdCA9PT0gcHJvaik7XG4gICAgICAgIHByb2pJbmRleCA9IHByb2plY3RzLmluZGV4T2YocHJvaik7XG4gICAgICAgIHByb2plY3RzLnNwbGljZShwcm9qSW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHRvRG9zLFxuICAgICAgICBwcm9qZWN0cyxcbiAgICAgICAgY3JlYXRlVG9EbyxcbiAgICAgICAgY3JlYXRlUHJvamVjdCxcbiAgICAgICAgZGVsZXRlVG9kbyxcbiAgICAgICAgZGVsZXRlUHJvamVjdFxuICAgIH1cbn0pKCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9