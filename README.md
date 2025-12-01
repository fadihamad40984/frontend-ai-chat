# AI Assistant Frontend

A modern, professional chat interface for the AI Assistant backend powered by semantic search and advanced NLP.

## ✨ Features

- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 💬 **Real-time Chat**: Instant messaging with typing indicators
- 📋 **Copy Messages**: One-click copy functionality
- 🎯 **Source Attribution**: Shows sources and confidence scores
- 📱 **Responsive**: Works perfectly on all devices
- 🌙 **Dark Theme**: Eye-friendly dark interface
- ⚡ **Fast**: Optimized performance with React

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/fadihamad40984/frontend-ai-chat.git
cd frontend-ai-chat

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## 🔧 Configuration

The backend URL is configured in `src/pages/Chat.jsx`:

```javascript
const BACKEND_URL = "https://backend-chatbot-bc8w.onrender.com";
```

To use a different backend:
1. Update the `BACKEND_URL` constant
2. Ensure CORS is enabled on your backend

## 📦 Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` folder.

## 🌐 Deployment

### Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel

1. Import your GitHub repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

### GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

## 🎨 Customization

### Colors

Edit Tailwind classes in `Chat.jsx`:
- Primary: `purple-500` to `purple-700`
- Secondary: `pink-500` to `pink-700`
- Background: `slate-900`

### Features

- **Clear Chat**: Delete all messages
- **Copy Messages**: Copy any message to clipboard
- **GitHub Link**: Links to backend repository
- **Timestamps**: Shows message time
- **Sources**: Displays information sources
- **Confidence**: Shows AI confidence score

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Icons** - Icon library

## 🔗 Backend Integration

This frontend connects to the AI Assistant backend:
- **Backend Repo**: https://github.com/fadihamad40984/backend-chatbot
- **Live Backend**: https://backend-chatbot-bc8w.onrender.com
- **API Endpoint**: `/chat` (POST)

### Request Format

```json
{
  "message": "Your question here"
}
```

### Response Format

```json
{
  "response": "AI answer",
  "sources": ["Wikipedia: Topic", "arXiv: Paper"],
  "confidence": 0.95
}
```

## 📝 License

MIT License - feel free to use for your projects

## 👤 Author

**Fadi Hamad**
- GitHub: [@fadihamad40984](https://github.com/fadihamad40984)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

---

Built with ❤️ using React and Vite
