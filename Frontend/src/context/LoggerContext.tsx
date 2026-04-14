import React, { createContext, useContext, useState, useCallback } from 'react';

interface LoggerContextType {
    logs: string[];
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
}

const LoggerContext = createContext<LoggerContextType | undefined>(undefined);

interface LoggerProviderProps
{
    children: React.ReactNode
}

export function LoggerProvider({ children }: LoggerProviderProps) {
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = useCallback((args: any[], prefix: string = "") => {
        const formatted = args.map(arg => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)))
            .join(" ");

        const finalMessage = `${prefix} ${formatted}`;

        setLogs(prev => [...prev, finalMessage]);
    }, []);

    function log(...args: any[])
    {
        console.log(...args);
        addLog(args);
    }

    function warn(...args: any[])
    {
        console.warn(...args);
        addLog(args, "⚠️");
    }

    function error(...args: any[])
    {
        console.error(...args);
        addLog(args, "❌");
    }

    return (
        <LoggerContext.Provider value={{ logs, log, warn, error }}>
            {children}
        </LoggerContext.Provider>
    );
};

export const useLogger = () => {
    const context = useContext(LoggerContext);
    if (!context) {
        throw new Error("useLogger must be used inside a LoggerProvider");
    }
    return context;
};