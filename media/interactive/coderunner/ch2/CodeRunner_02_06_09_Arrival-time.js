window.parameters = {"files": [{"name": "arrival_time.py", "contents": "# Prompt for inputs.\nhour = int(input(\"Current hour (0-23)? \"))\nminute = int(input(\"Current minute (0-59)? \"))\nadd = int(input(\"Trip time (in minutes)? \"))\n\n# TODO: Calculate the time.\nhour = 0\nminute = 0\n\n# Display the results.\nprint()\nprint(\"Arrival hour is\", hour)\nprint(\"Arrival minute is\", minute)\n", "solution": "# prompt for inputs\nhour = int(input(\"Current hour (0-23)? \"))\nminute = int(input(\"Current minute (0-59)? \"))\nadd = int(input(\"Trip time (in minutes)? \"))\n\n# calculate the time\nresult = hour * 60 + minute + add\nhour = result // 60 % 24\nminute = result % 60\n\n# display the results\nprint()\nprint(\"Arrival hour is\", hour)\nprint(\"Arrival minute is\", minute)\n"}], "input": "13\n25\n340\n", "showSolution": true};