import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CollapsibleSidebar = ({ children, onToggle }) => {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    onToggle(isOpen)
  }, [isOpen, onToggle])

  return (
    <div className={`relative transition-all duration-300 ease-in-out ${isOpen ? "w-full lg:w-1/4" : "w-0"}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-8 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-l-md z-10 shadow-md hover:bg-blue-700 transition-colors duration-200"
      >
        {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </button>
      <div className={`h-full overflow-y-auto ${isOpen ? "opacity-100" : "opacity-0"}`}>{children}</div>
    </div>
  )
}

export default CollapsibleSidebar

