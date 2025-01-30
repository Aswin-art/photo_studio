import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VoucherForm from "./VoucherForm";

interface VoucherDialogProps {
  open: boolean;
  onClose: () => void;
  voucherData: any;
  refreshVouchers: () => void;
}

const VoucherDialog: React.FC<VoucherDialogProps> = ({ open, onClose, voucherData, refreshVouchers }) => {

  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Voucher</DialogTitle>
        </DialogHeader>
        <VoucherForm voucherData={voucherData} onClose={onClose} refreshVouchers={refreshVouchers} />
      </DialogContent>
    </Dialog>
  );
};

export default VoucherDialog;
