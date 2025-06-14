const { useState, useEffect } = React;

// --- ICONS (Heroicons or similar simple SVGs) ---
const IconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
const IconBell = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
const IconGrid = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5M12 12.75h.008v.008H12v-.008z" /></svg>;
const IconChat = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443h2.284M1.946 9.315c0-1.605 1.123-2.995 2.707-3.228C5.74 5.926 6.838 5.803 7.946 5.72V3.5L12.022 7.57a1.526 1.526 0 001.037.443h2.284c1.584 0 2.707 1.215 2.707 2.707v3.228M1.946 9.315C1.566 9.424 1.5 9.623 1.5 9.843v3.916c0 .22.066.419.446.528C2.632 14.541 3.5 14.723 3.5 15V9.315zM21 15V9.843c0-.22-.066-.419-.446-.528C19.868 9.19 19 9.007 19 8.565v6.435c0 .44.868.622 1.554.528.38-.109.446-.308.446-.528z" /></svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 1.655c-.007.379.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-1.655c.007-.379-.137-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>;
const IconChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;

// Specific Stat Icons
const IconBloodDrop = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="24" height="24"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-9a1 1 0 011 1v1.083l2.243 2.242a1 1 0 01-1.414 1.414L10 11.414V13a1 1 0 01-2 0v-1.586l-1.828-1.828a1 1 0 111.414-1.414L9 10.083V9a1 1 0 011-1z" clipRule="evenodd" /></svg>; // Placeholder, ideal is a blood drop
const IconHeart = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="24" height="24"><path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" /></svg>;
const IconWaterDrop = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="24" height="24"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.234 7.087a.75.75 0 011.06-.019L10 9.72l2.706-2.652a.75.75 0 111.039 1.082l-3.25 3.184a.75.75 0 01-1.064.017L6.253 8.148a.75.75 0 01-.019-1.06z" clipRule="evenodd" /></svg>; // Placeholder, ideal is water/pressure icon


// --- DATA ---
const healthStatsData = [
    { id: 'bs', icon: <IconBloodDrop />, title: 'Blood Sugar', value: '80', unit: 'mg / dL', status: 'Normal', statusClass: 'normal-orange', cardClass: 'blood-sugar' },
    { id: 'hr', icon: <IconHeart />, title: 'Heart Rate', value: '98', unit: 'bpm', status: 'Normal', statusClass: 'normal-pink', cardClass: 'heart-rate' },
    { id: 'bp', icon: <IconWaterDrop />, title: 'Blood Pressure', value: '102', subValue: '/ 72', unit: 'mmHg', status: 'Normal', statusClass: 'normal-cyan', cardClass: 'blood-pressure' },
];

const activityGrowthData = [
    { date: "Jan 1", aerobics: 25, yoga: 55, meditation: 70 }, { date: "Jan 2", aerobics: 15, yoga: 62, meditation: 80 },
    { date: "Jan 3", aerobics: 45, yoga: 50, meditation: 60 }, { date: "Jan 4", aerobics: 35, yoga: 30, meditation: 55 },
    { date: "Jan 5", aerobics: 20, yoga: 38, meditation: 62 }, { date: "Jan 6", aerobics: 10, yoga: 55, meditation: 45 },
    { date: "Jan 7", aerobics: 30, yoga: 65, meditation: 78 }, { date: "Jan 8", aerobics: 22, yoga: 40, meditation: 70 },
    { date: "Jan 9", aerobics: 18, yoga: 25, meditation: 65 }, { date: "Jan 10", aerobics: 33, yoga: 48, meditation: 50 },
    { date: "Jan 11", aerobics: 12, yoga: 30, meditation: 40 }, { date: "Jan 12", aerobics: 28, yoga: 52, meditation: 72 },
    { date: "Jan 13", aerobics: 38, yoga: 42, meditation: 60 }, { date: "Jan 14", aerobics: 20, yoga: 35, meditation: 50 },
    { date: "Jan 15", aerobics: 10, yoga: 45, meditation: 68 }, { date: "Jan 16", aerobics: 42, yoga: 60, meditation: 55 },
    { date: "Jan 17", aerobics: 25, yoga: 33, meditation: 48 }, { date: "Jan 18", aerobics: 32, yoga: 70, meditation: 30 },
];


// --- COMPONENTS ---
const Sidebar = ({ activePage, onNavClick }) => {
    const navItems = [
        { id: 'dashboard', icon: <IconGrid /> }, { id: 'calendar', icon: <IconCalendar /> },
        { id: 'chat', icon: <IconChat /> }, { id: 'clock', icon: <IconClock /> },
        { id: 'settings', icon: <IconSettings /> }, { id: 'logout', icon: <IconLogout /> }
    ];
    return (
        <nav className="sidebar">
            {navItems.map(item => (
                <div key={item.id}
                    className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
                    onClick={() => onNavClick(item.id)}
                    title={item.id.charAt(0).toUpperCase() + item.id.slice(1)}>
                    {item.icon}
                </div>
            ))}
        </nav>
    );
};

const DashboardHeader = () => (
    <header className="dashboard-header">
        <div className="header-left">
            <h1>Health Overview</h1>
            <p>August 12, 2021</p>
        </div>
        <div className="header-right">
            <button className="icon-button" aria-label="Search"><IconSearch /></button>
            <button className="icon-button" aria-label="Notifications"><IconBell /></button>
            <div className="user-avatar">
                {/* Replace with your actual avatar image */}
                <img src="https://i.pravatar.cc/48?img=12" alt="User Avatar" />
            </div>
        </div>
    </header>
);

const StatCard = ({ data }) => (
    <div className={`stat-card ${data.cardClass || ''}`}>
        <div className="stat-card-header">
            <div className={`stat-icon-bg ${data.cardClass || ''}`}>{data.icon}</div>
            <h3>{data.title}</h3>
        </div>
        <div className="stat-value">
            {data.value}
            {data.subValue && <span className="sub-value">{data.subValue}</span>}
            <span className="unit">{data.unit}</span>
        </div>
        <div className={`status-badge ${data.statusClass || ''}`}>{data.status}</div>
        <div className="stat-chart-placeholder">
            {/* Placeholder is styled with CSS background-image */}
        </div>
    </div>
);

const PhysicalStatCard = ({ label, value, unit, type }) => (
    <div className={`physical-stat-card ${type}`}>
        <div className="label">{label}</div>
        <div className="ruler"></div>
        <div className="value">{value} {unit}</div>
    </div>
);

const BMICard = () => (
    <div className="bmi-card">
        <h3>Body Mass Index (BMI)</h3>
        <div className="bmi-value">24.9</div>
        <div className="bmi-gauge">
            <div className="bmi-indicator"></div>
        </div>
        <div className="bmi-labels">
            <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
        </div>
        <div className="bmi-status-badge">You're Healthy</div>
    </div>
);

const BarChart = ({ data }) => {
    const maxVal = 80; // For scaling bars to 80% max
    return (
        <div className="bar-chart-container">
            <div className="y-axis-label y80">80%</div>
            <div className="y-axis-label y60">60%</div>
            <div className="y-axis-label y40">40%</div>
            <div className="y-axis-label y20">20%</div>
            {data.map((day, index) => (
                <div key={index} className="bar-group">
                    <div className="bars-in-group">
                        <div className="bar aerobics" style={{ height: `${day.aerobics / maxVal * 100}%` }}></div>
                        <div className="bar yoga" style={{ height: `${day.yoga / maxVal * 100}%` }}></div>
                        <div className="bar meditation" style={{ height: `${day.meditation / maxVal * 100}%` }}></div>
                    </div>
                    <div className="x-axis-label">{day.date}</div>
                </div>
            ))}
        </div>
    );
};

const ActivityGrowthCard = () => (
    <div className="activity-growth-card">
        <div className="activity-header">
            <h2>Activity Growth</h2>
            <button className="date-filter-dropdown">
                Jan 2021 <IconChevronDown />
            </button>
        </div>
        <BarChart data={activityGrowthData} />
        <div className="chart-legend">
            <div className="legend-item">
                <span className="legend-color-box" style={{ backgroundColor: '#EF9A9A' }}></span> Aerobics
            </div>
            <div className="legend-item">
                <span className="legend-color-box" style={{ backgroundColor: '#80CBC4' }}></span> Yoga
            </div>
            <div className="legend-item">
                <span className="legend-color-box" style={{ backgroundColor: '#FFCC80' }}></span> Meditation
            </div>
        </div>
    </div>
);


const MainContent = () => {
    return (
        <div className="main-content-wrapper">
            <div className="page-title-header">Dashboard</div>
            <DashboardHeader />
            <section className="stats-overview">
                {healthStatsData.map(stat => <StatCard key={stat.id} data={stat} />)}
            </section>
            <section className="physical-stats-section">
                <div className="physical-stat-container">
                    <PhysicalStatCard label="Height" value="170" unit="cm" type="height" />
                    <PhysicalStatCard label="Weight" value="72" unit="kg" type="weight" />
                </div>
                <BMICard />
            </section>
            <ActivityGrowthCard />
        </div>
    );
};

function App() {
    const [activePage, setActivePage] = useState('dashboard');
    const handleNavClick = (pageId) => setActivePage(pageId);

    return (
        <div className="app-container">
            <Sidebar activePage={activePage} onNavClick={handleNavClick} />
            <MainContent />
        </div>
    );
}

// Render App
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);