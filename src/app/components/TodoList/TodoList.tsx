import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTodoContext } from "../../context/TodoContext";
import { ConfirmDeleteDialog } from "../../dialogs/ConfirmDelete";
import { Button } from "../ui/button";
import DeleteAllButton from "./DeleteAllButton";
import TodoItem from "./TodoItem";

import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

interface TodoListProps {
  search: string;
}

const TodoList: React.FC<TodoListProps> = ({ search }) => {
  const { todos, toggleTodo, deleteTodo, reorderTodos } = useTodoContext();
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());
  const [animatingTodos, setAnimatingTodos] = useState<{ [id: number]: boolean }>({});
  const [orderedTodos, setOrderedTodos] = useState(todos);

  useEffect(() => {
    setOrderedTodos(todos);
  }, [todos]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTodos = orderedTodos
    .filter((todo) => todo.task.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = orderedTodos.findIndex((item) => item.id === active.id);
      const newIndex = orderedTodos.findIndex((item) => item.id === over?.id);

      const newOrder = arrayMove(orderedTodos, oldIndex, newIndex);
      setOrderedTodos(newOrder);
      reorderTodos(newOrder);
    }
  };

  const handleToggle = (id: number) => {
    setAnimatingTodos((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      toggleTodo(id);
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

  const handleBatchDelete = () => {
    selectedTodos.forEach((id) => deleteTodo(id));
    setSelectedTodos(new Set());
    toast.success("Tasks deleted successfully!", {
      position: "bottom-right",
      autoClose: 3500,
    });
  };

  if (todos.length === 0) {
    return (
      <div>
        <p className="text-center text-lg text-gray-500">You have no task yet. Start adding tasks using the input above!</p>
      </div>
    );
  }

  if (filteredTodos.length === 0) {
    return (
      <div>
        <p className="text-center text-lg text-gray-500">No tasks match your current filter.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        {selectedTodos.size > 0 && (
          <ConfirmDeleteDialog
            buttonText={
              <Button variant="outline" className="border-destructive hover:scale-110 transition-transform" title="Delete task">
                <span className="text-destructive">Delete Selected</span>
              </Button>
            }
            title="Are you 100% sure?"
            description={`This action will permanently delete ${selectedTodos.size} task(s).`}
            onDelete={handleBatchDelete}
          />
        )}
        <DeleteAllButton />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
        <ul className="space-y-4 w-full max-h-[45vh] overflow-y-auto">
          <SortableContext items={filteredTodos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
            {filteredTodos.map((todo) => (
              <div className="flex items-center w-full" key={todo.id}>
                <input
                  type="checkbox"
                  checked={selectedTodos.has(todo.id)}
                  onChange={(e) => handleSelect(todo.id, e.target.checked)}
                  className="mr-4"
                />
                <div className="w-full">
                  <SortableItem key={todo.id} id={todo.id}>
                    <li
                      className={`flex w-full h-14 rounded-lg items-center px-4 border transition-all duration-300 ${
                        todo.completed ? "text-gray-500" : ""
                      }
                      ${animatingTodos[todo.id] ? "translate-y-2 opacity-50" : ""} 
                      ${selectedTodos.has(todo.id) ? "border-seedext" : "border-gray-300"} hover:shadow-lg`}>
                      <TodoItem todo={todo} onToggle={() => handleToggle(todo.id)} />
                    </li>
                  </SortableItem>
                </div>
              </div>
            ))}
          </SortableContext>
        </ul>
      </DndContext>
    </div>
  );
};

export default TodoList;
