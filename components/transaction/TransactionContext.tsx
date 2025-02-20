/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { createContext, useContext, useState } from "react";

interface TransactionContextType {
  refreshTransactions: () => void;
  triggerRefresh: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactionContext harus digunakan di dalam TransactionProvider"
    );
  }
  return context;
};

export const TransactionProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => setRefreshFlag((prev) => !prev);

  const refreshTransactions = () => {
    triggerRefresh();
  };

  return (
    <TransactionContext.Provider
      value={{ refreshTransactions, triggerRefresh }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
