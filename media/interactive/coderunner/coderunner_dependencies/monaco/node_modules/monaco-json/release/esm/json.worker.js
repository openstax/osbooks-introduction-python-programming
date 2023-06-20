/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker';
import { JSONWorker } from './jsonWorker';
self.onmessage = function () {
    // ignore the first message
    worker.initialize(function (ctx, createData) {
        return new JSONWorker(ctx, createData);
    });
};
