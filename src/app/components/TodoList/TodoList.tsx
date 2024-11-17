import { useCallback, useEffect, useState } from "react";
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
    const updateTodos = (fetchedTodos: Task[]) => {
      setTodos(fetchedTodos);
    };

    todoService.getTodos().then(updateTodos);
    const unsubscribe = todoService.subscribe(updateTodos);

    return () => unsubscribe();
  }, [todoService]);

  useEffect(() => {
    if (todos.length > orderedTodos.length) {
      const newTasks = todos.filter((todo) => !orderedTodos.some((orderedTodo) => orderedTodo.id === todo.id));
      setOrderedTodos((prev) => [...newTasks, ...prev]);
    }
  }, [todos, orderedTodos]);

  const filteredTodos = orderedTodos
    .filter((todo) => todo.task.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

  const handleToggle = useCallback(
    async (id: number) => {
      setAnimatingTodos((prev) => ({ ...prev, [id]: true }));
      const updatedTodo = await todoService.updateTodo(id, {
        completed: !todos.find((todo) => todo.id === id)?.completed,
      });
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setOrderedTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setAnimatingTodos((prev) => ({ ...prev, [id]: false }));
    },
    [todos, todoService]
  );

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

  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    setOrderedTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleBatchDelete = async () => {
    try {
      const idsToDelete = Array.from(selectedTodos);
      await todoService.deleteTodos(idsToDelete);
      setTodos((prev) => prev.filter((todo) => !selectedTodos.has(todo.id)));
      setOrderedTodos((prev) => prev.filter((todo) => !selectedTodos.has(todo.id)));
      setSelectedTodos(new Set());
      toast.success(`${idsToDelete.length} tasks deleted successfully!`, {
        position: "bottom-right",
        autoClose: 3500,
      });
    } catch (error) {
      console.error("Error deleting tasks:", error);
      toast.error("Error deleting tasks. Please try again", {
        position: "bottom-right",
        autoClose: 3500,
      });
    }
  };

  const handleDeleteAll = async () => {
    await todoService.deleteAllTodos();
    setTodos([]);
    setOrderedTodos([]);
    setSelectedTodos(new Set());
  };

  const handleReorder = async (newOrder: Task[]) => {
    setOrderedTodos(newOrder);
    await Promise.all(newOrder.map((todo, index) => todoService.updateTodo(todo.id, { order: index })));
    localStorage.setItem("todos", JSON.stringify(newOrder));
  };

  if (todos.length === 0) {
    return <EmptyState message="You have no task yet. Start adding tasks using the input above!" />;
  }

  if (filteredTodos.length === 0) {
    return <EmptyState message="No tasks match your current filter." />;
  }

  return (
    <div>
      <BatchActions selectedTodosCount={selectedTodos.size} onBatchDelete={handleBatchDelete} onDeleteAll={handleDeleteAll} />
      <DragAndDropList
        todos={orderedTodos}
        filteredTodos={filteredTodos}
        animatingTodos={animatingTodos}
        selectedTodos={selectedTodos}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onSelect={handleSelect}
        onReorder={handleReorder}
      />
    </div>
  );
};

export default TodoList;
