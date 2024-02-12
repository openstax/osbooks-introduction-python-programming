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
        margin 10px;
    }

    .editors-container {
        display: flex;
        height: 9em;
        min-height: 3.7em;
        overflow: hidden;
        resize: vertical;
    }

    .editors-container > div {
        border: thin solid #D5D5D5;
        border-radius: 3px;
        width: 100%;
    }

    label {
        margin-top: 1em;
    }

    #input {
        border-radius: 3px;
        color: #37474F;
        flex: initial;
        min-height: 5.2em;
        padding: 4px 10px;
        resize: vertical;
    }

    #button-container {
        display: flex;
        justify-content: space-between;
        margin-top: 1em;
    }

    #output {
        background-color: #F3F3F3;
        border: thin solid #D5D5D5;
        border-radius: 3px;
        box-sizing: border-box;
        color: #37474F;
        display: block;
        font-family: monospace;
        height: 5.3em;
        min-height: 2.2em;
        overflow-x: auto;
        padding: 4px 10px;
        resize: vertical;
        white-space: pre-wrap;
    }

    #reset, #toggle-solution {
        background-color: white;
        box-shadow: none;
        color: #0288D1;
        margin-top: auto;
        padding: 0 1ex 0 0;
    }

    #reset:hover, #toggle-solution:hover {
        color: #37474F;
    }

    #solution-container {
        margin-top: 1em;
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
        border: thin solid #D5D5D5;
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
        background-color: #F3F3F3;
        cursor: pointer;
    }

    .selector-container > div:not(:first-of-type) {
        margin-left: -1px;
    }

    .selector-container > div.selected {
        background-color: #FFFFFF;
        z-index: 1;
    }

    .monaco-editor .line-numbers {
        background-color: #F3F3F3;
        padding-right: 1ex;
    }
</style>
<div id="user-selector-container" class="selector-container"></div>
<div id="editors" class="editors-container"></div>
<label for="input">Input</label>
<textarea id="input"></textarea>
<div id='button-container'>
    <button class="primary medium" onclick="run()">Run</button>
    <button id="reset" class="secondary small" onclick="reset()">Reset all</button>
</div>
<label for="output">Output</label>
<output id="output"></output>
<div id="solution-container">
    <button id="toggle-solution" class="secondary small" onclick="toggleSolution()" aria-label="View solution"></button>
    <div id="solution-files">
        <div id="solution-selector-container" class="selector-container"></div>
        <div id="solution-editors" class="editors-container"></div>
    </div>
</div>
<div id="skulpt-read-files" style="display: none;"></div>`;

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

        // Skulpt opens and reads a file from DOM.
        const doms = files.map(({ name }, index) => `<div id="${name}">${editors[index].getValue()}</div>`);

        document.getElementById('skulpt-read-files').innerHTML = doms.join('');

        // Python input() works by reading until a newline.
        inputLines = input.value.split('\n');

        Sk.misceval
            .asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, editors[0].getValue(), true))
            .then(null, error => {
                output.value = error;
            });
    }

    // The parent.document may not be available due to CORS restrictions
    let parentDoc = null;
    let windowFrameElement = null;
    try {
        parentDoc = parent.document;
        windowFrameElement = window.frameElement;
    } catch (err) {
        console.log('Some features are disabled because of CORS');
    }

    // Remember original height of resizable elements.
    const heights = [
        document.getElementById('editors').offsetHeight,
        input.offsetHeight,
        output.offsetHeight,
        document.getElementById('solution-editors').offsetHeight,
        windowFrameElement?.clientHeight,
        windowFrameElement?.clientWidth,
    ].map(height => `${height}px`);

    /**
        Reset the code to the default template.
        @function reset
        @return {void}
    */
    window.reset = function() {
        if (window.confirm('You will lose your changes.')) {
            // reset contents
            editors.forEach((editor, index) => editor.setValue(originalFileContents[index]));
            input.value = parameters.input;
            output.value = '';
            // reset heights
            document.getElementById('editors').style.height = heights[0];
            input.style.height = heights[1];
            output.style.height = heights[2];
            if (heights[3]) {
                document.getElementById('solution-editors').style.height = heights[3];
            }
            if (windowFrameElement) {
                windowFrameElement.style.height = heights[4];
                windowFrameElement.style.width = heights[5];
            }
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

    // Set parameters.
    const parameters = window.parameters ?? {
        files: [
            { contents: '', name: 'main.py', solution: '' },
        ],
        input: '',
    };
    const { files } = parameters;
    const originalFileContents = files.map(({ contents }) => contents);

    // Set input (shrink textarea if blank).
    input.value = parameters.input;
    if (!input.value) {
        input.style.height = '0';  // set to min-height
        heights[1] = input.offsetHeight + 'px';
    }

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
                matchBrackets: 'near',
                minimap: { enabled: false },
                renderLineHighlight: 'none',
                scrollBeyondLastLine: false,
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
        heights[3] = null;
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
        nonreadopen: true,
        output: text => {
            output.value += text;
        },
        read: filename => {
            const file = Sk.builtinFiles?.files[filename] ??
                files.find(({ name }) => `./${name}` === filename)?.contents;

            if (!file) {
                throw new Error(`File not found: ${filename}`);
            }

            return file;
        },
        filewrite: (skFile, change) => {
            const index = files.findIndex(({ name }) => name === skFile.name);
            let contents = change.v;

            if (skFile.mode.v === 'a') {
                contents = files[index].contents + change.v;
            }

            // Update file contents back into file.
            files[index].contents = contents;
            editors[index].setValue(contents);
        },
        __future__: Sk.python3,
    });

    // Show page.
    document.body.style.visibility = 'visible';
});
