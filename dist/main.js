/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/

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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuY29uc3QgQ2hlY2tsaXN0SXRlbSA9IChuYW1lLCBjaGVja2VkKSA9PiB7XG4gICAgY29uc3QgdG9nZ2xlQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNoZWNrZWQgPSBjaGVja2VkID8gZmFsc2UgOiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcmtDb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtuYW1lLCBjaGVja2VkLCB0b2dnbGVDb21wbGV0ZSwgbWFya0NvbXBsZXRlfVxufVxuXG5jb25zdCBUb0RvID0gKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHByb2plY3QsIGNvbXBsZXRlZCwgY2hlY2tsaXN0KSA9PiB7XG4gICAgY29uc3QgYWRkQ2hlY2tsaXN0SXRlbSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIGNvbnN0IG5ld0NoZWNrbGlzdEl0ZW0gPSBDaGVja2xpc3RJdGVtKG5hbWUsIGZhbHNlKTtcbiAgICAgICAgY2hlY2tsaXN0LnB1c2gobmV3Q2hlY2tsaXN0SXRlbSk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVsZXRlQ2hlY2tsaXN0SXRlbSA9IGZ1bmN0aW9uIChjaGVja2xpc3RJdGVtKSB7XG4gICAgICAgIGlmIChjaGVja2xpc3QuaW5jbHVkZXMoY2hlY2tsaXN0SXRlbSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gY2hlY2tsaXN0LmZpbmRJbmRleCgoaXRlbSkgPT4gaXRlbSA9PT0gY2hlY2tsaXN0SXRlbSk7XG4gICAgICAgICAgICBjaGVja2xpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRvZ2dsZUNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb21wbGV0ZWQgPSBjb21wbGV0ZWQgPyBmYWxzZSA6IHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2hhbmdlUHJpb3JpdHkgPSBmdW5jdGlvbiAobmV3UHJpb3JpdHkpIHtcbiAgICAgICAgcHJpb3JpdHkgPSBuZXdQcmlvcml0eTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZSwgXG4gICAgICAgIGRlc2NyaXB0aW9uLCBcbiAgICAgICAgZHVlRGF0ZSwgXG4gICAgICAgIGNoZWNrbGlzdCxcbiAgICAgICAgcHJpb3JpdHksIFxuICAgICAgICBwcm9qZWN0LCBcbiAgICAgICAgY29tcGxldGVkLFxuICAgICAgICBhZGRDaGVja2xpc3RJdGVtLFxuICAgICAgICBkZWxldGVDaGVja2xpc3RJdGVtLFxuICAgICAgICB0b2dnbGVDb21wbGV0ZSxcbiAgICAgICAgY2hhbmdlUHJpb3JpdHlcbiAgICB9XG59XG5cbmNvbnN0IFByb2plY3QgPSAobmFtZSwgdG9Eb3MpID0+IHtcbiAgICBjb25zdCBhZGQgPSBmdW5jdGlvbiAodG9Ebykge1xuICAgICAgICBpZiAoIXRvRG9zLmluY2x1ZGVzKHRvRG8pKSB7XG4gICAgICAgICAgICB0b0Rvcy5wdXNoKHRvRG8pO1xuICAgICAgICAgICAgdG9Eby5wcm9qZWN0ID0gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJlbW92ZSA9IGZ1bmN0aW9uICh0b0RvKSB7XG4gICAgICAgIGlmICh0b0Rvcy5pbmNsdWRlcyh0b0RvKSkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0b0Rvcy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtID09PSB0b0RvKTtcbiAgICAgICAgICAgIHRvRG9zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lLFxuICAgICAgICB0b0RvcyxcbiAgICAgICAgYWRkLFxuICAgICAgICByZW1vdmVcbiAgICB9XG59XG5cbmNvbnN0IExpc3QgPSAoZnVuY3Rpb24gKCkge1xuICAgIGxldCB0b0RvcyA9IFtdO1xuICAgIGxldCBwcm9qZWN0cyA9IFtdO1xuXG4gICAgY29uc3QgZ2V0VG9Eb3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0b0Rvcy5tYXAoaXRlbSA9PiBpdGVtKTtcbiAgICB9XG5cbiAgICBjb25zdCBnZXRQcm9qZWN0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHByb2plY3RzLm1hcChpdGVtID0+IGl0ZW0pO1xuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZVRvRG8gPSBmdW5jdGlvbiAodGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSkge1xuICAgICAgICBjb25zdCBuZXdUb0RvID0gVG9Ebyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBudWxsLCBmYWxzZSwgW10pO1xuICAgICAgICB0b0Rvcy5wdXNoKG5ld1RvRG8pO1xuICAgICAgICByZXR1cm4gbmV3VG9EbztcbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGVQcm9qZWN0ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IFByb2plY3QobmFtZSwgW10pO1xuICAgICAgICBwcm9qZWN0cy5wdXNoKG5ld1Byb2plY3QpO1xuICAgICAgICByZXR1cm4gbmV3UHJvamVjdDtcbiAgICB9XG5cbiAgICBjb25zdCBkZWxldGVUb2RvID0gZnVuY3Rpb24gKHRvRG8pIHtcbiAgICAgICAgaWYgKHRvRG9zLmluY2x1ZGVzKHRvRG8pKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRvRG9zLmZpbmRJbmRleChpdGVtID0+IGl0ZW0gPT09IHRvRG8pO1xuICAgICAgICAgICAgdG9Eb3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIGlmICh0b0RvLnByb2plY3QpIHtcbiAgICAgICAgICAgICAgICB0b0RvLnByb2plY3QucmVtb3ZlKHRvRG8pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRlbGV0ZVByb2plY3QgPSBmdW5jdGlvbiAocHJvaikge1xuICAgICAgICB0b0Rvcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5wcm9qZWN0ID09PSBwcm9qKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlVG9kbyhpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcHJvamVjdEluZGV4ID0gcHJvamVjdHMuZmluZEluZGV4KHByb2plY3QgPT4gcHJvamVjdCA9PT0gcHJvaik7XG4gICAgICAgIHByb2plY3RzLnNwbGljZShwcm9qZWN0SW5kZXgsIDEpO1xuICAgIH1cblxuICAgIGNvbnN0IGdldFByb2plY3RJdGVtcyA9IGZ1bmN0aW9uIChwcm9qKSB7XG4gICAgICAgIHJldHVybiB0b0Rvcy5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0ucHJvamVjdCA9PT0gcHJvaik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0VG9Eb3MsXG4gICAgICAgIGdldFByb2plY3RzLFxuICAgICAgICBjcmVhdGVUb0RvLFxuICAgICAgICBjcmVhdGVQcm9qZWN0LFxuICAgICAgICBkZWxldGVUb2RvLFxuICAgICAgICBkZWxldGVQcm9qZWN0LFxuICAgICAgICBnZXRQcm9qZWN0SXRlbXNcbiAgICB9XG59KSgpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==