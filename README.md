This Application is a fullstack web application of Vending Machine and Management System
*As a client*, you are able to purchase product directly from the UI with virtual cash assigned by the system.
*As the owner*, you are able to manage and monitor products for each individual machine. 
You will be able to know the current cash remaining in the system which will be used for change. 
You will also know the stock remaining in each machines

In Summary, as the owner, You can:
    - In Client:
        - Monitor stock of the machines and current cash 
    - APIs:
        - Add new Product to the system
        - Update product name and pricing
        - Remove Product frm the system
        - Assign products to each machines individually
            - For example: You want to Add Cola on Vending Machine A, But Add Coffee to Vending Machine B. Each of them will have different products
        - Update cash and stock of the machine after each transaction 
            - The system process this once client complete the purchase
---

What can be improved in the future.
- Messaging/Notification system once product is low on stock or the cash run out
- Profit calculator
- Sales Dashboard
- Payment Gateway

---
Simple initial design:

---
## How to run the application:
1. Run docker compose file from root folder

```bash
docker-compose up
```

2. Populate Data

```bash
docker exec -it blue-vending-api-1 node /app/seed.js
```

**Note:**  
If step 2 doesn't work please try the method below:

Get the name from _blue-vending-api_ and use that name to replace the _blue-vending-api-1_

```bash
docker exec -it <replace name here> node /app/seed.js
```

3. Try running it on web browser

```console
http://localhost:5173/
```

** Note:** 
Please use Chrome for the best result since I develop there and have not tested on other browsers

---

## For more information on API endpoints
please refer to '/backend/swagger.yaml'
Paste the data on `https://editor.swagger.io`

---

## Testing

1. from /backend folder run:

```bash
npm test
```
---

## Techstack:
1. Frontend: React
    - Version 18.2.0
2. Backend: Node 
    - Version 18.14.0
--- 