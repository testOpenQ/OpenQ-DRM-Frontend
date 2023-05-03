import React, { useReducer, createContext, useContext } from "react";

import reducer, { type Action } from "./Reducer";
import type { Customer } from "~/lib/openQApi/types";

const CustomerContext = createContext({});

export type CustomerContextType = {
  customers: Customer[];
};

export function useCustomers() {
  const [context, updater] = useContext(CustomerContext) as [
    CustomerContextType,
    React.Dispatch<Action>
  ];
  return { context, updater };
}

export default function CustomersProvider({
  children,
  customersInfo,
}: {
  children: React.ReactNode;
  customersInfo: { customers: Customer[] };
}) {
  const customerContextValue = useReducer(reducer, customersInfo);
  console.log(customersInfo, "my customers");

  return (
    <CustomerContext.Provider value={customerContextValue}>
      {children}
    </CustomerContext.Provider>
  );
}
