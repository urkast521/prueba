

export default function TabDashboard({children, onHandleClick, tabName, activeTab}){


    return (
        <button
          onClick={() => onHandleClick(tabName)}
          className={`mx-0 px-5 py-2 rounded ${
            activeTab === tabName ? "bg-white  rounded-t-3xl rounded-b-none textColor2" : "bg-gray-400 text-gray-100 rounded-t-3xl rounded-b-none"
          }`}
        >
          {children}
        </button>
    );
}

/*


*/