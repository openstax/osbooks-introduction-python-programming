window.addEventListener('load', async() => {
    // Hide page while code runner loads.
    document.body.style.visibility = 'hidden';

    // Load styles and DOM.
    document.body.innerHTML = `<link rel="stylesheet" data-name="vs/editor/editor.main" href="../coderunner_dependencies/monaco/min/vs/editor/editor.main.css" />
<style>
    #container {
        width: 600px;
    }

    #editors > div {
        border: 1px solid #cfd8dc;
        height: 200px;
    }

    #input {
        border: 1px solid #cfd8dc;
        box-sizing: border-box;
        margin-top: 5px;
        padding: 4px;
        resize: none;
        width: 100%;
    }

    #run {
        align-items: center;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: #f57c00;
        border: 1px solid transparent;
        border-radius: 2px;
        color: #fff;
        cursor: pointer;
        font-family: Roboto,sans-serif;
        font-size: 1rem;
        font-weight: 700;
        height: 36px;
        margin: 0 0 5px 0;
        padding: 0 8px;
        transition: background-color .25s ease-out,color .25s ease-out;
    }

    #run:hover {
        color: #37474f;
        background-color: #d95d00;
    }

    #output {
        background-color: #f5f5f5;
        border: 1px solid rgba(189,189,189,.5);
        border-radius: 2px;
        color: #37474f;
        display: block;
        font-family: "Courier New",monospace;
        max-height: 260px;
        min-height: 60px;
        overflow-x: auto;
        padding: 4px 10px;
        white-space: pre-wrap;
    }

    details {
        margin-top: 25px;
    }

    code {
        white-space: pre;
    }
</style>
<div id="container">
    <div id="selector-container">
        <label>
            Current file:
            <select></select>
        </label>
    </div>
    <div id="editors"></div>
    <textarea id="input" rows="3" aria-label="Input to the program"></textarea>
    <button id="run" onclick="run()">Run</button>
    <output id="output" aria-label="Output of the program"></output>
    <details>
        <summary>View solution</summary>
    </details>
</div>`;

    // Global variables for the code runner.
    let editors = null;
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    let inputLines = null;

    /**
        Run the code and show output.
        @function run
        @return {void}
    */
    window.run = function() {
        output.value = '';

        // Python input() works by reading until a newline.
        inputLines = input.value.split('\n');

        Sk.misceval
            .asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, editors[0].getValue(), true))
            .then(null, error => {
                output.value = error;
            });
    }

    // Tells monaco's loader where to find the language-specific files.
    window.require = { paths: { vs: '../coderunner_dependencies/monaco/min/vs' } };

    /**
        Load a script file at the given url. Resolve once loaded.
        @function loadScript
        @param {String} url The script file's url.
        @return {Promise}
    */
    function loadScript(url) {
        return new Promise(resolve => {
            const scriptElement = document.createElement('script');

            scriptElement.setAttribute('src', url);
            scriptElement.setAttribute('type', 'text/javascript');
            scriptElement.addEventListener('load', resolve);

            document.body.appendChild(scriptElement);
        });
    }

    // Load each script file sequentially.
    const scriptUrls = [ 'skulpt/skulpt.min.js', 'skulpt/skulpt-stdlib.js', 'showdownjs/dist/showdown.min.js', 'monaco/min/vs/loader.js', 'monaco/min/vs/editor/editor.main.nls.js', 'monaco/min/vs/editor/editor.main.js' ];

    for (let i = 0; i < scriptUrls.length; i++) {
        await loadScript(`../coderunner_dependencies/${scriptUrls[i]}`);
    }

    // Set parameters
    const parameters = window.parameters ?? {
        files: [
            { contents: '', name: 'main.py', solution: '' },
        ],
        input: '',
    };
    const { files } = parameters;

    // Set input.
    input.value = parameters.input;

    // Set solution if one exists.
    const hasSolution = files.some(({ solution }) => solution);
    const solutionArea = document.getElementsByTagName('details')[0];

    if (hasSolution) {
        files.forEach(({ name, solution }) => {
            if (files.length > 1) {
                const h4 = document.createElement('h4');

                h4.textContent = name;
                solutionArea.appendChild(h4);
            }

            const code = document.createElement('code');

            code.textContent = solution;
            solutionArea.appendChild(code);
        });
    }
    else {
        solutionArea.remove();
    }

    // Start file selector if needed.
    const selectorContainer = document.getElementById('selector-container');
    const selector = selectorContainer.getElementsByTagName('select')[0];

    if (files.length > 1) {
        files.map(({ name }) => {
            const option = document.createElement('option');

            option.text = name;
            selector.appendChild(option);
        });

        selector.addEventListener('change', () => {
            const all = document.querySelectorAll('#editors > div');
            const index = files.findIndex(({ name }) => name === selector.value);
            const selected = all[index];

            // Hide all editors, except the selected editor.
            all.forEach(editor => {
                editor.style.display = editor === selected ? 'block' : 'none';
            });
        });
    }
    else {
        selectorContainer.remove();
    }

    // Start code editors.
    editors = files.map((file, index) => {
        const div = document.createElement('div');

        document.getElementById('editors').appendChild(div);

        const editor = monaco.editor.create(div, {
            language: 'python',
            minimap: { enabled: false },
            value: file.contents,
        });

        editor.onDidChangeModelContent(() => {
            file.contents = editor.getValue();
        })

        // Hide all but the first editor initially.
        if (index) {
            div.style.display = 'none';
        }

        return editor;
    });

    // Configure Python runner.
    Sk.configure({
        execLimit: 5000,
        inputfun: () => new Promise(resolve => resolve(inputLines.shift())),
        output: text => {
            output.value += text.replace(/</g, '&lt;');
        },
        read: filename => {
            const file = Sk.builtinFiles?.files[filename] ??
                files.find(({ name }) => `./${name}` === filename)?.contents;

            if (!file) {
                throw new Error(`File not found: ${filename}`);
            }

            return file;
        },
        __future__: Sk.python3,
    });

    // Show page.
    document.body.style.visibility = 'visible';
});
