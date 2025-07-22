
class Order:
    def __init__(self, order_id, customer_id, items, order_date, total_amount, status="Pending"):
        self.order_id = order_id
        self.customer_id = customer_id
        self.items = items  # List of tuples (item_id, quantity, price_per_item)
        self.order_date = order_date
        self.total_amount = total_amount
        self.status = status  # e.g., "Pending", "Shipped", "Delivered", "Cancelled"

    def update_status(self, new_status):
        self.status = new_status

    def add_item(self, item_id, quantity, price_per_item):
        self.items.append((item_id, quantity, price_per_item))
        self.total_amount += quantity * price_per_item

    def remove_item(self, item_id):
        for item in self.items:
            if item[0] == item_id:
                self.total_amount -= item[1] * item[2]
                self.items.remove(item)
                return  # Assuming only one item with the same ID
        print(f"Item {item_id} not found in order {self.order_id}")

    def calculate_total(self):
        self.total_amount = sum(quantity * price for _, quantity, price in self.items)
        return self.total_amount

    def __str__(self):
        return f"Order ID: {self.order_id}, Customer ID: {self.customer_id}, Status: {self.status}, Total: {self.total_amount}"


class OrderManagementSystem:
    def __init__(self):
        self.orders = {}

    def create_order(self, customer_id, items, order_date):
        order_id = len(self.orders) + 1
        total_amount = sum(quantity * price for _, quantity, price in items)
        order = Order(order_id, customer_id, items, order_date, total_amount)
        self.orders[order_id] = order
        return order

    def get_order(self, order_id):
        return self.orders.get(order_id)

    def update_order_status(self, order_id, new_status):
        order = self.get_order(order_id)
        if order:
            order.update_status(new_status)
        else:
            print(f"Order {order_id} not found.")

    def cancel_order(self, order_id):
        order = self.get_order(order_id)
        if order:
            order.update_status("Cancelled")
        else:
            print(f"Order {order_id} not found.")

    def remove_order(self, order_id):
        if order_id in self.orders:
            del self.orders[order_id]
        else:
            print(f"Order {order_id} not found.")

    def list_orders(self):
        return list(self.orders.values())

    def filter_orders_by_status(self, status):
        return [order for order in self.orders.values() if order.status == status]

if __name__ == '__main__':
    oms = OrderManagementSystem()

    # Create some orders
    order1 = oms.create_order(1, [(101, 2, 25.0), (102, 1, 50.0)], "2023-11-01")
    order2 = oms.create_order(2, [(201, 1, 100.0)], "2023-11-05")
    order3 = oms.create_order(1, [(301, 3, 10.0)], "2023-11-10")

    # List all orders
    print("All Orders:")
    for order in oms.list_orders():
        print(order)

    # Get an order by ID
    print("\nOrder 2 Details:")
    order = oms.get_order(2)
    print(order)

    # Update order status
    oms.update_order_status(1, "Shipped")
    print("\nOrder 1 Status Updated:")
    print(oms.get_order(1))

    # Filter orders by status
    print("\nPending Orders:")
    pending_orders = oms.filter_orders_by_status("Pending")
    for order in pending_orders:
        print(order)

    # Cancel an order
    oms.cancel_order(3)
    print("\nOrder 3 Cancelled:")
    print(oms.get_order(3))

    # Remove an order
    oms.remove_order(2)
    print("\nAll Orders After Removing Order 2:")
    for order in oms.list_orders():
        print(order)
