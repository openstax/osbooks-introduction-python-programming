A browser-based Python code runner for content on OpenStax's platform.

This project does not use a build system. Instead, the project's source file is coderunner.js.

coderunner.js connects a code editor to a Python interpreter.

coderunner.js has 3 dependencies, located in the coderunner_dependencies folder:
* Monaco code editor v0.21.2: https://microsoft.github.io/monaco-editor/
* Skulpt Python interpreter v0.2.1: https://github.com/skulpt/skulpt
* OpenStax's pattern library: https://packages.cnx.org/pattern-library/core/pattern-library.css

There is a different folder for each chapter. Each such folder contains that chapter's code runner instances.

Each instance is defined by a generic HTML file and a JS file that specifies that instances files, solution, and whether to show the solution.