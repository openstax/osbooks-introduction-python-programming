window.parameters = {"files": [{"name": "quadratic.py", "contents": "# TODO: Add the import statement.\n\na = float(input(\"Value of a? \"))\nb = float(input(\"Value of b? \"))\nc = float(input(\"Value of c? \"))\n\nx1 = 0  # TODO: Replace with plus formula.\nx2 = 0  # TODO: Replace with minus formula.\n\nprint(\"Solutions:\", x1, \"and\", x2)\n", "solution": "import math\n\na = float(input(\"Value of a? \"))\nb = float(input(\"Value of b? \"))\nc = float(input(\"Value of c? \"))\n\nx1 = (-b + math.sqrt(b**2 - 4*a*c)) / (2*a)\nx2 = (-b - math.sqrt(b**2 - 4*a*c)) / (2*a)\n\nprint(\"Solutions:\", x1, \"and\", x2)\n"}], "input": "1\n0\n-4\n", "showSolution": true};