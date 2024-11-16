"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Find a task"
        value={search}
        onChange={handleChange}
        className="border rounded px-4 py-2 w-full mb-4 pl-10"
      />
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
    </div>
  );
};

export default SearchInput;
