import React, {useEffect, useMemo, useRef} from "react";
import {Terminal, ITerminalOptions, ITerminalInitOnlyOptions} from 'xterm'
import {WebLinksAddon} from 'xterm-addon-web-links';
import {FitAddon} from 'xterm-addon-fit';

import 'xterm/css/xterm.css'

export interface XTermStream {
    write(data:string):void
    on(cb:(line:string) => void):() => void;
}

interface Props {
    terminalOptions?: ITerminalOptions & ITerminalInitOnlyOptions
    lines?: string[]
    stream?: XTermStream
    onData?: (string) => void
}

export const XTerm = (props: Props) => {

    const xtermContainer = useRef<HTMLDivElement>(null);

    const terminal = useMemo(() => {
        const t = new Terminal(props.terminalOptions);
        t.loadAddon(new WebLinksAddon());
        t.loadAddon(new FitAddon());
        return t;
    }, [props.terminalOptions])

    useEffect(() => {
        if (xtermContainer.current) {
            terminal.open(xtermContainer.current);
        }
    }, [terminal, xtermContainer.current]);

    useEffect(() => {
        if (props.onData) {
            const disposer = terminal.onData(props.onData);
            return () => {
                disposer.dispose();
            }
        }
        return () => {};
    }, [props.onData]);

    useEffect(() => {
        if (terminal) {
            if (props.terminalOptions?.disableStdin) {
                terminal.write('\x1b[?25l'); //Hide cursor
            } else {
                terminal.write('\x1b[?25h'); //Show cursor
            }
        }

        return () => {};

    }, [props.terminalOptions?.disableStdin, terminal]);

    useEffect(() => {
        terminal.clear();
        props.lines?.forEach(log => terminal.writeln(log));
    }, [props.lines]);

    useEffect(() => {
        if (props.stream) {
            const listenerDisposer = props.stream.on((line) => {
                line = line.replace(/\n?\r/g,'\n\r');
                terminal.write(line);
            });

            const disposer = terminal.onData((data) => {
                props.stream.write(data);
            });

            return () => {
                listenerDisposer();
                disposer.dispose();
            }
        }
        return () => {};
    }, [terminal, props.stream]);

    return (
        <div ref={xtermContainer}></div>
    )
}
