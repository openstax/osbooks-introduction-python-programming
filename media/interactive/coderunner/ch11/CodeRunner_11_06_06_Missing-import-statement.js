window.parameters = {"files": [{"name": "prime_pizza1.py", "contents": "from math import sqrt\n# Import statement\n\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(sqrt(n)) + 1):\n        if n % i == 0:\n            return False\n    return True\n\ndef test(num):\n    for n in range(num):\n        if is_prime(n):\n            print(n, \"is prime\")\n        else:\n            print(n, \"is NOT prime\")\n\ndef pizza_rate(size, price):\n    pizza = Circle(size/2)\n    return price / pizza.area()\n\ntest(10)\nprint()\nprint(\"  Small for $4.99:\", pizza_rate(10, 4.99))\nprint(\" Medium for $5.99:\", pizza_rate(12, 5.99))\nprint(\"  Large for $7.99:\", pizza_rate(14, 7.99))\nprint(\"X-Large for $9.99:\", pizza_rate(16, 9.99))", "solution": "from math import sqrt\nfrom circle import Circle\n\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(sqrt(n)) + 1):\n        if n % i == 0:\n            return False\n    return True\n\ndef test(num):\n    for n in range(num):\n        if is_prime(n):\n            print(n, \"is prime\")\n        else:\n            print(n, \"is NOT prime\")\n\ndef pizza_rate(size, price):\n    pizza = Circle(size/2)\n    return price / pizza.area()\n\ntest(10)\nprint()\nprint(\"  Small for $4.99:\", pizza_rate(10, 4.99))\nprint(\" Medium for $5.99:\", pizza_rate(12, 5.99))\nprint(\"  Large for $7.99:\", pizza_rate(14, 7.99))\nprint(\"X-Large for $9.99:\", pizza_rate(16, 9.99))"}, {"name": "circle.py", "contents": "import math\n\nclass Circle:\n    def __init__(self, r=0):\n        self.radius = r\n\n    def area(self):\n        return math.pi * self.radius**2\n\ndef test(num):\n    c = Circle(num)\n    print(c.area())"}], "input": null, "showSolution": true};