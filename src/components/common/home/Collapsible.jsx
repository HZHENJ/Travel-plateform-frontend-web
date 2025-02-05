import { useState } from "react";
import { ChevronUp, ChevronDown } from "../Icons";

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <button
        className="w-full px-6 py-4 text-left font-bold text-xl flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isOpen && <div className="px-6 pb-4">{children}</div>}
    </div>
  );
};

export default Collapsible;
