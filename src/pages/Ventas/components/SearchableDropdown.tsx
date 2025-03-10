import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

interface SearchableDropdownProps {
  items: Array<{ id: number; nombre?: string; producto?: string }>;
  selectedItem: number;
  setSelectedItem: (id: number) => void;
  placeholder: string;
  disabled?: boolean;
}

export function SearchableDropdown({
  items,
  selectedItem,
  setSelectedItem,
  placeholder,
  disabled = false,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredItems = items.filter(
    (item) =>
      item.producto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center ${
          disabled ? "bg-gray-100" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span>
          {selectedItem
            ? items.find((i) => i.id === selectedItem)?.producto ||
              items.find((i) => i.id === selectedItem)?.nombre
            : placeholder}
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 ${disabled ? "text-gray-400" : "text-gray-600"}`}
        />
      </div>
      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <input
            type="text"
            className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center ${
                  selectedItem === item.id ? "bg-blue-100" : ""
                }`}
                onClick={() => {
                  setSelectedItem(item.id);
                  setIsOpen(false);
                }}
              >
                {item.nombre || item.producto}
                {selectedItem === item.id && (
                  <CheckIcon className="h-5 w-5 text-blue-500" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchableDropdown;
