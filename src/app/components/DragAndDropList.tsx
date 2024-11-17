import { DndContext, DragEndEvent, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { SortableItem } from "./TodoList/SortableItem";
import TodoItem from "./TodoList/TodoItem";
import { Task } from "../models/Task";

interface DragAndDropListProps {
  todos: Task[];
  filteredTodos: Task[];
  animatingTodos: { [id: number]: boolean };
  selectedTodos: Set<number>;
  onToggle: (id: number) => void;
  onSelect: (id: number, checked: boolean) => void;
  onReorder: (newOrder: Task[]) => void;
}

const DragAndDropList: React.FC<DragAndDropListProps> = ({
  todos,
  filteredTodos,
  animatingTodos,
  selectedTodos,
  onToggle,
  onSelect,
  onReorder,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = todos.findIndex((item) => item.id === active.id);
      const newIndex = todos.findIndex((item) => item.id === over?.id);

      const newOrder = arrayMove(todos, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      <ul className="space-y-4 w-full max-h-[45vh] overflow-y-auto">
        <SortableContext items={filteredTodos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
          {filteredTodos.map((todo) => (
            <div className="flex items-center w-full" key={todo.id}>
              <input
                type="checkbox"
                checked={selectedTodos.has(todo.id)}
                onChange={(e) => onSelect(todo.id, e.target.checked)}
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
                    <TodoItem todo={todo} onToggle={() => onToggle(todo.id)} />
                  </li>
                </SortableItem>
              </div>
            </div>
          ))}
        </SortableContext>
      </ul>
    </DndContext>
  );
};

export default DragAndDropList;
