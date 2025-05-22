import { IoCalendar, IoCalendarOutline } from "react-icons/io5";

export default function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <span className="flex gap-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`px-4 py-2 border-b-2 cursor-pointer ${
            activeTab === tab.key
              ? "border-purple text-purple font-semibold"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => onTabChange(tab.key)}
        >
          <span className="flex items-center gap-2">
            {activeTab === tab.key ? <IoCalendar /> : <IoCalendarOutline />}
            {tab.label}
          </span>
        </button>
      ))}
    </span>
  );
}
