window.parameters = {"files": [{"name": "main.py", "contents": "my_list = [1, 5, 7, 12, 5, 17, 9, 2, 4]\n\ntotal = 0\n\nfor i in my_list:\n    if i < 5:\n        # TO DO: numbers less than 5 should be skipped.\n\n   else: \n        # TO DO: numbers greater than 5 should be summed up.\n\nprint(total)", "solution": "my_list = [1, 5, 7, 12, 5, 17, 9, 2, 4]\n\ntotal = 0\n\nfor i in my_list:\n    if i < 5:\n        continue\n    else:\n        total += i\n\nprint(total)"}], "input": null, "showSolution": true};