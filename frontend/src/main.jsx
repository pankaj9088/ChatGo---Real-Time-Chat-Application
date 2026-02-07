import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', color: 'red', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                    <h1>Something went wrong.</h1>
                    <h2>{this.state.error?.toString()}</h2>
                    <details style={{ marginTop: '20px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Error Stack (Click to expand)</summary>
                        <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '10px', overflow: 'auto', color: '#333' }}>
                            {this.state.error?.stack}
                        </pre>
                    </details>
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }}
                        style={{ marginTop: '20px', padding: '10px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                        Clear Data & Reload
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>
);
