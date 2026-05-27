
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' }),
});

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleGoogleAuth = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Ensure profile exists in Firestore
      if (firestore && user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (!docSnap.exists()) {
          const referralCode = localStorage.getItem('referralCode');
          const newUserProfile = {
            uid: user.uid,
            displayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
            email: user.email || '',
            photoURL: user.photoURL || '',
            subscriptionTier: 'free',
            referredBy: referralCode || null,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, newUserProfile);
          // Clear referral after use
          localStorage.removeItem('referralCode');
        }
      }

      router.push('/');
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError(err.message || 'An error occurred during Google sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    const email = form.getValues('email');
    const isEmailValid = await form.trigger('email');
    if (!isEmailValid) {
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        toast({
            title: 'Password Reset Email Sent',
            description: `A password reset link has been sent to ${email}.`,
        });
    } catch (err: any) {
        setError(getFirebaseErrorMessage(err.code));
    }
  };

  const handleEmailAuth = async (values: z.infer<typeof loginSchema>) => {
    setError(null);
    setIsLoading(true);
    try {
      let user;
      if (isSigningUp) {
        const result = await createUserWithEmailAndPassword(auth, values.email, values.password);
        user = result.user;
      } else {
        const result = await signInWithEmailAndPassword(auth, values.email, values.password);
        user = result.user;
      }

      // Ensure profile exists in Firestore
      if (firestore && user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (!docSnap.exists()) {
          const referralCode = localStorage.getItem('referralCode');
          const newUserProfile = {
            uid: user.uid,
            displayName: user.displayName || values.email.split('@')[0],
            email: user.email,
            photoURL: user.photoURL || '',
            subscriptionTier: 'free',
            referredBy: referralCode || null,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, newUserProfile);
          // Clear referral after use
          localStorage.removeItem('referralCode');
        }
      }

      router.push('/');
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const getFirebaseErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'This email is already in use. Please sign in instead.';
      case 'auth/weak-password':
        return 'The password is too weak. Please use at least 6 characters.';
      case 'auth/invalid-email':
          return 'Please enter a valid email to reset your password.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">
            {isSigningUp ? 'Create an Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isSigningUp
              ? 'Enter your details to get started'
              : 'Sign in to access your account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            variant="outline" 
            className="w-full h-12 gap-3 font-bold border-2" 
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with Email</span>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEmailAuth)}
              className="grid gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                     <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        {!isSigningUp && (
                            <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto text-sm font-normal"
                                onClick={handlePasswordReset}
                                disabled={isLoading}
                            >
                                Forgot Password?
                            </Button>
                        )}
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                          onClick={() => setShowPassword((prev) => !prev)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {showPassword ? 'Hide password' : 'Show password'}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : (isSigningUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            {isSigningUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-bold"
              onClick={() => {
                setIsSigningUp(!isSigningUp);
                setError(null);
                form.reset();
              }}
              disabled={isLoading}
            >
              {isSigningUp ? 'Sign In' : 'Sign Up'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
