"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTodoContext } from "../../context/TodoContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form } from "../ui/form";
import { Plus } from "lucide-react";

const taskSchema = z.object({
  task: z.string(),
});

const CreateTodoForm: React.FC = () => {
  const { addTodo } = useTodoContext();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      task: "",
    },
  });

  const handleAdd = (data: z.infer<typeof taskSchema>) => {
    if (data.task.trim()) {
      addTodo(data.task);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAdd)} className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input className="border rounded px-4 py-2 w-full pl-10" type="text" placeholder="Add a new task" {...form.register("task")} />
          <Plus className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>

        <Button type="submit" variant="outline" className="bg-white text-seedext border-seedext">
          Add Task
        </Button>
      </form>
    </Form>
  );
};

export default CreateTodoForm;
