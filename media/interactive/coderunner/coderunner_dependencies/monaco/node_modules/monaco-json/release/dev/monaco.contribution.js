/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define('vs/language/json/fillers/monaco-editor-core',[], function () {
    return self.monaco;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define('vs/language/json/monaco.contribution',["require", "exports", "./fillers/monaco-editor-core"], function (require, exports, monaco_editor_core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.jsonDefaults = void 0;
    var LanguageServiceDefaultsImpl = /** @class */ (function () {
        function LanguageServiceDefaultsImpl(languageId, diagnosticsOptions, modeConfiguration) {
            this._onDidChange = new monaco_editor_core_1.Emitter();
            this._languageId = languageId;
            this.setDiagnosticsOptions(diagnosticsOptions);
            this.setModeConfiguration(modeConfiguration);
        }
        Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "onDidChange", {
            get: function () {
                return this._onDidChange.event;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "languageId", {
            get: function () {
                return this._languageId;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "modeConfiguration", {
            get: function () {
                return this._modeConfiguration;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "diagnosticsOptions", {
            get: function () {
                return this._diagnosticsOptions;
            },
            enumerable: false,
            configurable: true
        });
        LanguageServiceDefaultsImpl.prototype.setDiagnosticsOptions = function (options) {
            this._diagnosticsOptions = options || Object.create(null);
            this._onDidChange.fire(this);
        };
        LanguageServiceDefaultsImpl.prototype.setModeConfiguration = function (modeConfiguration) {
            this._modeConfiguration = modeConfiguration || Object.create(null);
            this._onDidChange.fire(this);
        };
        return LanguageServiceDefaultsImpl;
    }());
    var diagnosticDefault = {
        validate: true,
        allowComments: true,
        schemas: [],
        enableSchemaRequest: false
    };
    var modeConfigurationDefault = {
        documentFormattingEdits: true,
        documentRangeFormattingEdits: true,
        completionItems: true,
        hovers: true,
        documentSymbols: true,
        tokens: true,
        colors: true,
        foldingRanges: true,
        diagnostics: true,
        selectionRanges: true
    };
    exports.jsonDefaults = new LanguageServiceDefaultsImpl('json', diagnosticDefault, modeConfigurationDefault);
    // export to the global based API
    monaco_editor_core_1.languages.json = { jsonDefaults: exports.jsonDefaults };
    // --- Registration to monaco editor ---
    function getMode() {
        return new Promise(function (resolve_1, reject_1) { require(['./jsonMode'], resolve_1, reject_1); });
    }
    monaco_editor_core_1.languages.register({
        id: 'json',
        extensions: ['.json', '.bowerrc', '.jshintrc', '.jscsrc', '.eslintrc', '.babelrc', '.har'],
        aliases: ['JSON', 'json'],
        mimetypes: ['application/json']
    });
    monaco_editor_core_1.languages.onLanguage('json', function () {
        getMode().then(function (mode) { return mode.setupMode(exports.jsonDefaults); });
    });
});

