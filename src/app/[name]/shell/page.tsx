'use client';

import "xterm/css/xterm.css";
import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

export default function Shell() {
  const termRef = useRef(null);
  const fitAddon = new FitAddon();

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 18,
      fontFamily: "Menlo, monospace",
      theme: {
        background: "#1D1F21",
        foreground: "#DE935F",
      },
      cursorStyle: "underline",
      cursorWidth: 2,
      allowTransparency: true,
      scrollback: 1000,
      tabStopWidth: 4,
      fontWeight: "bold",
    });

    term.loadAddon(fitAddon);
    if (termRef.current !== null) {
      term.open(termRef.current);
    }
    fitAddon.fit();
    term.focus();

    return () => {
      term.dispose();
    };
  }, []);

  return <div ref={termRef} />;
}
