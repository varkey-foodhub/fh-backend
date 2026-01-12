export type MenuItem = {
  name: string;
  price: Price[];
  ingredients: string[];
  out_of_stock: boolean;
  out_of_stock_items: string[];
};

export type Menu = {
  items: MenuItem[];
};
export type Price = {
  device: Device;
  price: number;
};

export enum Device{
  KIOSK="kiosk",
  MOBILE="mobile",
  DINEIN="dinein"
}
