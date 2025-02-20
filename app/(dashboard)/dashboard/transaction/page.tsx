'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { getTransactions } from "@/actions/bookingAction";
import { Transaction } from "@/types";
import { useTransactionContext } from "@/components/transaction/TransactionContext";
import dynamic from "next/dynamic";
const ListTransaction = dynamic(() => import('@/components/transaction/ListTransaction'), { ssr: false })
// import ListTransaction from "@/components/transaction/ListTransaction";

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { triggerRefresh } = useTransactionContext();
 
  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
      console.log(data)
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTransactions = async () => {
    setIsLoading(true);
    await fetchTransactions();
  };

  useEffect(() => {
    refreshTransactions();
  }, [triggerRefresh]);

  // useEffect(() => {
  //   fetchTransactions();
  // }, []);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">PhotoStudio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Transaksi Customer</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-semibold">Transaksi Customer</h1>
        </div>
          <ListTransaction transaction={transactions} setTransaction={setTransactions} isLoading={isLoading} refreshTransactions={refreshTransactions}/>
      </div>
    </>
  );
}
