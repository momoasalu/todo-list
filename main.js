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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0I7QUFDaEIsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuY29uc3QgVG9EbyA9ICh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBwcm9qZWN0LCBjb21wbGV0ZWQsIGNoZWNrbGlzdCkgPT4ge1xuICAgIC8qY29uc3QgY2hlY2tsaXN0SXRlbSA9IChuYW1lLCBjaGVja2VkKSA9PiB7XG4gICAgICAgIGNvbnN0IHRvZ2dsZUNvbXBsZXRlID0ge1xuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtuYW1lLCBjaGVja2VkfVxuICAgIH0qL1xuXG4gICAgY29uc3QgdG9nZ2xlQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbXBsZXRlZCA9IGNvbXBsZXRlZCA/IGZhbHNlIDogdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGFuZ2VQcmlvcml0eSA9IGZ1bmN0aW9uIChuZXdQcmlvcml0eSkge1xuICAgICAgICBwcmlvcml0eSA9IG5ld1ByaW9yaXR5O1xuICAgIH1cblxuICAgIC8vY29uc3QgYWRkQ2hlY2tsaXN0SXRlbVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGUsIFxuICAgICAgICBkZXNjcmlwdGlvbiwgXG4gICAgICAgIGR1ZURhdGUsIFxuICAgICAgICBjaGVja2xpc3QsXG4gICAgICAgIHByaW9yaXR5LCBcbiAgICAgICAgcHJvamVjdCwgXG4gICAgICAgIGNvbXBsZXRlZCxcbiAgICAgICAgdG9nZ2xlQ29tcGxldGUsXG4gICAgICAgIGNoYW5nZVByaW9yaXR5XG4gICAgfVxufVxuXG5jb25zdCBQcm9qZWN0ID0gKG5hbWUsIHRvRG9zKSA9PiB7XG4gICAgY29uc3QgYWRkID0gZnVuY3Rpb24gKHRvRG8pIHtcbiAgICAgICAgaWYgKCF0b0Rvcy5pbmNsdWRlcyh0b0RvKSkge1xuICAgICAgICAgICAgdG9Eb3MucHVzaCh0b0RvKTtcbiAgICAgICAgICAgIHRvRG8ucHJvamVjdCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZW1vdmUgPSBmdW5jdGlvbiAodG9Ebykge1xuICAgICAgICBpZiAodG9Eb3MuaW5jbHVkZXModG9EbykpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdG9Eb3MuZmluZEluZGV4KGl0ZW0gPT4gaXRlbSA9PT0gdG9Ebyk7XG4gICAgICAgICAgICB0b0Rvcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdG9Eb3MsXG4gICAgICAgIGFkZCxcbiAgICAgICAgcmVtb3ZlXG4gICAgfVxufVxuXG5jb25zdCBMaXN0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgdG9Eb3MgPSBbXTtcbiAgICBsZXQgcHJvamVjdHMgPSBbXTtcblxuICAgIGNvbnN0IGdldFRvRG9zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdG9Eb3MubWFwKGl0ZW0gPT4gaXRlbSk7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0UHJvamVjdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBwcm9qZWN0cy5tYXAoaXRlbSA9PiBpdGVtKTtcbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGVUb0RvID0gZnVuY3Rpb24gKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIGNoZWNrbGlzdCA9IFtdKSB7XG4gICAgICAgIGNvbnN0IG5ld1RvRG8gPSBUb0RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIG51bGwsIGZhbHNlLCBjaGVja2xpc3QpO1xuICAgICAgICB0b0Rvcy5wdXNoKG5ld1RvRG8pO1xuICAgICAgICByZXR1cm4gbmV3VG9EbztcbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGVQcm9qZWN0ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IFByb2plY3QobmFtZSwgW10pO1xuICAgICAgICBwcm9qZWN0cy5wdXNoKG5ld1Byb2plY3QpO1xuICAgICAgICByZXR1cm4gbmV3UHJvamVjdDtcbiAgICB9XG5cbiAgICBjb25zdCBkZWxldGVUb2RvID0gZnVuY3Rpb24gKHRvRG8pIHtcbiAgICAgICAgaWYgKHRvRG9zLmluY2x1ZGVzKHRvRG8pKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRvRG9zLmZpbmRJbmRleChpdGVtID0+IGl0ZW0gPT09IHRvRG8pO1xuICAgICAgICAgICAgdG9Eb3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIGlmICh0b0RvLnByb2plY3QpIHtcbiAgICAgICAgICAgICAgICB0b0RvLnByb2plY3QucmVtb3ZlKHRvRG8pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRlbGV0ZVByb2plY3QgPSBmdW5jdGlvbiAocHJvaikge1xuICAgICAgICB0b0Rvcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5wcm9qZWN0ID09PSBwcm9qKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlVG9kbyhpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcHJvamVjdEluZGV4ID0gcHJvamVjdHMuZmluZEluZGV4KHByb2plY3QgPT4gcHJvamVjdCA9PT0gcHJvaik7XG4gICAgICAgIHByb2plY3RzLnNwbGljZShwcm9qZWN0SW5kZXgsIDEpO1xuICAgIH1cblxuICAgIGNvbnN0IGdldFByb2plY3RJdGVtcyA9IGZ1bmN0aW9uIChwcm9qKSB7XG4gICAgICAgIHJldHVybiB0b0Rvcy5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0ucHJvamVjdCA9PT0gcHJvaik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0VG9Eb3MsXG4gICAgICAgIGdldFByb2plY3RzLFxuICAgICAgICBjcmVhdGVUb0RvLFxuICAgICAgICBjcmVhdGVQcm9qZWN0LFxuICAgICAgICBkZWxldGVUb2RvLFxuICAgICAgICBkZWxldGVQcm9qZWN0LFxuICAgICAgICBnZXRQcm9qZWN0SXRlbXNcbiAgICB9XG59KSgpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==