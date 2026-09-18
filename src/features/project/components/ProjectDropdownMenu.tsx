import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Loader, Loader2, Pen, Trash } from "lucide-react";

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
import { api } from "@/lib/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ProjectDropdownMenu({ id }: { id: string }) {
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
          <DropdownMenuItem>
            <Pen />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DeleteProjectDialog id={id} />
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
