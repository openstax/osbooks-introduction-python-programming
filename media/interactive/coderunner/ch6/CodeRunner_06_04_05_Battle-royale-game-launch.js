window.parameters = {"files": [{"name": "main.py", "contents": "def find_teammates(num):\n    print(\"Finding\", num, \"players...\")\n\n# Define battle_royale() and practice()\n\ngame_mode = input()\n# Launch selected game mode", "solution": "def find_teammates(num):\n    print(\"Finding\", num, \"players...\")\n\ndef battle_royale():\n    nplayers = int(input())\n    rand_players = 3 - nplayers\n    find_teammates(rand_players)  \n    print(\"Match starting...\")\n\ndef practice():\n    game_map = input()\n    print(\"Launching practice on\", game_map)\n\ngame_mode = input()\nif game_mode == \"br\":\n    battle_royale()\nelse:\n    practice()"}], "input": "br\n1", "showSolution": true};