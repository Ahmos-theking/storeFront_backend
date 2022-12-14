import client from '../database' 

export type Order = {
    id?: number;
    status: string;
    user_id: number;
}


export class OrderModel {
    
    
    async index(): Promise<Order[]> {
        try {
            const sql = 'SELECT * FROM orders';
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(
                `Failed to get the orders with the following error: ${error}`
                );
            };
        };
        
        async create(O: Order): Promise<Order> {
            
            try {
                const conn = await client.connect();
                const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
                const result = await conn.query(sql, [O.status, O.user_id]);
                const Order = result.rows[0];
                conn.release();
                return Order;
            } catch (err) {
                throw new Error(`Could not make new Order, Error: ${(err as Error).message}`)
            };
        };
        
        
        async completedOrders(user_id: Number, status:string): Promise<Order[]> {
            try {
                const conn = await client.connect();
                const sql = 'SELECT * FROM Orders WHERE user_id=($1) AND status=($2)';
                const result = await conn.query(sql,[user_id, status]);
                conn.release();
                return result.rows;
            } catch (err) {
                throw new Error(`there is no completed orders for this ${user_id}, ${(err as Error).message}`);
            };
        };
        
        
        async currentOrders(user_id: Number, status:string): Promise<Order[]> {
            try {
                const conn = await client.connect();
                const sql = 'SELECT * FROM Orders WHERE user_id=($1) AND status=($2)';
                const result = await conn.query(sql,[user_id, status]);
                conn.release();
                return result.rows;
            } catch (err) {
                throw new Error(`there is no current orders for this ${user_id}, ${(err as Error).message}`);
            };
        };
        
        async deleteOrder (id: string): Promise<Order> {
            try {
                const connection = await client.connect()
                const sql = `DELETE FROM orders WHERE id=($1) RETURNING *`
                const result = await connection.query(sql, [id])
                connection.release()
                return result.rows[0]
            } catch (err) {
                throw new Error(
                    `Could not delete this order , ${(err as Error).message}`)
                };
            };
            
        };
        
        export default OrderModel;
        