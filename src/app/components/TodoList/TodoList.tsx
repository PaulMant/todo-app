import { ConfirmDeleteDialog } from "../../dialogs/ConfirmDelete";
import { useEffect, useState } from "react";
import { useTodoContext } from "../../context/TodoContext";
import { Button } from "../ui/button";
import DeleteAllButton from "./DeleteAllButton";
import TodoItem from "./TodoItem";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { RotateCcw } from "lucide-react";
import { CircleCheckBig } from "lucide-react";
import { Trash2 } from "lucide-react";

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

  const handleDelete = (id: number) => {
    setTimeout(() => {
      deleteTodo(id);
      toast.success("Task deleted successfully!", {
        position: "bottom-right",
        autoClose: 2800,
      });
    }, 700);
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
          {filteredTodos.map((todo) => (
            <div key={todo.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTodos.has(todo.id)}
                onChange={(e) => handleSelect(todo.id, e.target.checked)}
                className="mr-4"
              />

              <li
                className={`flex w-full h-14 justify-start rounded-lg items-center px-4 border transition-all ${
                  todo.completed ? "text-gray-500" : ""
                } ${animatingTodos[todo.id] ? "translate-y-4 opacity-50 duration-300" : "hover:shadow-lg"}`}>
                {todo.completed ? (
                  <TodoItem todo={todo} />
                ) : (
                  <div className="w-full">
                    <SortableContext items={filteredTodos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
                      <SortableItem key={todo.id} id={todo.id}>
                        <TodoItem todo={todo} />
                      </SortableItem>
                    </SortableContext>
                  </div>
                )}
                <div className="flex gap-2 w-24">
                  <Button
                    onClick={() => handleToggle(todo.id)}
                    variant={todo.completed ? "outline" : "ghost"}
                    className="hover:scale-110 transition-transform bg-transparent border-none"
                    title={todo.completed ? "Mark as incomplete" : "Mark as complete"}>
                    {todo.completed ? (
                      <RotateCcw className="size-4 bg-transparent text-seedext" />
                    ) : (
                      <CircleCheckBig className="size-4 text-seedext" />
                    )}
                  </Button>
                  <ConfirmDeleteDialog
                    buttonText={
                      <Button variant="ghost" className="hover:scale-110 transition-transform" title="Delete task">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    }
                    title="Are you 100% sure?"
                    description={`This action will permanently delete ${todo.task}.`}
                    onDelete={() => handleDelete(todo.id)}
                  />
                </div>
              </li>
            </div>
          ))}
        </ul>
      </DndContext>
    </div>
  );
};

export default TodoList;
