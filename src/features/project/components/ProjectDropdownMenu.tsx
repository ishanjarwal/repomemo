import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Loader2, Pen, Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function ProjectDropdownMenu({
  project,
}: {
  project: { name: string; id: string };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"icon-lg"}>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <EditProjectDialog id={project.id} projectName={project.name} />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DeleteProjectDialog id={project.id} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const DeleteProjectDialog = ({ id }: { id: string }) => {
  const router = useRouter();
  const deleteMutation = api.project.deleteProject.useMutation();
  const useUtils = api.useUtils();
  const toastId = `delete-project-toast-${id}`;
  const onDelete = () => {
    toast.loading("Deleting . . .", { id: toastId });
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Project Deleted", { id: toastId });
          useUtils.project.getProjects.invalidate();
          router.push("/dashboard");
        },
        onError(error) {
          toast.error(error.message);
        },
      },
    );
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full justify-start">
          <Trash />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            project from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteMutation.isPending}
            onClick={onDelete}
            variant={"destructive"}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Deleting
              </>
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const EditProjectDialog = ({
  id,
  projectName,
}: {
  id: string;
  projectName: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const formSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, "Project name is required")
      .max(100, "Project name must be less than 100 characters"),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: projectName,
    },
  });

  const apiUtils = api.useUtils();

  const editMutation = api.project.editProject.useMutation({
    onSuccess() {
      toast.success("Project name changed");
      apiUtils.project.getProjects.refetch();
      apiUtils.project.getProject.refetch();
    },
    onError(error) {
      toast.error(error.message);
    },
    onSettled() {
      setOpen(false);
    },
  });

  const handleSubmit = async (values: FormValues) => {
    editMutation.mutate({ id, name: values.name });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          form.reset({ name: projectName });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Pen />
          Edit Project
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>
            Change the name of your project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-edit-form-title">
                    Project Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="project-edit-form-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Set your project name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={editMutation.isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={editMutation.isPending}>
              {editMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Saving</span>
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
