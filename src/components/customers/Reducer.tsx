import type { Customer } from "~/lib/openQApi/types";

type ActionA = {
  type: "ADD_CUSTOMER";
  payload: Customer;
};
export type Action = ActionA;
type CustomersState = {
  customers: Customer[];
};
const reducer = (state: CustomersState, action: Action) => {
  switch (action.type) {
    case "ADD_CUSTOMER":
      return { ...state, customers: state.customers.concat(action.payload) };
    default:
      return state;
  }
};
export default reducer;
