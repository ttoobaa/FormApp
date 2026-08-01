// import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export function SuccessPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8">
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Form Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Your form has been successfully submitted. This form link is now permanently locked
              and cannot be submitted again.
            </p>
            {/* <Link to="/">
              <Button>Go Home</Button>
            </Link> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
