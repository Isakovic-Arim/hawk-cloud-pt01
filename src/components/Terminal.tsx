'use client';

import 'xterm/css/xterm.css';
import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { io } from 'socket.io-client';

export default function TerminalComponent() {
    const termRef = useRef(null);

    useEffect(() => {
        const terminal = new Terminal({
            cursorBlink: true,
            fontSize: 18,
            rows: 15,
            cols: 80,
            fontFamily: 'Menlo, monospace',
            theme: {
                background: '#EDF7F8',
                foreground: '#0BDFFF',
            },
            cursorStyle: 'underline',
            cursorWidth: 2,
            allowTransparency: true,
            scrollback: 1000,
            tabStopWidth: 4,
            fontWeight: 'bold'
        });

        terminal.open(termRef.current);
        terminal.focus();

        fetch('/api/socket');
        const socket = io('http://localhost:3001');

        socket.on('connect', () => {
            console.log('Socket connected');
        });

        socket.on('output', (data) => {
            terminal.write(data);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            terminal.dispose();
        });

        const onInput = (event) => {
            event.preventDefault(); // add this line to prevent the default behavior
            socket.emit('input', event.target.value);
            event.target.value = ''; // clear the input field after emitting the input event
        };

        terminal.attachCustomKeyEventHandler((event) => {
            const printable = !event.altKey && !event.ctrlKey && !event.metaKey;
            if (event.key === 'Enter') {
                onInput(event);
            } else if (event.key === 'Backspace') {
                if (terminal.buffer.cursorX > 0) {
                    terminal.write('\b \b');
                }
            } else if (event.key === 'ArrowLeft') {
                if (terminal.buffer.cursorX > 0) {
                    terminal.write('\x1b[D');
                }
            } else if (event.key === 'ArrowRight') {
                if (terminal.buffer.cursorX < terminal.cols - 1) {
                    terminal.write('\x1b[C');
                }
            } else if (event.key === 'ArrowUp') {
                if (terminal.buffer.cursorY > 0) {
                    terminal.write('\x1b[A');
                }
            } else if (event.key === 'ArrowDown') {
                if (terminal.buffer.cursorY < terminal.rows - 1) {
                    terminal.write('\x1b[B');
                }
            } else if (printable) {
                terminal.write(event.key);
            }
        });

        return () => {
            socket.close();
            terminal.dispose();
        };
    }, []);

    return <div>
        <div ref={termRef} />
    </div>;
};