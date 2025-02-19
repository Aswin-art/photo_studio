import { useState } from 'react';
import InputCounter from '../inputCounterProps';
import { formatRupiah } from '@/utils/Rupiah';
import { AddonCardProps } from "@/types";

export default function AddonCard({
    id,
    title,
    price,
    quantity,
    onQuantityChange
}: AddonCardProps) {

  return (
      <div className='flex gap-2 justify-between items-center rounded-md border p-4'>
        <div className='flex flex-col gap-2'>
            <p className='text-gray-800 text-sm'>{title}</p>
            <p className='text-gray-800 text-sm'>Rp{formatRupiah(price)}</p>
        </div>
        <InputCounter 
            value={quantity}
            onChange={onQuantityChange}
            min={0}
            max={99}
        />
      </div>
  );
}