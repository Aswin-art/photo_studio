"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteHoliday } from "@/actions/holidayAction";
import HolidayDialog from "../holiday/HolidayDialog";

interface CellActionProps {
  data: User;
  updatePath?: string;
  refreshHolidays: () => void;
}

export const CellAction: React.FC<CellActionProps> = ({ data, updatePath = "/dashboard/user", refreshHolidays }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const onConfirm = async (id) => {
    setLoading(true);
    try {
      await deleteHoliday(id);
      setOpen(false);
      toast({
        title: "Success",
        type: "foreground"
      });
      refreshHolidays();
    } catch {
      toast({
        title: "Error",
        type: "background"
      });
    }
    setLoading(false);
  };

  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={() => onConfirm(data.id)}
            >
              {loading ? "Loading..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <HolidayDialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        holidayData={data} 
        refreshHolidays={refreshHolidays}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {updatePath === '/dashboard/user' && 
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/user/${data.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
          }
          {updatePath === '/dashboard/holiday' && 
            <>
              <DropdownMenuItem
                onClick={() => setIsDialogOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" /> Update
              </DropdownMenuItem>
            </>
          }
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
