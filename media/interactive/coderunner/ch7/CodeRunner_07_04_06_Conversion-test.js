window.parameters = {"files": [{"name": "conversion2.py", "contents": "\"\"\"Functions that convert metric and imperial units.\"\"\"\n\ndef cel2fah(c):\n    \"\"\"Converts from Celsius to Fahrenheit.\"\"\"\n    return 9/5 * c + 32\n\ndef fah2cel(f):\n    \"\"\"Converts from Fahrenheit to Celsius.\"\"\"\n    return 5/9 * (f - 32)\n\ndef km2mi(km):\n    \"\"\"Converts from kilometers to miles.\"\"\"\n    return km / 1.60934\n\ndef mi2km(mi):\n    \"\"\"Converts from miles to kilometers.\"\"\"\n    return mi * 1.60934\n", "solution": "\"\"\"Functions that convert metric and imperial units.\"\"\"\n\ndef cel2fah(c):\n    \"\"\"Converts from celsius to fahrenheit.\"\"\"\n    return 9/5 * c + 32\n\ndef fah2cel(f):\n    \"\"\"Converts from fahrenheit to celsius.\"\"\"\n    return 5/9 * (f - 32)\n\ndef km2mi(km):\n    \"\"\"Converts from kilometers to miles.\"\"\"\n    return km / 1.60934\n\ndef mi2km(mi):\n    \"\"\"Converts from miles to kilometers.\"\"\"\n    return mi * 1.60934\n\nif __name__ == \"__main__\":\n\n    for c in range(0, 21, 5):\n        f = round(cel2fah(c))\n        print(f\"{c} C is {f} F\")\n\n    print()\n    for f in range(20, 41, 5):\n        c = round(fah2cel(f))\n        print(f\"{f} F is {c} C\")\n\n    print()\n    for km in range(1, 6):\n        mi = round(km2mi(km), 1)\n        print(f\"{km} km is {mi} mi\")\n\n    print()\n    for mi in range(5, 10):\n        km = round(mi2km(mi), 1)\n        print(f\"{mi} mi is {km} km\")\n"}], "input": null, "showSolution": true};