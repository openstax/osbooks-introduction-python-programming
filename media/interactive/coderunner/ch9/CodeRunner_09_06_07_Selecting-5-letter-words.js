window.parameters = {"files": [{"name": "main.py", "contents": "# A list\nword_list = [\"notebook\", \"capsule\", \"ruler\", \"divider\", \"compass\", \"chart\", \"pen\", \"pencil\"]", "solution": "# A list\nword_list = [\"notebook\", \"capsule\", \"ruler\", \"divider\", \"compass\", \"chart\", \"pen\", \"pencil\"]\n\n# List comprehension to select only 5 letter words\nwords = [w for w in word_list if len(w) == 5]\n\n# Print the new list\nprint(words)"}], "input": null, "showSolution": true};