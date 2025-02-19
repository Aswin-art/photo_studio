import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddonForm from "./AddonForm";

interface AddonDialogProps {
  open: boolean;
  onClose: () => void;
  addonData: any;
  refreshAddons: () => void;
}

const AddonDialog: React.FC<AddonDialogProps> = ({ open, onClose, addonData, refreshAddons }) => {

  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Addon</DialogTitle>
        </DialogHeader>
        <AddonForm addonData={addonData} onClose={onClose} refreshAddons={refreshAddons} />
      </DialogContent>
    </Dialog>
  );
};

export default AddonDialog;
