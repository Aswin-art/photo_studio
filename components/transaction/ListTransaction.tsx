"use client";

import DataTable from "../tables/data-table";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { TransactionColumns } from "./table/TransactionColumns";
import { Transaction } from "@/types";
import { getStudios } from "@/actions/studioAction";
import { getTransactionsByFilter } from "@/actions/bookingAction";
import { Studio } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ListTransactionProps {
  transaction: Transaction[];
  setTransaction: React.Dispatch<React.SetStateAction<Transaction[]>>;
  isLoading: boolean;
  refreshTransactions: () => void;
}

export default function ListTransaction({
  transaction,
  setTransaction,
  isLoading,
  refreshTransactions
}: ListTransactionProps) {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null);
  const [selectedIsApproved, setSelectedIsApproved] = useState<
    boolean | null | string
  >("");
  const [isApproveValue, setIsApproveValue] = useState<string>("");

  const handleStudioChange = (studioId: string) => {
    setSelectedStudio(studioId || null);
  };

  const handleIsApprovedChange = (isApproved: string) => {
    setIsApproveValue(isApproved);

    if (isApproved === "1") {
      setSelectedIsApproved(true);
    } else if (isApproved === "0") {
      setSelectedIsApproved(false);
    } else if (isApproved === "null") {
      setSelectedIsApproved(null);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (
          selectedIsApproved === true ||
          selectedIsApproved === false ||
          selectedIsApproved === null
        ) {
          const data = await getTransactionsByFilter(
            selectedStudio ? Number(selectedStudio) : undefined,
            selectedIsApproved
          );
          setTransaction(data);
        } else if (selectedStudio) {
          const data = await getTransactionsByFilter(Number(selectedStudio));
          setTransaction(data);
        } else {
          await refreshTransactions();
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, [selectedIsApproved, selectedStudio]);

  const fetchStudios = async () => {
    try {
      const data = await getStudios();
      setStudios(data);
    } catch (error) {
      console.error("Failed to fetch studios:", error);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  return (
    <div>
      <div className={`flex gap-4 items-center`}>
        <Button
          onClick={refreshTransactions}
          variant={`outline`}
          className={`py-5`}
        >
          Refresh Data
        </Button>
        <Select onValueChange={handleStudioChange} value={selectedStudio || ""}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter By Studio" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Studio</SelectLabel>
              {studios.map((studio) => (
                <SelectItem key={studio.id} value={studio.id.toString()}>
                  {studio.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={handleIsApprovedChange} value={isApproveValue}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Filter By Status Pembayaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status Pembayaran</SelectLabel>
              <SelectItem value="1">Di Terima</SelectItem>
              <SelectItem value="0">Di Tolak</SelectItem>
              <SelectItem value="null">Belum ada status</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {isLoading && <p>Loading...</p>}
      <DataTable
        columns={TransactionColumns(refreshTransactions)}
        data={transaction}
      />
    </div>
  );
}
