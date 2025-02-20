/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import HolidayForm from "./HolidayForm";

interface HolidayDialogProps {
  open: boolean;
  onClose: () => void;
  holidayData: any;
  refreshHolidays: () => void;
}

const HolidayDialog: React.FC<HolidayDialogProps> = ({
  open,
  onClose,
  holidayData,
  refreshHolidays
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Holiday</DialogTitle>
        </DialogHeader>
        <HolidayForm
          holidayData={holidayData}
          onClose={onClose}
          refreshHolidays={refreshHolidays}
        />
      </DialogContent>
    </Dialog>
  );
};

export default HolidayDialog;
