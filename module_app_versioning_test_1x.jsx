import React, { useState, useMemo, useCallback, useEffect, Fragment, useRef } from 'react';
import { 
    HelpCircle, 
    Search, 
    HardDrive, 
    TrendingUp, 
    Settings, 
    Cpu, 
    ChevronLeft, 
    ChevronRight,
    LayoutGrid,
    Globe,
    Shield,
    DollarSign,
    X,
    ArrowRight,
    ChevronsRight,
    Zap,
    Github,
    FileText
} from 'lucide-react';

/* * --- AIP LITE CORE ---
 * Current File: AIP-Lite-Core.jsx
 * Purpose: A stable, modular, non-logging, non-API-dependent core shell.
 * This version is the foundation for modular feature integration.
 * It contains the UI shell, navigation, and static placeholders.
 * --- END STATUS ---
 */

// --- 1. Core Components (Static & Stable) ---

const Header = ({ appName }) => (
    <header className="flex-shrink-0 flex items-center justify-between p-3 bg-gray-900 border-b border-indigo-700/50">
        <div className="flex items-center">
            <div className="p-2 bg-indigo-700/30 rounded-lg mr-3">
                <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wider">{appName}</h1>
        </div>
        <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-green-400">[STATUS: STABLE CORE]</span>
            <Github className="w-5 h-5 text-gray-500 hover:text-white transition-colors" />
        </div>
    </header>
);

const Sidebar = ({ activeView, setActiveView, isExpanded, setIsExpanded }) => {
    const navItems = [
        { id: 'research', label: 'Research Portal', icon: Search },
        { id: 'depot', label: 'Client Depot (MOCKED)', icon: HardDrive },
        { id: 'stats', label: 'AIA Stats (MOCKED)', icon: TrendingUp },
    ];

    return (
        <nav 
            className={`flex-shrink-0 flex flex-col justify-between bg-gray-900/50 border-r border-indigo-700/30 transition-all duration-300 ${isExpanded ? 'w-56' : 'w-16'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div>
                <ul className="space-y-2 p-3">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveView(item.id)}
                                className={`flex items-center space-x-3 p-3 rounded-lg w-full overflow-hidden transition-all duration-200 ${
                                    activeView === item.id
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <span className={`font-medium transition-opacity duration-100 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

const FooterNav = ({ onToggleSettings, onToggleLog, logStatus }) => (
    <footer className="flex-shrink-0 flex items-center justify-between p-2 bg-gray-900 border-t border-indigo-700/50">
        <div className="flex items-center space-x-2">
            <button 
                onClick={onToggleSettings}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
            >
                <Settings className="w-5 h-5" />
            </button>
        </div>
        <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-gray-500">AIP Core v1.0 (Lite)</span>
            <button 
                onClick={onToggleLog}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
            >
                <Cpu className={`w-5 h-5 ${logStatus ? 'text-cyan-400' : ''}`} />
            </button>
        </div>
    </footer>
);

// --- 2. Core Logic & App Shell ---

const AIPAppCore = () => {
    // --- State Management ---
    const [activeView, setActiveView] = useState('research');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [logEntries, setLogEntries] = useState([]);
    const [showLog, setShowLog] = useState(false);
    const [currentSubdomain, setCurrentSubdomain] = useState('home.aip.app');

    // --- Logging (Simplified for Lite Core) ---
    // This function is passed to children but only logs locally.
    const logEvent = useCallback((type, message) => {
        const timestamp = new Date().toLocaleTimeString();
        const newEntry = { timestamp, type, message };
        setLogEntries(prevEntries => [newEntry, ...prevEntries].slice(0, 50));
        console.log(`[AIP LOG] ${type}: ${message}`);
    }, []);

    // --- Mock Navigation ---
    const navigateToDomain = (domain, category) => {
        logEvent('NAVIGATE', `Request -> ${domain} (Cat: ${category})`);
        setCurrentSubdomain(domain);
    };

    // --- View Rendering Logic ---
    const RenderActiveView = () => {
        // This switch renders the active view based on state.
        switch (activeView) {
            case 'research':
                return (
                    <ResearchPortalPlaceholder 
                        currentUrl={currentSubdomain}
                        onNavigate={navigateToDomain}
                    />
                );
            case 'depot':
            case 'stats':
                return <FeatureNotActive view={activeView} />;
            default:
                return <ResearchPortalPlaceholder 
                            currentUrl={currentSubdomain}
                            onNavigate={navigateToDomain}
                        />;
        }
    };
    
    return (
        <div className="flex flex-col h-screen w-full bg-gray-950 text-gray-200 font-sans">
            <Header appName="AIP Terminal (Lite)" />
            
            <div className="flex flex-1 overflow-hidden">
                <Sidebar 
                    activeView={activeView} 
                    setActiveView={setActiveView}
                    isExpanded={isSidebarExpanded}
                    setIsExpanded={setIsSidebarExpanded}
                />
                
                <main className="flex-1 p-4 overflow-y-auto">
                    {/* Render the active view component */}
                    <RenderActiveView />
                </main>

                <EventLogPanel 
                    entries={logEntries} 
                    isOpen={showLog}
                    onClose={() => setShowLog(false)}
                />
            </div>

            <FooterNav 
                onToggleSettings={() => setActiveView('settings')}
                onToggleLog={() => setShowLog(prev => !prev)}
                logStatus={showLog}
            />
        </div>
    );
};

// --- 3. View Placeholders (Modular & Stable) ---

// This replaces the unstable ContentWindow
const ResearchPortalPlaceholder = ({ currentUrl, onNavigate }) => {
    const quickLinks = [
        { name: 'Industry/Tech', domain: 'tech.aip.dev', category: 'Tech' },
        { name: 'Social/Finance', domain: 'finance.aip.dev', category: 'Finance' },
        { name: 'Geo/Political', domain: 'geo.aip.dev', category: 'Political' },
        { name: 'Other/Unspecified', domain: 'misc.aip.dev', category: 'Other' },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* 1. Navigation Simulator */}
            <div className="flex-shrink-0 bg-gray-900/50 p-4 rounded-xl border border-indigo-700/30">
                <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-gray-500" />
                    <input 
                        type="text"
                        value={currentUrl}
                        readOnly
                        className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                    />
                    <button className="px-3 py-1 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-500">
                        TRAVERSE
                    </button>
                </div>
            </div>

            {/* 2. Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickLinks.map(link => (
                    <button 
                        key={link.domain}
                        onClick={() => onNavigate(link.domain, link.category)}
                        className="p-3 bg-gray-800 rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        <span className="text-sm font-medium text-gray-300">{link.name}</span>
                    </button>
                ))}
            </div>

            {/* 3. Stable Content View */}
            <div className="flex-1 flex items-center justify-center bg-gray-900/50 p-6 rounded-xl border border-cyan-500/30 border-dashed">
                <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Static Content View</h3>
                    <p className="text-gray-400">Content for <strong className="text-cyan-400">{currentUrl}</strong> would render here.</p>
                    <p className="text-gray-500 text-sm mt-1">(This view is stable and ready for module integration.)</p>
                </div>
            </div>
        </div>
    );
};

// This replaces all non-built modules
const FeatureNotActive = ({ view }) => (
    <div className="flex flex-col h-full items-center justify-center p-10 text-center bg-gray-800/50 border border-red-500/30 rounded-xl">
        <div className="p-4 bg-red-900/50 rounded-full mb-4">
            <X className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-2xl font-bold text-red-400 mb-2">Feature Not Active: {view.toUpperCase()}</h3>
        <p className="text-gray-400">This module requires integration (e.g., Client Depot) or a Paid License.</p>
        <p className="text-gray-500 text-sm mt-2">Returning to Research Portal...</p>
    </div>
);


// --- 4. Utility Components (Logging) ---

const EventLogPanel = ({ entries, isOpen, onClose }) => {
    return (
        <div 
            className={`fixed top-0 right-0 h-full bg-gray-950 shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col border-l border-indigo-700/50
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
            style={{ width: 'clamp(300px, 30vw, 450px)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-indigo-700/30 flex-shrink-0">
                <div className="flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">Operational Event Log (Local)</h3>
                </div>
                <button 
                    onClick={onClose}
                    className="p-1 rounded-lg text-gray-500 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                >
                    <ChevronsRight className="w-5 h-5" />
                </button>
            </div>

            {/* Log Entries */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
                {entries.length === 0 && (
                    <p className="text-gray-500 text-sm italic">No events logged in this session.</p>
                )}
                {entries.map((entry, index) => (
                    <div key={index} className="font-mono text-xs p-2 bg-gray-800/60 rounded">
                        <span className="text-gray-500 mr-2">{entry.timestamp}</span>
                        <span className={
                            entry.type === 'NAVIGATE' ? 'text-cyan-400' :
                            entry.type === 'ERROR' ? 'text-red-400' :
                            'text-gray-300'
                        }>
                            [{entry.type}]
                        </span>
                        <span className="text-gray-400 ml-2">{entry.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- 5. Error Boundary & App Export ---

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("AIP Core Error Boundary caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center h-screen w-full bg-red-900 text-white p-10">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">CRITICAL RENDER FAILURE</h1>
                        <p className="mb-4">The AIP Terminal core failed to render. This is a critical error.</p>
                        <pre className="text-left bg-gray-900 p-4 rounded-lg text-red-300 font-mono text-sm overflow-auto">
                            {this.state.error?.toString()}
                        </pre>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// Final App export
export default function App() {
    return (
        <ErrorBoundary>
            <AIPAppCore />
        </ErrorBoundary>
    );
}

