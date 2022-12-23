import { _createBlock, _createComponent, onCleanup, WindowProvider, _declareBlock, createSignal, onError } from 'seniman';
import { parse } from 'stacktrace-parser';
import fs from 'node:fs';

function addFileContentsToStackTraceLine(line) {
    if (line.file.startsWith('file://')) {
        let contents = fs.readFileSync(line.file.split('file://')[1], 'utf8');
        let lines = contents.split('\n');
        let lineContents = lines[line.lineNumber - 1];

        line.contents = lineContents;
    } else {
        line.contents = '';
    }
}

function ErrorViewer(props) {

    return <div style={{ padding: '20px' }}>
        {() => {

            if (process.env.NODE_ENV == 'production') {
                return <div>Error</div>;
            }

            return <div style={{ 'font-family': 'monospace' }}>
                <div>
                    <div style={{ 'font-size': '24px' }}>{props.name}</div>
                    <div style={{ 'font-size': '15px', 'margin-top': '5px' }}>{props.message}</div>
                </div>
                <div style={{ border: '1px solid #ccc', 'margin-top': '10px', 'padding': '10px' }}>
                    {props.stack.map(line => {
                        addFileContentsToStackTraceLine(line);
                        return <div style={{ 'font-size': '13px', 'border-bottom': '1px solid #eee', 'margin-bottom': '10px' }}>
                            <div>
                                <span style={{ color: '#444' }}>{line.methodName}</span>
                                <span style={{ color: '#666', 'overflow-wrap': 'break-word' }}>
                                    <span> @ {line.file} at line {line.lineNumber}, column {line.column}</span>
                                </span>
                            </div>
                            <div style={{ 'font-family': 'monospace', color: '#333', background: '#eee', padding: '10px', 'margin-bottom': '10px', 'margin-top': '10px' }}>
                                <span>{line.contents}</span>
                            </div>
                        </div>;
                    })}
                </div>
            </div>
        }}
    </div >
}

function DisconnectionPrompt() {
    return <div id='disconn' style={{ display: 'none', position: 'fixed', bottom: '10%', padding: '10px', 'font-size': '15px', background: '#eee', border: '1px solid #ccc', left: 'calc(50% - 60px)' }}>
        Disconnected <button onclick="location.reload();">Reload</button>
    </div>;
}

function ReconnectionPrompt() {
    return <div id='reconn' style={{ display: 'none', position: 'fixed', bottom: '10%', padding: '10px', 'font-size': '15px', background: '#eee', border: '1px solid #ccc', left: 'calc(50% - 60px)' }}>
        Reconnecting...
    </div>;
}

export function HeadTag(props) {
    return <>
        <meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1.0,user-scalable=no' />
        <style>{props.cssText}</style>
        <title>{props.window.pageTitle}</title>
    </>;
}

export function BodyTag(props) {
    let [runtimeError, set_runtimeError] = createSignal(null);

    onError((err) => {
        console.error(err);
        set_runtimeError(err);
    });

    let RootComponent = props.RootComponent;

    return <>
        <WindowProvider value={props.window}>
            {() => {
                if (props.syntaxErrors) {
                    let fileName = Object.keys(props.syntaxErrors)[0];
                    let err = props.syntaxErrors[fileName];
                    let stack = [err];
                    return <ErrorViewer name={err.name} message={err.message} stack={stack} />;
                } else if (runtimeError()) {
                    let err = runtimeError();
                    let stack = parse(err.stack);
                    return <ErrorViewer name={err.name} message={err.message} stack={stack} />;
                } else {
                    return <RootComponent />
                }
            }}
        </WindowProvider>
        <DisconnectionPrompt />
        <ReconnectionPrompt />
    </>
}