window.parameters = {"files": [{"name": "main.py", "contents": "string_value = \"This is a string\"\n\n# Create a dictionary and count the number of unique characters in string_value", "solution": "string_value = \"This is a string\"\ncharacters = {}\n\nfor c in string_value:\n    characters[c] = 1\n\nprint(len(list(characters.keys())))\n"}], "input": null, "showSolution": true};