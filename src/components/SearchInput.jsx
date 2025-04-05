import { Search } from "lucide-react";
import React from "react";

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 pl-10 pr-12 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 !text-black"
      />
      <Search className="w-4 h-4 absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-900" />
    </div>
  );
}
