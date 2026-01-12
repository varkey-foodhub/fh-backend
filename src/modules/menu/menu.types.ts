export type MenuItem = {
    name:string,
    price:number,
    ingredients:string[];
    out_of_stock:boolean;
    out_of_stock_items:string[]
}

export type Menu = {
    items: MenuItem[];
}

