import { Product } from "../types/Products";
import { products } from "../data/products";

export const getProducts = async (): Promise<Product[]> => products;

export const getProductById = async (id: string): Promise<Product> => products.find(product => product.id === id)
