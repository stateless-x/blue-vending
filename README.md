## How to run the application:

1. Run docker compose file from root folder

```bash
docker-compose up
```

2. Populate Data

```bash
docker exec -it blue-vending-api-1 node /app/seed.js
```

Note:  
If step 2 doesn't work please try the method below:

Get the name from 'blue-vending-api' and use that name to replace the blue-vending-api-1

```bash
docker exec -it <replace name here> node /app/seed.js
```

3. Try running it on web browser

```console
http://localhost:5173/
```

Note:
Please use Chrome for the best result since I develop there and have not tested on other browsers

---

## For more information on API endpoints please refer to '/backend/swagger.yaml'

Paste the data on `https://editor.swagger.io`

---

## Testing

1. from /backend folder run:

```bash
npm test
```