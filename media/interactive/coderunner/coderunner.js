window.addEventListener('load', async() => {
    // Hide page while code runner loads.
    document.body.style.visibility = 'hidden';

    const filePath = window.filePath ?? '..';

    // Load styles and DOM.
    document.body.innerHTML = `<style>
    body {
        background-color: #FFFFFF;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .editors-container {
        display: flex;
        flex-grow: 1;
        min-height: 200px;
    }

    .editors-container > div {
        border: thin solid #D5D5D5;
        border-radius: 3px;
        margin-top: -1px;
        width: 100%;
    }

    #input {
        border-radius: 3px;
        flex: initial;
        margin-top: 15px;
        resize: none;
    }

    #button-container {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
    }

    #output {
        background-color: #F1F1F1;
        border: 1px solid rgba(189,189,189,.5);
        border-radius: 2px;
        color: #37474F;
        display: block;
        font-family: "Courier New",monospace;
        height: 60px;
        margin-top: 15px;
        overflow-x: auto;
        padding: 4px 10px;
        white-space: pre-wrap;
    }

    #reset, #toggle-solution {
        background-color: white;
        box-shadow: none;
        color: #0288D1;
        margin-bottom: 5px;
        margin-top: 15px;
        padding: 0;
    }

    #reset:hover, #toggle-solution:hover {
        color: #37474F;
    }

    #solution-files.hidden {
        filter: blur(5px);
        pointer-events: none;
    }

    [type=radio] {
        -webkit-appearance: none;
        appearance: none;
        height: 0;
        margin: 0;
    }

    [type="radio"]+label.btn {
        background-color: initial;
        border: none;
        box-shadow: none;
        padding: 0;
    }

    label.btn:hover {
        background-color: initial;
    }

    .selector-container {
        display: flex;
    }

    .selector-container > div {
        background-color: #E8E8E8;
        border: 0.1rem solid #D5D5D5;
        border-bottom: 1px solid #FFFFFF;
        border-radius: 0.5rem;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        flex: 1 1 0;
        overflow: hidden;
        padding: 0 2rem;
        position: relative;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .selector-container > div:hover {
        background-color: #F1F1F1;
        cursor: pointer;
    }

    .selector-container > div:not(:first-of-type) {
        margin-left: -1px;
    }

    .selector-container > div.selected {
        background-color: #FFFFFF;
        z-index: 1;
    }
</style>
<div id="user-selector-container" class="selector-container"></div>
<div id="editors" class="editors-container"></div>
<textarea id="input" rows="3" aria-label="Input to the program"></textarea>
<div id='button-container'>
    <button class="primary medium" onclick="run()">Run</button>
    <button id="reset" class="secondary small" onclick="reset()">Reset code</button>
</div>
<output id="output" aria-label="Output of the program"></output>
<div id="solution-container">
    <button id="toggle-solution" class="secondary small" onclick="toggleSolution()" aria-label="View solution"></button>
    <div id="solution-files">
        <div id="solution-selector-container" class="selector-container"></div>
        <div id="solution-editors" class="editors-container"></div>
    </div>
</div>`;

    // Global variables for the code runner.
    let editors = null;
    let inputLines = null;
    let solutionEditors = null;
    const [ input, output, solutionSelectorContainer, userSelectorContainer ] = [
        'input', 'output', 'solution-selector-container', 'user-selector-container',
    ].map(id => document.getElementById(id));

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

    /**
        Reset the code to the default template.
        @function reset
        @return {void}
    */
    window.reset = function() {
        if (window.confirm('You will lose your changes.')) {
            editors.forEach((editor, index) => editor.setValue(originalFileContents[index]));
        }
    }

    /**
        Toggle whether the solution is shown.
        @function toggleSolution
        @return {void}
    */
    window.toggleSolution = function() {
        const solutionClassList = document.getElementById('solution-files').classList;

        solutionClassList.toggle('hidden');

        const button = document.getElementById('toggle-solution');
        const isHidden = solutionClassList.contains('hidden');

        button.textContent = isHidden ? 'View solution' : 'Hide solution';
        button.setAttribute('aria-pressed', String(!isHidden));
    }

    // Tells monaco's loader where to find the language-specific files.
    window.require = { paths: { vs: `${filePath}/coderunner_dependencies/monaco/min/vs` } };

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
    const scriptUrls = [ 'monaco/min/vs/loader.js', 'monaco/min/vs/editor/editor.main.nls.js', 'monaco/min/vs/editor/editor.main.js' ];

    for (let i = 0; i < scriptUrls.length; i++) {
        await loadScript(`${filePath}/coderunner_dependencies/${scriptUrls[i]}`);
    }

    // Set parameters
    const parameters = window.parameters ?? {
        files: [
            { contents: '', name: 'main.py', solution: '' },
        ],
        input: '',
    };
    const { files } = parameters;
    const originalFileContents = files.map(({ contents }) => contents);

    // Set input.
    input.value = parameters.input;

    // Start file selector if needed.
    if (files.length > 1) {
        /**
            Make a selector for each given name.
            @function makeSelectors
            @param {Element} container Add selectors to this container.
            @param {Function} getEditorDivs Returns the DIV of each editor.
            @param {String[]} names The name of each selector.
            @param {String} unique A unique identifier for each group of selectors.
            @return {void}
        */
        function makeSelectors({ container, getEditorDivs, names, unique }) {
            names.forEach((name, index) => {
                const div = document.createElement('div');

                div.setAttribute('title', name);
                div.addEventListener('click', () => {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change'));
                });
                container.appendChild(div);

                const radio = document.createElement('input');

                radio.setAttribute('type', 'radio');
                radio.setAttribute('id', `${name}-${unique}`);
                radio.setAttribute('name', `files-${unique}`);
                radio.setAttribute('value', name);
                radio.addEventListener('change', () => {
                    // Set the radio's parent as selected.
                    const selectors = container.querySelectorAll('div');

                    selectors.forEach(selector => selector.classList.remove('selected'));
                    div.classList.add('selected');

                    // Hide all editors, except the selected editor.
                    const editorDivs = getEditorDivs();
                    const selected = editorDivs[index];

                    editorDivs.forEach(editorDiv => {
                        editorDiv.style.display = editorDiv === selected ? 'block' : 'none';
                    });
                });
                div.appendChild(radio);

                const label = document.createElement('label');

                label.setAttribute('for', `${name}-${unique}`);
                label.textContent = name;
                label.classList.add('btn');
                label.classList.add('small');
                div.appendChild(label);
            });
        }

        const names = files.map(({ name }) => name);

        makeSelectors({
            container: userSelectorContainer,
            getEditorDivs: () => document.querySelectorAll('#editors > div'),
            names,
            unique: 'user',
        });
        makeSelectors({
            container: solutionSelectorContainer,
            getEditorDivs: () => document.querySelectorAll('#solution-editors > div'),
            names,
            unique: 'solution',
        });

        const labels = userSelectorContainer.querySelectorAll('label');
        const largestContentWidth = Math.max(...Array.from(labels).map(file => file.getBoundingClientRect().width));
        const containerWidths = [
            'padding-left', 'padding-right', 'margin-left', 'margin-right', 'border-left-width', 'border-right-width'
            ].flatMap(
                style => Array.from(userSelectorContainer.querySelectorAll('div')).map(div => parseInt(window.getComputedStyle(div, null).getPropertyValue(style), 10)),
            ).reduce((sum, value) => sum + value, 0);
        const neededWidth = (largestContentWidth * files.length) + containerWidths;

        function resizeFileSelectors() {
            const width = neededWidth < window.innerWidth ? `${neededWidth}px` : 'initial';

            userSelectorContainer.style.width = width;
            solutionSelectorContainer.style.width = width;
        }

        window.onresize = resizeFileSelectors;
        resizeFileSelectors();
    }
    else {
        userSelectorContainer.remove();
    }

    /**
        Make an editor for each file.
        @function makeEditors
        @param {Element} container Add editors to this container.
        @param {String[]} codes The code for each editor.
        @param {Boolean} readOnly True if the file cannot be edited.
        @return {void}
    */
    function makeEditors({ container, codes, readOnly }) {
        return codes.map((code, index) => {
            const div = document.createElement('div');

            container.appendChild(div);

            const editor = monaco.editor.create(div, {
                automaticLayout: true,
                language: 'python',
                minimap: { enabled: false },
                readOnly,
                value: code,
            });

            return editor;
        });
    }

    // Start code editors.
    editors = makeEditors({
        container: document.getElementById('editors'),
        codes: files.map(({ contents }) => contents),
        readOnly: false,
    });

    // Update file contents when user edits code.
    editors.forEach((editor, index) => {
        editor.onDidChangeModelContent(() => {
            files[index].contents = editor.getValue();
        });
    });

    // Set solution if one exists.
    const hasSolution = files.some(({ solution }) => solution);
    const solutionContainer = document.getElementById('solution-container');

    if (hasSolution) {
        solutionEditors = makeEditors({
            container: solutionContainer.querySelector('.editors-container'),
            codes: files.map(({ solution }) => solution),
            readOnly: true,
        });
        toggleSolution();
    }
    else {
        solutionContainer.remove();
    }

    // Select first file for user and solution.
    if (files.length > 1) {
        const selectFirst = container => {
            const firstSelector = container.querySelector('input');

            firstSelector.checked = true;
            firstSelector.dispatchEvent(new Event('change'));
        };

        selectFirst(userSelectorContainer);

        if (hasSolution) {
            selectFirst(solutionSelectorContainer);
        }
    }

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
