import client from '../database'


export type Product = {
    id?: number;
    name: string;
    price: number;
    category?: string;
};


export class ProductsModel {
    async index(): Promise<Product[]> {
        try {
            const sql = 'SELECT * FROM products';
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(
                `Failed to get the products with the following error: ${error}`
                );
            };
        };
        
        
        async show(id: number): Promise<Product> {
            try {
                const sql = 'SELECT * FROM products WHERE id=($1)';
                const conn = await client.connect();
                const result = await conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            } catch (err) {
                throw new Error(`Could not find User ${id}. Error: ${(err as Error).message}`);
            };
        };
        
        async create(p: Product): Promise<Product> {
            
            try {
                const conn = await client.connect();
                const sql = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
                const result = await conn.query(sql, [p.name, p.price, p.category]);
                const Product = result.rows[0];
                conn.release();
                return Product
            } catch (err) {
                throw new Error(`Could not add new Product ${p.name}. Error: ${(err as Error).message}`)
            };
        };
        
        async productByCategory(category: string): Promise<Product[]> {
            try {
                const sql = 'SELECT * FROM products WHERE category=($1)';
                const conn = await client.connect();
                const result = await conn.query(sql, [category]);
                conn.release();
                return result.rows;
            } catch (error) {
                throw new Error(
                    `there in no products in category with name: ${category}. Error: ${(error as Error).message}`
                    );
                };
            };
            
            async mostPopular(): Promise<Product[]> {
                try {
                    const sql = 'SELECT COUNT(product_id), product_id FROM order_products GROUP BY product_id LIMIT 5';
                    const conn = await client.connect();
                    const result = await conn.query(sql);
                    conn.release();
                    return result.rows;
                } catch (error) {
                    throw new Error(
                        `cannot get the Top 5 products. Error: ${(error as Error).message}`
                        );
                    };
                };
            };  
            
            
            
            
            export default ProductsModel;
            
            
            