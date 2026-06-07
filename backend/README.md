# Link Roaster Backend API

A complete Node.js + Express REST API backend that scrapes web pages and uses Gemini 1.5 Flash to generate savage, funny reviews and summaries of any link submitted by users.

---

## Tech Stack
* **Node.js** (ES Modules)
* **Express.js** (Web framework)
* **Mongoose** (MongoDB ODM)
* **Axios & Cheerio** (Web scraping)
* **@google/generative-ai** (Gemini 1.5 Flash AI API)
* **express-rate-limit** (Rate limiting security)
* **helmet & cors** (Security headers and cross-origin resource sharing)
* **dotenv** (Environment variables management)
* **express-async-errors** (Automatic async error propagation to handlers)

---

## Setup & Local Development

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed on your system.

### Step 1: Install Dependencies
Navigate to the `/backend` directory and run:
```bash
npm install
```

### Step 2: Set Up Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in the values:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/linkroaster
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Step 3: Get Free Services
1. **Free Database:** Sign up on [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database), spin up a free M0 tier cluster, and copy your connection string into `MONGODB_URI`.
2. **Free Gemini API Key:** Go to [Google AI Studio](https://aistudio.google.com) and generate a free API key. Add it to `GEMINI_API_KEY`.

### Step 4: Run the Server
For development with auto-reload:
```bash
npm run dev
```
For production:
```bash
npm start
```

---

## API Documentation

| Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/roast` | Submit a URL to get roasted (15-min rate limit) | `{ "url": "https://example.com" }` |
| **GET** | `/api/roasts` | Get a paginated feed of previous roasts | Query: `?page=1&limit=10` (max limit 20) |
| **GET** | `/api/roasts/:id` | Get details of a single roast | URL Param: `:id` (24-character hex string) |
| **GET** | `/health` | API service health check | None |

---

## Error Codes Reference

When a request fails, the API returns a corresponding HTTP status and JSON response showing the error code and details.

| Error Code | HTTP Status | Meaning |
| :--- | :--- | :--- |
| `INVALID_URL` | 422 | The URL is missing, invalid, uses a protocol other than HTTP/HTTPS, or is pointing to a local/private network. |
| `TIMEOUT` | 422 | The target page took too long to load (exceeded 10 seconds). |
| `BLOCKED` | 422 | The target website blocks scrapers (returned 403 Forbidden). |
| `NOT_FOUND` | 422 | The target page does not exist (returned 404 Not Found). |
| `HTTP_ERROR` | 422 | The target page returned a server error (HTTP status >= 400). |
| `UNREACHABLE` | 422 | DNS lookup failed or server is down (ENOTFOUND/ECONNREFUSED). |
| `SCRAPE_FAILED`| 422 | Scraper was unable to load the page due to unexpected errors. |
| `NOT_HTML` | 422 | The response headers show the page content is not HTML. |
| `EMPTY_CONTENT`| 422 | The scraped page has insufficient readable text to perform a roast (< 50 chars). |
| `AI_FAILED` | 422 | Gemini model failed to generate or validate the roast JSON. |
| `RATE_LIMITED` | 429 | Request frequency limit exceeded. (10 roasts per 15 minutes or 60 overall requests per minute). |
| `VALIDATION_ERROR`| 400 | Data submitted failed Mongoose database validation checks. |
| `INVALID_ID` | 400 | The provided Roast ID is not a valid 24-character MongoDB ObjectId. |

---

## Deployment to Render.com

1. Create a free account on [Render](https://render.com).
2. Connect your GitHub repository containing the project.
3. Create a new **Web Service**.
4. Configure the service settings:
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Go to the **Environment** tab and add the following keys from your `.env` file:
   - `PORT`
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `FRONTEND_URL`
   - `NODE_ENV` (set to `production`)
6. **Note:** Render's free tier instances spin down after 15 minutes of inactivity. The first request after a spin-down may take a minute or two to respond.
