window.parameters = {"files": [{"name": "language.py", "contents": "class Language:\n    \n    def __init__(self, line):\n        data = line.split(',')\n        self.name = data[0]\n        self.speakers = float(data[1])\n        self.family = data[2]\n        self.branch = data[3]\n\n    def __str__(self):\n        return f\"{self.name} ({self.speakers} million)\"\n\n\nif __name__ == \"__main__\":\n    valid = []\n    data = open(\"top27.csv\")\n    data.readline()  # Skip first line\n    for line in data:\n        try:\n            lang = Language(line)\n            valid.append(lang)\n        except ValueError as err:\n            print(err)\n            print(line)\n    for lang in valid:\n        print(lang)\n", "solution": "class Language:\n    \n    def __init__(self, line):\n        data = line.split(',')\n        if len(data) != 4:\n            raise ValueError(\"incorrect number of values\")\n        self.name = data[0]\n        self.speakers = float(data[1])\n        if self.speakers < 0:\n            raise ValueError(\"speakers cannot be negative\")\n        self.family = data[2]\n        self.branch = data[3]\n\n    def __str__(self):\n        return f\"{self.name} ({self.speakers} million)\"\n\n\nif __name__ == \"__main__\":\n    valid = []\n    data = open(\"top27.csv\")\n    data.readline()  # Skip first line\n    for line in data:\n        try:\n            lang = Language(line)\n            valid.append(lang)\n        except ValueError as err:\n            print(err)\n            print(line)\n    for lang in valid:\n        print(lang)\n"}, {"name": "top27.csv", "contents": "Language,Native speakers (millions),Language family,Branch\nMandarin Chinese (incl. Standard Chinese but excl. other varieties),939,Sino-Tibetan,Sinitic\nSpanish,485,Indo-European,Romance\nEnglish,380+,Indo-European,Germanic\nHindi (excl. Urdu and other languages),345,Indo-European,Indo-Aryan\nPortuguese,236,Indo-European,Romance\nBengali,234,Indo-European,Indo-Aryan\nRussian,147,Indo-European,Balto-Slavic\nJapanese,123,Japonic,Japanese\nYue Chinese (incl. Cantonese),86.1,Sino-Tibetan,Sinitic\nVietnamese,85,Austroasiatic,Vietic\nTurkish,84,Turkic,Oghuz\nWu Chinese (incl. Shanghainese),83.4,Sino-Tibetan,Sinitic\nMarathi,83.2,Indo-European,Indo-Aryan\nTelugu,83,Dravidian,South-Central\nKorean,81.7,Koreanic\nFrench,-80.8,Indo-European,Romance\nTamil,78.6,Dravidian,South\nEgyptian Spoken Arabic (excl. Saidi Arabic),77.4,Afroasiatic,Semitic\nStandard German,75.3,Indo-European,Germanic\nUrdu (excl. Hindi),70.6,Indo-European,Indo-Aryan\nJavanese,68.3,Austronesian,Malayo-Polynesian\nWestern Punjabi (excl. Eastern Punjabi),66.7,Indo-European,Indo-Aryan\nItalian,64.6,Indo-European,Romance\nGujarati,57.1,Indo-European,Indo-Aryan\nIranian Persian (excl. Dari and Tajik),57.2,Indo-European,Iranian\nBhojpuri,52.3,Indo-European,Indo-Aryan\nHausa,51.7,Afroasiatic,Chadic\n", "solution": null}], "input": null, "showSolution": true};