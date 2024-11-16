"use client";

import { useState } from "react";
import CreateTodoForm from "./components/TodoList/CreateTodoForm";
import TodoList from "./components/TodoList/TodoList";
import SearchInput from "./components/ui/searchInput";

export default function Home() {
  const [search, setSearch] = useState("");

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  return (
    <div className="min-h-screen w-full h-full flex flex-col items-center bg-gray-50 p-4">
      <h1 className="text-2xl text-seedext font-bold mb-8">My Task Management App</h1>
      <main className="w-full max-w-lg space-y-6">
        <CreateTodoForm />
        <SearchInput onSearch={handleSearch} />

        <TodoList search={search} />
      </main>
    </div>
  );
}
