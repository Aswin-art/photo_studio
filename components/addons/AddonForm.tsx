import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { parseRupiah, formatRupiah } from "@/utils/Rupiah";
import { updateAddon } from "@/actions/addonAction";

interface AddonFormProps {
  addonData: any; 
  onClose: () => void;
  refreshAddons: () => void;
}

const AddonForm: React.FC<AddonFormProps> = ({ addonData, onClose, refreshAddons }) => {
    const [name, setName] = useState(addonData?.name || "");
    const [price, setPrice] = useState(formatRupiah(addonData.price.toString()) || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, "");
        setPrice(formatRupiah(rawValue));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        try {
            await updateAddon(addonData.id, {
                name, price: parseRupiah(price)
            });
            
            toast({
                title: "Berhasil",
                description: "Addon berhasil diperbarui",
                type: "foreground",
            });
    
            refreshAddons();
            onClose();
            console.log("close dialog try-catch")
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                type: "background",
            });
        } finally {
            setIsSubmitting(false);
        }
    };    

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Nama
                </Label>
                <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`Nama Layanan Tambahan`}
                    className="col-span-3"
                    required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Harga
                </Label>
                <Input
                  id="price"
                  name="price"
                  value={price}
                  onChange={handlePriceChange}
                  placeholder="Rp 0"
                  className="col-span-3"
                  required
                />
            </div>
            <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
            </DialogFooter>
        </form>
    );
};

export default AddonForm;