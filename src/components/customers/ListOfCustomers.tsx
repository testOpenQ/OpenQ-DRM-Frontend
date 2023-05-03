import { useCustomers } from "./CustomersProvider";
import CustomerIndividual from "./CustomerIndividual";
const ListOfCustomers = () => {
  const { context } = useCustomers();
  const { customers } = context;
  return (
    <ul className="flex-col gap-4">
      {customers.map((customer) => (
        <CustomerIndividual key={customer.id} customer={customer} />
      ))}
    </ul>
  );
};

export default ListOfCustomers;
