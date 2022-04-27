/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/helper.js":
/*!**************************!*\
  !*** ./client/helper.js ***!
  \**************************/
/***/ ((module) => {

eval("const handleError = message => {\n  console.log(error);\n};\n\nconst sendPost = async (url, data, handler) => {\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n  const result = await response.json();\n\n  if (result.redirect) {\n    window.location = result.redirect;\n  }\n\n  ;\n\n  if (result.error) {\n    handleError(result.error);\n  }\n\n  ;\n\n  if (handler) {\n    handler(result);\n  }\n\n  ;\n};\n\nconst hideError = () => {};\n\nmodule.exports = {\n  handleError,\n  sendPost,\n  hideError\n};\n\n//# sourceURL=webpack://react-project/./client/helper.js?");

/***/ }),

/***/ "./client/login.jsx":
/*!**************************!*\
  !*** ./client/login.jsx ***!
  \**************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const helper = __webpack_require__(/*! ./helper.js */ \"./client/helper.js\");\n\nconst handleLogin = e => {\n  e.preventDefault();\n  helper.hideError();\n  const username = e.target.querySelector('#user').value;\n  const pass = e.target.querySelector('#pass').value;\n  const _csrf = e.target.querySelector('#_csrf').value;\n\n  if (!username || !pass) {\n    helper.handleError('Username or password is empty!');\n    return false;\n  }\n\n  helper.sendPost(e.target.action, {\n    username,\n    pass,\n    _csrf\n  });\n  return false;\n};\n\nconst handleSignup = e => {\n  e.preventDefault();\n  helper.hideError();\n  const username = e.target.querySelector('#user').value;\n  const pass = e.target.querySelector('#pass').value;\n  const pass2 = e.target.querySelector('#pass2').value;\n  const _csrf = e.target.querySelector('#_csrf').value;\n\n  if (!username || !pass || !pass2) {\n    helper.handleError('Username or password is empty!');\n    return false;\n  }\n\n  if (pass !== pass2) {\n    helper.handleError('Passwords do not match!');\n    return false;\n  }\n\n  helper.sendPost(e.target.action, {\n    username,\n    pass,\n    pass2,\n    _csrf\n  });\n  return false;\n};\n\nconst LoginWindow = props => {\n  return /*#__PURE__*/React.createElement(\"form\", {\n    action: \"/login\",\n    id: \"loginForm\",\n    name: \"loginForm\",\n    onSubmit: handleLogin,\n    method: \"POST\",\n    className: \"mainForm\"\n  }, /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"username\"\n  }, \"Username: \"), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"text\",\n    name: \"username\",\n    id: \"user\",\n    placeholder: \"username\"\n  }), /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"pass\"\n  }, \"Password: \"), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"password\",\n    name: \"pass\",\n    id: \"pass\",\n    placeholder: \"password\"\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"hidden\",\n    name: \"_csrf\",\n    id: \"_csrf\",\n    value: props.csrf\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"submit\",\n    value: \"Sign In\",\n    className: \"formSubmit\"\n  }));\n};\n\nconst SignupWindow = props => {\n  return /*#__PURE__*/React.createElement(\"form\", {\n    action: \"/signup\",\n    id: \"signupForm\",\n    name: \"signupForm\",\n    onSubmit: handleSignup,\n    method: \"POST\",\n    className: \"mainForm\"\n  }, /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"username\"\n  }, \"Username: \"), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"text\",\n    name: \"username\",\n    id: \"user\",\n    placeholder: \"username\"\n  }), /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"pass\"\n  }, \"Password: \"), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"password\",\n    name: \"pass\",\n    id: \"pass\",\n    placeholder: \"password\"\n  }), /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"pass2\"\n  }, \"Retype Password: \"), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"password\",\n    name: \"pass2\",\n    id: \"pass2\",\n    placeholder: \"retype password\"\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"hidden\",\n    name: \"_csrf\",\n    id: \"_csrf\",\n    value: props.csrf\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"submit\",\n    value: \"Sign Up\",\n    className: \"formSubmit\"\n  }));\n};\n\nconst init = async () => {\n  const response = await fetch('/getToken');\n  const data = await response.json();\n  const loginButton = document.getElementById('login');\n  const signupButton = document.getElementById('signup');\n  loginButton.addEventListener('click', e => {\n    e.preventDefault();\n    ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {\n      csrf: data.csrfToken\n    }), document.getElementById('content'));\n    return false;\n  });\n  signupButton.addEventListener('click', e => {\n    e.preventDefault();\n    ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {\n      csrf: data.csrfToken\n    }), document.getElementById('content'));\n    return false;\n  });\n  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {\n    csrf: data.csrfToken\n  }), document.getElementById('content'));\n};\n\nwindow.onload = init;\n\n//# sourceURL=webpack://react-project/./client/login.jsx?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./client/login.jsx");
/******/ 	
/******/ })()
;