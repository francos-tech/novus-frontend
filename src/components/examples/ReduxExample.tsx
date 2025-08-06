'use client';

import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReduxExample() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme);
  const auth = useAppSelector((state) => state.auth);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Redux Store Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Theme State:</h3>
          <p className="text-sm text-gray-600">
            Current theme: {theme.mode}
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold">Auth State:</h3>
          <p className="text-sm text-gray-600">
            User: {auth.user ? auth.user.email : 'Not logged in'}
          </p>
        </div>

        <Button 
          onClick={() => {
            // Example of dispatching an action
            // dispatch(toggleTheme());
          }}
        >
          Toggle Theme (Example)
        </Button>
      </CardContent>
    </Card>
  );
} 