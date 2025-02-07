import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "../ui/dialog";
import { updateVoucher } from "@/actions/voucher"; 
import { useToast } from "@/hooks/use-toast";

interface VoucherFormProps {
  voucherData: any; 
  onClose: () => void;
  refreshVouchers: () => void;
}

const VoucherForm: React.FC<VoucherFormProps> = ({ voucherData, onClose, refreshVouchers }) => {
    const [name, setName] = useState(voucherData?.name || "");
    const [discount, setDiscount] = useState(voucherData?.discount || "");
    const [count, setCount] = useState(voucherData?.count || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        try {
            await updateVoucher(voucherData.id, {
                name,
                discount: Number(String(discount).replace(",", ".")),
                count: Number(count),
            });
            
            toast({
                title: "Berhasil",
                description: "Voucher berhasil diperbarui",
                type: "foreground",
            });
            const [errorMessage, setErrorMessage] = useState("");
            refreshVouchers();
            onClose();
        } catch (error: any) {
            if (error.message.includes("Voucher dengan nama ini sudah ada.")) {
                setErrorMessage("Voucher dengan nama ini sudah ada. Gunakan nama lain.");
              }else{
                console.error("Error saat membuat voucher:", error.message);
                toast({
                  title: "Terjadi Kesalahan",
                  description: "Gagal membuat voucher. Silakan coba lagi.",
                  type: "background",
                });
              }
        } finally {
            setIsSubmitting(false);
        }
    };    

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Nama / Kode
                </Label>
                <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrorMessage("");
                    }}
                    placeholder={`Nama / Kode Voucher`}
                    className="col-span-3"
                    required
                />
                {errorMessage && (
                    <p className="text-red-500 text-sm mt-1 col-span-4">{errorMessage}</p>
                )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discount" className="text-right">
                    Diskon
                </Label>
                <div className="flex items-center gap-2 col-span-3">
                    <Input
                    id="discount"
                    name="discount"
                    value={discount}
                    onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value <= 100) {
                        setDiscount(e.target.value);
                        }
                    }}
                    min={0}
                    step={0.1}
                    placeholder={`Persentase Diskon`}
                    className="col-span-3"
                    type="number"
                    required
                    />
                    <Label htmlFor="discount" className="text-center p-[10px] border border-gray-200 rounded-md">
                    %
                    </Label>
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Jumlah Voucher
                </Label>
                <Input
                    id="count"
                    name="count"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    placeholder={`Jumlah Voucher`}
                    className="col-span-3"
                    type="number"
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

export default VoucherForm;