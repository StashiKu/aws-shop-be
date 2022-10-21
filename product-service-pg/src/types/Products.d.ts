export type Product = {
    DESCRIPTION: string;
    ID: string;
    PRICE: number;
    TITLE: string;
}

export type Stock = {
    PRODUCT_ID: string,
    COUNT: number
}

export interface ProductDTO extends Product {
    COUNT: number;
}

export type ProductUI = {
    id?: string,
    description: string,
    title: string,
    count: number,
    price: number
}

export type ProductCreation = Omit<ProductUI, 'id'>;
