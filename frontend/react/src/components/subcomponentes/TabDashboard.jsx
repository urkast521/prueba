

export default function TabDashboard({children, onHandleClick, tabName, activeTab}){


    return (
        <button
          onClick={() => onHandleClick(tabName)}
          className={`px-4 py-2 rounded ${
            activeTab === tabName ? "bg-blue-500 text-white" : "bg-blue-300"
          }`}
        >
          {children}
        </button>
    );
}

/*


*/