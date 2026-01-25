# Ustazon Frontend

Educational platform frontend built with React, TypeScript, and Vite.

## Features

### AI-Powered Tools
- **AI Chat** (`/ai-chat`) - Interactive AI assistant for teachers
- **Presentation Generator** (`/ai-preza`) - Create PowerPoint presentations for lessons
- **Test Generator** (`/ai-test`) - Generate tests, СОР, and СОЧ assignments

### Learning Materials
- Subject materials browser
- Lesson plans by grade and quarter
- Interactive tests

### User Features
- User authentication and profiles
- Personal progress tracking
- Material favorites and history

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Axios** - API client
- **Zustand** - State management
- **Lucide React** - Icon library
- **SCSS Modules** - Component styling

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.development .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
VITE_API_URL=http://185.129.51.101:8000/api/v1
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## AI Features Guide

### Presentation Generator (`/ai-preza`)

Generate educational PowerPoint presentations.

**Required Fields:**
- Subject (Предмет) - e.g., "История", "Физика"
- Grade (Класс) - Select from 1-11
- Topic (Тема урока) - e.g., "Великий шелковый путь"

**Optional Settings:**
- Slides Count (5-30) - Default: 12
- AI Model - Select from Gemini, Claude, or GPT models

**Output:**
- `.pptx` file with structured slides
- Title slide, content slides, conclusion
- Placeholder slots for images
- Fully editable in PowerPoint/LibreOffice

**Usage Tips:**
- Be specific with topics for better results
- 10-15 slides work best for a 45-minute lesson
- Use Gemini 2.5 Flash (default) - it's free and fast

### Test Generator (`/ai-test`)

Generate tests, СОР (summative assessment for section), and СОЧ assignments.

**Required Fields:**
- Subject (Предмет) - e.g., "Математика", "Биология"
- Grade (Класс) - Select from 1-11
- Topic (Тема теста) - e.g., "Законы Ньютона"

**Optional Settings:**
- Question Count (5-50) - Default: 15
- Difficulty - Базовый, Средний, Высокий, Смешанный
- AI Model - Select from available models

**Output:**
- `.docx` file with questions and answer key
- Multiple choice questions
- Open-ended questions
- Problem-solving tasks
- Complete answer key at the end

**Question Types Generated:**
- Тесты (Multiple choice with 4 options)
- Открытые вопросы (Short answer questions)
- Задачи (Problem-solving tasks)
- Critical thinking questions

**Usage Tips:**
- 15-20 questions for СОР
- 25-30 questions for СОЧ
- Use "Смешанный" difficulty for balanced tests
- Topics should be specific to a curriculum section

### AI Chat (`/ai-chat`)

Interactive AI assistant for teachers with file support.

**Features:**
- Multi-turn conversations
- File attachments (images, PDFs, DOCX)
- Conversation history
- Multiple AI models
- Quick command templates

**Supported File Types:**
- Images (PNG, JPG, JPEG)
- PDFs
- Word documents (DOCX)

**Use Cases:**
- Lesson planning assistance
- Content explanation
- Assignment ideas
- Curriculum questions
- Educational advice

### Available AI Models

| Model | Speed | Quality | Cost | Best For |
|-------|-------|---------|------|----------|
| Gemini 2.5 Flash | Fast | Good | Free | Daily use, quick generations |
| Gemini 2.0 Flash Exp | Fast | Good | Free | Experimental features |
| Claude 3.5 Sonnet | Medium | Excellent | Paid | Complex content, analysis |
| GPT-4o Mini | Fast | Good | Paid | Cost-effective option |
| GPT-4o | Slow | Excellent | Paid | Highest quality output |

**Recommendation:** Start with Gemini 2.5 Flash - it's free, fast, and produces quality results for most educational content.

## Error Handling

All AI generators include comprehensive error handling:

- **Validation errors** - "Пожалуйста, заполните все обязательные поля"
- **Network errors** - "Нет подключения к интернету"
- **Server errors** - "Ошибка на сервере. Попробуйте еще раз"
- **Timeout errors** - "Превышено время ожидания"
- **Auth errors** - "Сессия истекла. Пожалуйста, войдите снова"

If generation fails, the error message will explain what went wrong and suggest a solution.

## Project Structure

```
src/
├── app/              # App setup, routes, layouts
│   ├── layouts/      # MainLayout, AuthLayout
│   └── routes/       # AppRouter with all routes
├── pages/            # Page components
│   ├── ai-chat/      # AI Chat page
│   ├── ai-preza/     # Presentation generator page
│   ├── ai-test/      # Test generator page
│   └── ...
├── features/         # Feature modules
│   ├── ai-chat/      # Chat feature components
│   └── ai-tools/     # Generator components
│       ├── ui/
│       │   ├── PrezaGenerator/
│       │   ├── TestGenerator/
│       │   ├── AIToolLayout/
│       │   └── components/  # Shared components
├── entities/         # Business entities
├── widgets/          # Complex widgets
├── shared/           # Shared utilities
│   ├── api/          # API clients (ai.ts, apiClient.ts)
│   ├── ui/           # Reusable UI components
│   └── styles/       # Global styles
└── vite-env.d.ts     # TypeScript declarations
```

## API Integration

The frontend communicates with the backend API at `http://185.129.51.101:8000/api/v1`.

### Key Endpoints

**AI Generation:**
- `POST /ai/generate-presentation` - Generate PowerPoint
- `POST /ai/generate-test` - Generate test DOCX
- `POST /ai/chat` - One-shot chat
- `POST /ai/messages` - Send message with history

**Conversations:**
- `GET /ai/conversations` - List conversations
- `POST /ai/conversations` - Create conversation
- `GET /ai/conversations/:id` - Get conversation
- `DELETE /ai/conversations/:id` - Delete conversation

**Authentication:**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /users/me` - Get current user

All requests include JWT authentication via `Authorization: Bearer <token>` header.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Development

### Code Style
- ESLint for linting
- TypeScript strict mode
- SCSS modules for styling
- Feature-based architecture (FSD)

### Adding a New AI Generator

1. Create page component in `src/pages/ai-new-feature/`
2. Create generator component in `src/features/ai-tools/ui/NewFeatureGenerator/`
3. Add API method in `src/shared/api/ai.ts`
4. Register route in `src/app/routes/AppRouter.tsx`
5. Add to sidebar in `src/features/ai-tools/ui/AIToolLayout/AIToolLayout.tsx`

### Component Patterns

All AI generators follow the same pattern:

```tsx
export const NewGenerator = () => {
    const [formData, setFormData] = useState({...});
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        // Validation
        // API call
        // Download handling
        // Error handling
    };

    return (
        <AIGeneratorLayout
            title="..."
            description="..."
            icon={<Icon />}
            form={formJSX}
            preview={previewJSX}
            isGenerating={isGenerating}
        />
    );
};
```

## Troubleshooting

### Common Issues

**"Failed to connect to server"**
- Check if backend is running
- Verify VITE_API_URL in .env
- Check network connection

**"Session expired"**
- User needs to log in again
- Check if token is valid

**"Generation timeout"**
- Reduce slides/questions count
- Try a faster AI model
- Check backend performance

**Downloads not working**
- Check browser download settings
- Ensure pop-ups are not blocked
- Try different browser

## Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request

## License

Proprietary - Ustazon Educational Platform

## Support

For issues or questions, contact the development team.
