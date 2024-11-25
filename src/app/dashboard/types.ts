export interface Transaction {
  id: number;
  amount: number;
  paymentReference: string;
  status: string;
  createdAt: string;
  student: {
    firstName: string;
    lastName: string;
  };
  paymentItem: {
    name: string;
  };
}
