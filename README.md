## Environment Variables

Create a `.env` file in the **root directory**:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_KEY=your_jwt_access_secret
JWT_REFRESH_KEY=your_jwt_refresh_secret
PORT=5000
FRONTEND_URI=http://localhost:5173
NODE_ENV="development"
```

### Generating JWT Secret Keys

You can use Node.js's built-in `crypto` module to generate secure random keys.

Create a temporary file such as `generateKey.js`:

```js
const crypto = require("crypto");

const number = crypto.randomBytes(32).toString("hex");

console.log(number);
```

Run it using:

```bash
node generateKey.js
```

This will generate a random **64-character hexadecimal key**.

Run it **twice** to generate separate keys:

```env
JWT_ACCESS_KEY=generated_key_1
JWT_REFRESH_KEY=generated_key_2
```

For example:

```env
JWT_ACCESS_KEY=<paste-generated-key-here>
JWT_REFRESH_KEY=<paste-another-generated-key-here>
```

> **Important:** Never commit your `.env` file or your actual JWT keys to GitHub.

### `.gitignore`

Make sure your `.gitignore` contains:

```gitignore
node_modules/
.env
```

### Environment Variables Description

| Variable          | Description                                |
| ----------------- | ------------------------------------------ |
| `MONGODB_URI`     | MongoDB connection URI                     |
| `JWT_ACCESS_KEY`  | Secret key used for signing access tokens  |
| `JWT_REFRESH_KEY` | Secret key used for signing refresh tokens |
| `PORT`            | Port on which the backend server runs      |
| `FRONTEND_URI`    | URL of the frontend application            |
| `NODE_ENV`        | Application environment                    |
