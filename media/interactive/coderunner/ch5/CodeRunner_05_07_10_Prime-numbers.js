window.parameters = {"files": [{"name": "main.py", "contents": "N = int(input())\n\n", "solution": "N = int(input())\n\ni = 0\nnum = 3\n\nif N >= 1:\n    print(2)\n    i += 1\n\nwhile i < N:\n    flag = True\n    for x in range(2, num):\n        if num%x == 0:\n            flag = False\n            break\n        \n    if flag:\n        print(num)\n        i += 1\n    num += 1"}], "input": "5", "showSolution": true};