import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LucideHome, HelpCircle, LucideMenu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeDropdown, ColorDropdown } from '@/components/ui/theme-provider';


export default function Header({ shadow = true }: { shadow?: boolean }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header
            id="header"
            className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 w-[80%] justify-center"
        >
            {/* Background container */}
            <div
                className={`relative flex w-full items-center justify-between rounded-full border border-white/10 
        bg-black/40 backdrop-blur-lg px-4 py-2 text-secondary transition-all duration-300 
        ${shadow ? 'shadow-lg' : ''}`}
            >
                {/* Left side - Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-80"
                >

                    <span className="text-sm font-semibold text-white">Wordle</span>
                </Link>

                {/*  Navigation (Desktop) */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList className="flex gap-6">
                        <NavigationMenuItem>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                                <Link
                                    to="/"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/');
                                    }}
                                    className="text-sm font-medium bg-transparent hover:text-primary text-white transition-colors"
                                >
                                    Home
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                                <Link
                                    to="/docs"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/docs');
                                    }}
                                    className="text-sm font-medium  bg-transparent hover:text-primary text-white transition-colors "
                                >
                                    Docs
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Right-side controls (Desktop) */}
                <div className="hidden md:flex items-center gap-2">
                    <ThemeDropdown />
                    <ColorDropdown />
                </div>

                {/* Mobile Navigation */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 md:hidden">
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white">
                                <LucideMenu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="flex flex-col bg-green text-white">
                            <div className="flex flex-col space-y-4 py-4">
                                <Link
                                    to="/"
                                    className="hover:bg-white/10 flex items-center gap-2 rounded-md px-4 py-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    <LucideHome className="h-5 w-5" />
                                    <span>Home</span>
                                </Link>
                                <Link
                                    to="/docs"
                                    className="hover:bg-white/10 flex items-center gap-2 rounded-md px-4 py-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/docs');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    <HelpCircle className="h-5 w-5" />
                                    <span>Docs</span>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
