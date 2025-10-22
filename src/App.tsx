import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home/Main.tsx';
import NotFound from '@/pages/404/NotFound.tsx';
import { ThemeProvider } from '@/components/ui/theme-provider.tsx';

function App(){
  return (
    <>
        {/* Default to dark mode as requested */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <BrowserRouter>
                <Routes>
                    {/* Home */}
                    <Route path="/" element={<Home />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </>
  )
}

export default App
