window.parameters = {"files": [{"name": "change_machine.py", "contents": "# Read the input.\ntotal = float(input(\"Total amount? \"))\ncash = int(input(\"Cash payment? \"))\n\n# TODO: Calculate change.\nchange = 0\nprint()\nprint(\"Change due $\", change)\n\n# TODO: Print the results.\nprint()\nprint(\"  Dollars:\", 0)\nprint(\" Quarters:\", 0)\nprint(\"    Dimes:\", 0)\nprint(\"  Nickels:\", 0)\nprint(\"  Pennies:\", 0)\n", "solution": "# Read the input.\ntotal = float(input(\"Total amount? \"))\ncash = int(input(\"Cash payment? \"))\n\n# Calculate change.\nchange = round(cash - total, 2)\nprint()\nprint(\"Change due $\", change)\nchange = int(change * 100)\n\n# Print the results.\nprint()\nprint(\"  Dollars:\", change // 100)\nchange = change % 100\nprint(\" Quarters:\", change // 25)\nchange = change % 25\nprint(\"    Dimes:\", change // 10)\nchange = change % 10\nprint(\"  Nickels:\", change // 5)\nchange = change % 5\nprint(\"  Pennies:\", change)\n"}], "input": "18.76\n20\n", "showSolution": true};