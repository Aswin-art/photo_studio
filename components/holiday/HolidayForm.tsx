import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
  } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DialogFooter } from "../ui/dialog";
import { updateHoliday } from "@/actions/holidayAction";
import { useToast } from "@/hooks/use-toast";

interface HolidayFormProps {
  holidayData: any; // Sesuaikan dengan tipe data
  onClose: () => void;
  refreshHolidays: () => void;
}

const HolidayForm: React.FC<HolidayFormProps> = ({ holidayData, onClose, refreshHolidays }) => {
    const [name, setName] = useState(holidayData?.description || "");
    const [date, setDate] = useState(holidayData?.date || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await updateHoliday(holidayData.id, { date, description: name });
            toast({
                title: "Success",
                type: "foreground"
              });
            refreshHolidays();
        } catch (error) {
            toast({
                title: "Error",
                type: "background"
            });
            throw new Error(`failed to create holiday: ${error}`);
        } finally {
            setIsSubmitting(false);
        }
        
        console.log("Update Holiday:", { name, date });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                Tanggal
                </Label>
                <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                    {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    />
                </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                Deskripsi
                </Label>
                <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Deskripsi libur`}
                className="col-span-3"
                required
                />
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
            </DialogFooter>
        </form>
    );
};

export default HolidayForm;