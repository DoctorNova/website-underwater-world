import { useI18n } from "@game/App/Hooks/useI18n";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";

export interface FilterDropDownProps {
  placeholder: string;
  items: string[];
  onFiltered: (text: string, filteredList: string[]) => void;
}

export function FilterDropDown({placeholder, items, onFiltered}: FilterDropDownProps) {
  const { t } = useI18n();
  const [filterText, setFilterText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const matchingItems = useMemo(() => {
    if (!filterText.trim()) {
      return items;
    }

    return items.filter((value) => value.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()));
  }, [filterText, items]);

  const handleInputChange = useCallback((e: Event) => {
    setFilterText((e.target as HTMLInputElement)?.value || '')
    setShowDropdown(true);
  }, []);

  const handleClearFilter = useCallback(() => {
    setFilterText('');
    setShowDropdown(false);
  }, []);

  const handleItemSelect = useCallback((item: string) => {
    setFilterText(item);
    setShowDropdown(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    onFiltered(filterText, matchingItems);
  }, [matchingItems]);

  return (
    <div className="relative mb-8" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300 z-10" />
          <input
            type="text"
            value={filterText}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            placeholder={t(placeholder)}
            className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent placeholder-blue-300/60 transition-all"
          />
          {filterText && (
            <button
              onClick={handleClearFilter}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dropdown with matching technologies */}
        {showDropdown && matchingItems.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-[#0a1929]/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {matchingItems.map((item) => (
              <button
                key={item}
                onClick={() => handleItemSelect(item)}
                className="w-full px-4 py-3 text-left text-white hover:bg-[#ff6b35]/20 transition-colors border-b border-white/10 last:border-b-0"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
  );
}