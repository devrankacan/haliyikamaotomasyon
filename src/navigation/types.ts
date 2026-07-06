export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  CustomerDetail: { customerId: string };
  CustomerForm: { customerId?: string };
  ContactsImport: undefined;
  OrderCustomerPicker: undefined;
  OrderDetail: { orderId: string };
  OrderForm: { customerId: string; orderId?: string };
};

export type MainTabsParamList = {
  Dashboard: undefined;
  Customers: undefined;
  Orders: undefined;
  Sms: undefined;
  Settings: undefined;
};
