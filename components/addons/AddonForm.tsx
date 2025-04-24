/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { parseRupiah, formatRupiah } from "@/utils/Rupiah";
import { updateAddon } from "@/actions/addonAction";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddonFormProps {
  addonData: any;
  onClose: () => void;
  refreshAddons: () => void;
}

const AddonForm: React.FC<AddonFormProps> = ({
  addonData,
  onClose,
  refreshAddons
}) => {
  const [name, setName] = useState(addonData?.name || "");
  const [isBackground, setIsBackground] = useState(addonData?.isBackground || false);
  const [colorHex, setColorHex] = useState(addonData?.colorHex || "");
  const [price, setPrice] = useState(
    formatRupiah(addonData.price.toString()) || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setPrice(formatRupiah(rawValue));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexValue = e.target.value.replace(/[^0-9A-Fa-f]/g, "");
    setColorHex(hexValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateAddon(addonData.id, {
        name,
        price: parseRupiah(price),
        isBackground,
        colorHex: isBackground ? "#" + colorHex : null
      });

      toast({
        title: "Berhasil",
        description: "Addon berhasil diperbarui",
        type: "foreground"
      });

      refreshAddons();
      onClose();
      console.log("close dialog try-catch");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        type: "background"
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
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Apakah Custom Background?</Label>
        <RadioGroup
          defaultValue={isBackground ? "true" : "false"}
          onValueChange={(value) => setIsBackground(value === "true")}
          className="col-span-3 flex gap-4"
        >
          <div className="flex gap-x-2">
            <Label htmlFor="yes" className="mr-2">Ya</Label>
            <RadioGroupItem value="true" id="yes" />
            <Label htmlFor="no" className="mr-2">Tidak</Label>
            <RadioGroupItem value="false" id="no" />
          </div>
        </RadioGroup>
      </div>

      {isBackground && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="colorHex" className="text-right">
            Kode Heksa
          </Label>
          <div className="flex items-center gap-1 col-span-3 border border-gray-200 rounded-md shadow-sm">
            <Label
              htmlFor="colorHex"
              className="text-center p-[10px] border-r border-gray-200"
            >
              #
            </Label>
            <Input
              id="colorHex"
              name="colorHex"
              value={colorHex}
              onChange={handleColorChange}
              placeholder={`000000`}
              className="col-span-3 border-0 shadow-none"
              minLength={3}
              maxLength={6}
              required
            />
          </div>
        </div>
      )}
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddonForm;
