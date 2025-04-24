import { formatRupiah } from "@/utils/Rupiah";
import { AddonColorCardProps } from "@/types";
import { Checkbox } from "@/components/ui/checkbox"

export default function AddonColorCard({
  title,
  price,
  colorHex,
  isSelected,
  onSelected
}: AddonColorCardProps) {
  return (
    <div className={`flex gap-2 justify-between items-center rounded-md border p-4 ${
        isSelected ? "border-gray-950" : "border-gray-300"
      }`} onClick={() => onSelected(!isSelected)}>
      <div className="flex flex-col gap-2">
        <p className="text-gray-800 text-sm">{title}</p>
        <p className="text-gray-800 text-sm">Rp{formatRupiah(price)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <div
          className={`w-6 h-6 rounded-full border border-gray-300`}
          style={{ backgroundColor: colorHex }}
        ></div>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelected}
        />
      </div>
    </div>
  );
}
