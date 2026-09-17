## Environment Variables

Create a `.env` file in the **root directory** and add the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_KEY=your_jwt_access_secret
JWT_REFRESH_KEY=your_jwt_refresh_secret
PORT=5000
FRONTEND_URI=http://localhost:5173
NODE_ENV="development"
```

### Variable Description

| Variable          | Description                                            | Example                                                      |
| ----------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| `MONGODB_URI`     | MongoDB connection URI used to connect to the database | `mongodb+srv://username:password@cluster.mongodb.net/dbname` |
| `JWT_ACCESS_KEY`  | Secret key used to sign access tokens                  | `your_access_secret`                                         |
| `JWT_REFRESH_KEY` | Secret key used to sign refresh tokens                 | `your_refresh_secret`                                        |
| `PORT`            | Port on which the backend server runs                  | `5000`                                                       |
| `FRONTEND_URI`    | URL of the frontend application                        | `http://localhost:5173`                                      |
| `NODE_ENV`        | Application environment                                | `development`                                                |

> **Important:** Never commit your `.env` file to GitHub. Add `.env` to your `.gitignore` file.

### Example `.gitignore`

```gitignore
node_modules/
.env
```
