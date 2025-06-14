const { useState, useEffect, useMemo } = React;


const WORKOUT_DATA = [
    {
        id: 1,
        title: "Morning Yoga",
        duration: "50 min",
        category: "Mindfulness",
        image: "images/Morningyoga.png" // Assuming Morningyoga.png exists
    },
    {
        id: 2,
        title: "Full Body Stretch",
        duration: "30 min",
        category: "Strength",
        image: "images/Fullbodystrecth.png" // You need to provide this image
    },
    {
        id: 3,
        title: "HIIT",
        duration: "20 min",
        category: "Cardio",
        image: "images/HIIT.png" // You need to provide this image
    },
    {
        id: 4,
        title: "Dumbbell Workout",
        duration: "45 min",
        category: "Strength",
        image: "images/Dumbellworkout.png" // You need to provide this image
    },
    {
        id: 5,
        title: "Cardio Blast",
        duration: "30 min",
        category: "Cardio",
        image: "images/Cardioblast.png" // You need to provide this image
    },
    {
        id: 6,
        title: "Core Crusher",
        duration: "20 min",
        category: "Strength",
        image: "images/CoreCrasher.png" // You need to provide this image
    },
    {
        id: 7,
        title: "Lower Body Workout",
        duration: "40 min",
        category: "Strength",
        image: "images/Lowbodyworkout.png" // You need to provide this image
    },
    {
        id: 8,
        title: "Meditation",
        duration: "15 min",
        category: "Mindfulness",
        image: "images/Meditation.png" // You need to provide this image
    },
    {
        id: 9,
        title: "Evening Unwind",
        duration: "25 min",
        category: "Mindfulness",
        image: "images/Eveningunwind.png" // You need to provide this image
    },
    {
        id: 10,
        title: "Jump Rope Fun",
        duration: "15 min",
        category: "Cardio",
        image: "images/Jumpropefun.png" // You need to provide this image
    }
];

const CATEGORIES = ["All", "Strength", "Cardio", "Mindfulness"];

// --- Icon Components (simple SVGs from Heroicons) ---
const IconGrid = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);
const IconCalendar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
    </svg>
);
const IconChat = () => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443h2.284M1.946 9.315c0-1.605 1.123-2.995 2.707-3.228C5.74 5.926 6.838 5.803 7.946 5.72V3.5L12.022 7.57a1.526 1.526 0 001.037.443h2.284c1.584 0 2.707 1.215 2.707 2.707v3.228M1.946 9.315C1.566 9.424 1.5 9.623 1.5 9.843v3.916c0 .22.066.419.446.528C2.632 14.541 3.5 14.723 3.5 15V9.315zM21 15V9.843c0-.22-.066-.419-.446-.528C19.868 9.19 19 9.007 19 8.565v6.435c0 .44.868.622 1.554.528.38-.109.446-.308.446-.528z" />
    </svg>
);
const IconClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IconSettings = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 1.655c-.007.379.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-1.655c.007-.379-.137-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const IconLogout = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);
const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

// --- Sidebar Component ---
const Sidebar = ({ activeIcon, onIconClick }) => {
    const sidebarItems = [
        { id: 'dashboard', icon: <IconGrid /> },
        { id: 'calendar', icon: <IconCalendar /> },
        { id: 'chat', icon: <IconChat /> },
        { id: 'clock', icon: <IconClock /> },
        { id: 'settings', icon: <IconSettings /> },
        { id: 'logout', icon: <IconLogout /> }
    ];

    return (
        <nav className="sidebar">
            {sidebarItems.map(item => (
                <div
                    key={item.id}
                    className={`sidebar-item ${activeIcon === item.id ? 'active' : ''}`}
                    onClick={() => onIconClick(item.id)}
                    title={item.id.charAt(0).toUpperCase() + item.id.slice(1)}
                >
                    {item.icon}
                </div>
            ))}
        </nav>
    );
};

// --- Workout Card Component ---
const WorkoutCard = ({ workout }) => {
    return (
        <div className="workout-card">
            <img src={workout.image} alt={workout.title} />
            <div className="card-info">
                <h3>{workout.title}</h3>
                <p>{workout.duration}</p>
            </div>
        </div>
    );
};

// --- Main Content Component ---
const MainContent = ({ workouts, activeCategory, onCategoryChange, searchTerm, onSearchChange }) => {
    return (
        <main className="main-content">
            <header className="main-header">
                <h1>Workout Browser</h1>
                <div className="search-container">
                    <IconSearch />
                    <input
                        type="text"
                        placeholder="Search workouts"
                        value={searchTerm}
                        onChange={onSearchChange}
                    />
                </div>
                <button className="filters-button">Filters</button>
            </header>

            <section className="categories">
                {CATEGORIES.map(category => (
                    <span
                        key={category}
                        className={`category-item ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => onCategoryChange(category)}
                    >
                        {category}
                    </span>
                ))}
            </section>

            <section className="workout-grid">
                {workouts.length > 0 ? (
                    workouts.map(workout => <WorkoutCard key={workout.id} workout={workout} />)
                ) : (
                    <p>No workouts found matching your criteria.</p>
                )}
            </section>
        </main>
    );
};


// --- App Component (Main Application) ---
function App() {
    const [activeSidebarIcon, setActiveSidebarIcon] = useState('dashboard');
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const handleIconClick = (iconId) => {
        setActiveSidebarIcon(iconId);
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredWorkouts = useMemo(() => {
        return WORKOUT_DATA.filter(workout => {
            const matchesCategory = activeCategory === 'All' || workout.category === activeCategory;
            const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchTerm]);

    return (
        <div className="app-container">
            <Sidebar activeIcon={activeSidebarIcon} onIconClick={handleIconClick} />
            <MainContent
                workouts={filteredWorkouts}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />
        </div>
    );
}

// Render the App component into the 'root' div
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);