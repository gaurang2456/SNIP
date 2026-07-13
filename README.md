# 🔗 URL Manager 

https://snip-delta-two.vercel.app/

A full-stack URL Management Platform built with **Spring Boot**, **React**, **MySQL**, and **Redis**.

The application allows users to create, manage, and track shortened URLs with support for custom aliases, QR code generation, click analytics, expiration management, caching, and monitoring.

## 🚀 Deployment

Planned deployment stack:

* Frontend: Vercel
* Backend: Railway
* Database: MySQL
* Cache: Redis

Deployment configuration is already included through Docker and environment-based configuration.


## ✨ Features

### URL Shortening

* Create short URLs from long URLs
* Generate custom aliases
* Automatic short code generation
* URL validation

### URL Management

* View all shortened URLs
* View URL details
* Enable/disable URLs
* Expiration date support

### Analytics

* Track URL clicks
* Click count monitoring
* URL performance insights
* Analytics dashboard

### QR Code Generation

* Generate QR codes for shortened URLs
* Download and share QR codes
* Mobile-friendly access

### Performance Optimization

* Redis caching for faster URL resolution
* Reduced database load
* Improved response times

### Monitoring

* Spring Boot Actuator integration
* Health checks
* Application metrics
* Runtime monitoring

### Modern Frontend

* Responsive React UI
* Dashboard view
* URL management interface
* Analytics visualization

---

## 🛠️ Tech Stack

### Backend

* Java 17
* Spring Boot 3
* Spring Data JPA
* Spring Data Redis
* Spring Validation
* Spring Actuator
* Maven
* Lombok

### Frontend

* React
* Axios
* React Router
* Recharts
* CSS

### Database & Caching

* MySQL
* Redis

### DevOps & Deployment

* Docker
* Docker Compose
* Vercel
* Railway

---

## 📂 Project Structure

```text
url-manager
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   ├── dto
│   ├── config
│   └── resources
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   └── services
│   └── public
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Backend Setup

### Clone Repository

```bash
git clone https://github.com/yourusername/url-manager.git
cd url-manager
```

### Configure MySQL

Create a database:

```sql
CREATE DATABASE urlshortener;
```

Update:

```text
backend/src/main/resources/application.yml
```

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/urlshortener
    username: your_username
    password: your_password
```

### Configure Redis

Make sure Redis is running locally:

```bash
redis-server
```

### Run Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

---

## 💻 Frontend Setup

Install dependencies:

```bash
cd frontend
npm install
```

Run frontend:

```bash
npm start
```

Frontend runs at:

```text
http://localhost:3000
```

---

## 🐳 Docker Setup

Run the complete application stack:

```bash
docker compose up --build
```

Services:

| Service  | Port |
| -------- | ---- |
| Frontend | 3000 |
| Backend  | 8080 |
| MySQL    | 3306 |
| Redis    | 6379 |

---

## 📡 API Endpoints

### Create Short URL

```http
POST /api/urls
```

Request:

```json
{
  "originalUrl": "https://www.google.com",
  "customAlias": "google",
  "expiryDays": 30,
  "title": "Google Search"
}
```

---

### Get All URLs

```http
GET /api/urls
```

---

### Get URL By ID

```http
GET /api/urls/{id}
```

---

### Get Analytics

```http
GET /api/urls/{id}/analytics
```

---

### Redirect URL

```http
GET /{shortCode}
```

Example:

```text
http://localhost:8080/google
```

---

## 📊 Example Response

```json
{
  "id": 1,
  "originalUrl": "https://www.google.com",
  "shortCode": "google",
  "shortUrl": "http://localhost:8080/google",
  "clickCount": 2,
  "createdAt": "2026-06-02T03:00:00",
  "expiresAt": "2026-07-02T03:00:00",
  "isActive": true,
  "title": "Google Search"
}
```

---

## 📈 System Architecture

```text
React Frontend
        │
        ▼
Spring Boot REST API
        │
 ┌──────┴──────┐
 ▼             ▼
MySQL       Redis
(Database) (Cache)
```

---

## 🔮 Future Enhancements

* User Authentication & Authorization
* Custom Domains
* Team Workspaces
* Advanced Analytics
* Export Reports (CSV/PDF)
* URL Categories & Tags
* Rate Limiting
* Geo-location Analytics
* AI-powered Traffic Insights

---

## 🎯 Key Learning Outcomes

* REST API Development
* Spring Boot Architecture
* Database Design
* Redis Caching
* Full-Stack Development
* Docker Containerization
* API Monitoring
* React Integration
* Deployment & DevOps
* Scalable System Design

---

## 👨‍💻 Author

**Gaurang Kishore**

