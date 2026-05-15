# Lend
This is a fintech backend API built using Express.js provides endpoints to manage loan based on user input through REST API. 
    
## Features
- store users,loan and repayment record in a database
- Provide REST API endpoints for loan and managing users
- Authentication and authorization 

## Tech Stack
- Node.js
- Express.js 
- PostgreSQL 
- JWT Authentication
- CORS Middleware 

## Installation
### Prerequisites
Make sure you have the following installed:
- Node.js (>= 14.x)
- npm 
- PostgreSQL

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/lend.git
   cd lend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following:
   ```env
   PORT=5000
   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Run the server:
   ```sh
   npm start
   ```
   Or run in development mode with nodemon:
   ```sh
   npm run dev
   ```

## API Endpoints
### Authentication
- `POST /users/register` - Register a new user
- `POST /users/login` - Authenticate user and return a token

### managing loan
- `POST /loans/request` - create loan request 
- `GET /loans/my_loans` - List borrower's loan records
- `GET /loans/all_loans` - List all loans records
- `PATCH /loans/:loanId/status` - update loan status
- `POST /loans/:loanId/pay` - create payments

## Project Structure
```
lend/
│── node_modules/
│── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── loanController.js
│   ├── db/
│   │   ├── Database.js
│   │   ├── loan_db.sql
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
├── routes/
│   │   ├── authRoutes.js
│   │   ├── loanRoutes.js
│   ├── utils/
│   │   ├── jwt.js
│   ├── App.js
│   ├── index.js
│── .env
│── .gitignore
│── package.json
│── README.md
```

## Deployment
### Deploy on Heroku
1. Login to Heroku:
   ```sh
   heroku login
   ```
2. Create a new Heroku app:
   ```sh
   heroku create lend
   ```
3. Add environment variables to Heroku:
   ```sh
   heroku config:set DATABASE_URL=your_database_connection_string
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   heroku config:set JWT_SECRET=your_jwt_secret
   ```
4. Deploy to Heroku:
   ```sh
   git push heroku main
   ```

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

## License
This project is licensed under the MIT License.

