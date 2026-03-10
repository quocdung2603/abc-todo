import React, { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Calendar,
  CheckCircle2,
  Circle,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import api from "@/lib/axios";

const TaskCard = ({ task, index, handleTaskChanged }) => {
  const [isEditting, setIsEditting] = useState(false);
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState(task.title || "");

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Xóa nhiệm vụ thành công");
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi xóa task", error);
      toast.error("Lỗi xảy ra khi xóa task");
    }
  };

  const updateTask = async (taskId) => {
    try {
      setIsEditting(false);
      await api.put(`/tasks/${taskId}`, {
        title: updatedTaskTitle,
      });
      toast.success(`Nhiệm vụ đã thay đổi thành ${updatedTaskTitle}`);
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi cập nhật task", error);
      toast.error("Lỗi xảy ra khi cập nhật task");
    }
  };

  const toggleTaskCompleteButton = async (taskId) => {
    try {
      if (task.status === "active") {
        await api.put(`/tasks/${taskId}`, {
          status: "completed",
          completedAt: new Date().toISOString(),
        });
        toast.success(`Task: ${task.title} đã được đánh dấu là hoàn thành.`);
      } else {
        await api.put(`/tasks/${task._id}`, {
          status: "active",
          completedAt: null,
        });

        toast.success(
          `Task: ${task.title} đã được đánh dấu là chưa hoàn thành.`,
        );
      }
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi cập nhật task", error);
      toast.error("Lỗi xảy ra khi cập nhật task");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      updateTask(task._id);
    }
  };

  return (
    <Card
      className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === "completed" && "opacity-50",
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className=" flex items-center gap 4">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "flex-shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === "completed"
              ? "text-success hover:text-success/80"
              : "text-muted-foreground hover:text-primary",
          )}
          onClick={() => toggleTaskCompleteButton(task._id)}
        >
          {task.status === "completed" ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          {isEditting ? (
            <Input
              placeholder="Cần phải làm gì?"
              className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
              type="text"
              value={updatedTaskTitle}
              onChange={(e) => setUpdatedTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                setIsEditting(false);
                setUpdatedTaskTitle(task.title || "");
              }}
            />
          ) : (
            <p
              className={cn(
                "text-base transition-all duration-200",
                task.status === "completed"
                  ? "line-through text-muted-foreground"
                  : "text-foreground",
              )}
            >
              {task.title}
            </p>
          )}

          {/* ngày tạo & ngày hoàn thành */}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleString()}
            </span>
            {task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(task.completedAt).toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          <Button
            variant="ghost"
            size="icon"
            className="flex shirnk-0 transition-colors size-8 text-muted-foreground hover:text-info"
            onClick={() => {
              setIsEditting(true);
              setUpdatedTaskTitle(task.title || "");
            }}
          >
            <SquarePen className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex shirnk-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteTask(task._id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
