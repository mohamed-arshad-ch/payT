import { useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === 'Mach' && password === 'Mcodev@123') {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/local`, {
          identifier: username,
          password: password
        });

        const { jwt } = response.data;
        // Store JWT in cookie, set expiration to 1 hour
        Cookies.set("user_token", jwt, { expires: 1 / 24 });

        // Redirect to home page
        router.push('/invoices');
      } catch (error) {
        console.error('Login failed:', error);
        alert('Invalid username or password');
      }
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <>
    <Header/>

    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    <Footer/>
    </>
    
  );
}
