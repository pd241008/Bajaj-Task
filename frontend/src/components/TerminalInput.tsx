"use client";

interface TerminalInputProps {
  input: string;
  setInput: (val: string) => void;
  onExecute: () => void;
  onClear: () => void;
  loading: boolean;
}

export const TerminalInput = ({
  input,
  setInput,
  onExecute,
  onClear,
  loading,
}: TerminalInputProps) => {
  return (
    <div className="terminal-card">
      <label className="terminal-label" htmlFor="node-input">
        // Enter edges separated by commas or newlines
      </label>
      <textarea
        id="node-input"
        className="terminal-textarea"
        placeholder="A->B, B->C, C->D, A->A, X->Y, A->B"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.key === "Enter") onExecute();
        }}
      />
      <div className="btn-group">
        <button
          id="submit-btn"
          className="btn btn-primary"
          onClick={onExecute}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" /> Processing...
            </>
          ) : (
            "▶ Execute"
          )}
        </button>
        <button
          id="clear-btn"
          className="btn btn-secondary"
          onClick={onClear}
          disabled={loading}
        >
          ✕ Clear
        </button>
      </div>
    </div>
  );
};
