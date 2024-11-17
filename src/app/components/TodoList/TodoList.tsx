import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BatchActions from "./BatchActions";
import EmptyState from "../EmptyState";
import DragAndDropList from "../DragAndDropList";
import { Task } from "../../models/Task";
import { useTodoService } from "../../context/TodoContext";

interface TodoListProps {
  search: string;
}

const TodoList: React.FC<TodoListProps> = ({ search }) => {
  const todoService = useTodoService();

  const [todos, setTodos] = useState<Task[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());
  const [animatingTodos, setAnimatingTodos] = useState<{ [id: number]: boolean }>({});
  const [orderedTodos, setOrderedTodos] = useState<Task[]>([]);

  useEffect(() => {
    todoService.getTodos().then(setTodos);
    const unsubscribe = todoService.subscribe(setTodos);

    return () => unsubscribe();
  }, [todoService]);

  useEffect(() => {
    setOrderedTodos(todos);
  }, [todos]);

  const filteredTodos = orderedTodos
    .filter((todo) => todo.task.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

  const handleToggle = async (id: number) => {
    setAnimatingTodos((prev) => ({ ...prev, [id]: true }));
    setTimeout(async () => {
      const updatedTodo = await todoService.updateTodo(id, { completed: !todos.find((todo) => todo.id === id)?.completed });
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setAnimatingTodos((prev) => ({ ...prev, [id]: false }));
    }, 300);
  };

  const handleSelect = (id: number, checked: boolean) => {
    setSelectedTodos((prev) => {
      const updated = new Set(prev);
      if (checked) {
        updated.add(id);
      } else {
        updated.delete(id);
      }
      return updated;
    });
  };

  const handleBatchDelete = async () => {
    const idsToDelete = Array.from(selectedTodos);
    await Promise.all(idsToDelete.map((id) => todoService.deleteTodo(id)));
    setTodos((prev) => prev.filter((todo) => !selectedTodos.has(todo.id)));
    setSelectedTodos(new Set());
    toast.success("Tasks deleted successfully!", {
      position: "bottom-right",
      autoClose: 3500,
    });
  };

  const handleReorder = async (newOrder: Task[]) => {
    setOrderedTodos(newOrder);
    await Promise.all(newOrder.map((todo, index) => todoService.updateTodo(todo.id, { order: index })));
  };

  if (todos.length === 0) {
    return <EmptyState message="You have no task yet. Start adding tasks using the input above!" />;
  }

  if (filteredTodos.length === 0) {
    return <EmptyState message="No tasks match your current filter." />;
  }

  return (
    <div>
      <BatchActions selectedTodosCount={selectedTodos.size} onBatchDelete={handleBatchDelete} />
      <DragAndDropList
        todos={orderedTodos}
        filteredTodos={filteredTodos}
        animatingTodos={animatingTodos}
        selectedTodos={selectedTodos}
        onToggle={handleToggle}
        onSelect={handleSelect}
        onReorder={handleReorder}
      />
    </div>
  );
};

export default TodoList;
