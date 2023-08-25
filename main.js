/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/

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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuY29uc3QgVG9EbyA9ICh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBwcm9qZWN0KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGUsIFxuICAgICAgICBkZXNjcmlwdGlvbiwgXG4gICAgICAgIGR1ZURhdGUsIFxuICAgICAgICBwcmlvcml0eSwgXG4gICAgICAgIHByb2plY3QsIFxuICAgICAgICBjb21wbGV0ZWRcbiAgICB9XG59XG5cbmNvbnN0IFByb2plY3QgPSAobmFtZSwgdG9kb3MpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lLFxuICAgICAgICB0b2Rvc1xuICAgIH1cbn1cblxuY29uc3QgTGlzdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgdG9Eb3MgPSBbXTtcbiAgICBjb25zdCBwcm9qZWN0cyA9IFtdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdG9Eb3MsXG4gICAgICAgIHByb2plY3RzLFxuICAgIH1cbn0pKCkiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=