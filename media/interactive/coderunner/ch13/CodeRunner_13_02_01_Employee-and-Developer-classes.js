window.parameters = {"files": [{"name": "main.py", "contents": "class Employee():\n    def print_company(self):\n        print(\"Employee works at Stark Industries\")\n\n# Define Developer class\n\npython_dev = Developer()\n# Call Employee and Developer methods", "solution": "class Employee():\n    def print_company(self):\n        print(\"Employee works at Stark Industries\")\n\nclass Developer(Employee):\n    def update_codebase(self):\n        print(\"Employee has updated the codebase\")\n\npython_dev = Developer()\npython_dev.print_company()\npython_dev.update_codebase()"}], "input": "\n", "showSolution": true};