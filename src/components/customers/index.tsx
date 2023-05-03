import { useState } from "react";
import Headline from "../layout/Headline";
import Input from "../base/Input";
import Button from "../base/Button";
import axiosClient from "~/lib/axiosClient";
import { CREATE_CUSTOMER, GET_CUSTOMER } from "~/lib/openQApi";
import { useSession } from "next-auth/react";
import CustomersProvider from "./CustomersProvider";
import { type Customer } from "~/lib/openQApi/types";
import useAxiosClient from "~/hooks/useAxiosClient";
import ListOfCustomers from "./ListOfCustomers";

export type CustomersFetchType = { customers: { nodes: Customer[] } };
export default function Welcome() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const { data } = useSession();
  const query = GET_CUSTOMER as string;
  console.log(data);
  const customerInfo = useAxiosClient<CustomersFetchType>(
    data?.accessToken,
    query,
    "customers"
  );

  if (!data?.accessToken) return <></>;
  const { accessToken } = data;
  async function handleAddCustomer() {
    setCustomerEmail("");
    type CreateCustomerResponse = {
      createCustomer: {
        id: string;
      };
    };
    const { createCustomer } = await axiosClient<CreateCustomerResponse>(
      CREATE_CUSTOMER,
      accessToken,
      { email: customerEmail, name: customerName }
    );
    console.log(createCustomer);
  }
  if (!customerInfo.data) return <></>;
  const InitialConsumers = {
    customers: customerInfo.data.customers.nodes,
  };
  console.log(InitialConsumers, "my customers");
  return (
    <CustomersProvider customersInfo={InitialConsumers}>
      <div className="max-w-3xl">
        <Headline>Manage your Customers</Headline>
        <div className="mt-6">
          <Input
            value={customerName}
            setValue={setCustomerName}
            placeholder="Customer Name"
          />
        </div>
        <div className="mt-6">
          <Input
            value={customerEmail}
            setValue={setCustomerEmail}
            placeholder="Customer Email"
          />
        </div>

        <div className="mt-4">
          <Button
            onClick={handleAddCustomer}
            disabled={customerName.length === 0}
            className="ml-auto"
          >
            Add Customer
          </Button>

          <Headline>Current Customers</Headline>
          <ListOfCustomers />
        </div>
      </div>
    </CustomersProvider>
  );
}
