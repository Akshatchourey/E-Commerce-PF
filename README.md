# E-Commerce Platform

## 🛠 Tech Stack - more to go

- **Backend**: Django 4.x + Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: Django Simple JWT

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- PostgreSQL not needed as it is online
- requirements installed

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Akshatchourey/E-Commerce-PF.git
cd backend
```

2. **Create virtual environment**
```bash
python -m venv myenv
myenv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Environment configuration**
 add provided .env in backend>backend>.env

6. **Run development server**
```bash
python manage.py runserver
```

## 🗄 Database Schema

### Key Models - To me made
- **User**: Custom user model with email authentication
- **Product**: Product catalog with pricing, categories, and images
- **Order**: Order management with sequential ID generation
- **OrderItem**: Individual items within orders
- **Cart/Inventory**: Shopping cart functionality
- **wishlist**: Items uer want to buy later
- **review**: Comments on products

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: Parameterized queries

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request
6. Wait for review and do required corrections


**Building with ❤️ using Django REST Framework**
