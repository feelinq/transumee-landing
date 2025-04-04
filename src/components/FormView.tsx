
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';

interface FormViewProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  country: string;
  setCountry: (country: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  file: File | null;
}

const FormView = ({
  name,
  setName,
  email,
  setEmail,
  country,
  setCountry,
  handleFileChange,
  handleSubmit,
  isSubmitting,
  file
}: FormViewProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-transumee-200">
      <h2 className="text-xl font-bold mb-6 text-center text-transumee-900">Upload Your Resume</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-transumee-900">Full Name</Label>
            <Input 
              id="name" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl border-transumee-200 focus-visible:ring-transumee-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-transumee-900">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="john@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border-transumee-200 focus-visible:ring-transumee-600"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cv-upload" className="text-transumee-900">Upload CV (PDF/DOC)</Label>
          <div className="border-2 border-dashed border-transumee-200 rounded-xl p-4 text-center hover:bg-transumee-50 transition-colors cursor-pointer">
            <input
              id="cv-upload"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              required
            />
            <label htmlFor="cv-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-purple-500 mb-2" />
                {file ? (
                  <span className="text-sm font-medium text-transumee-600">{file.name}</span>
                ) : (
                  <>
                    <span className="text-sm font-medium text-transumee-900">Click to upload your file</span>
                    <span className="text-xs text-transumee-900/70 mt-1">Supports PDF, DOC, TXT up to 10MB</span>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country" className="text-transumee-900">Target Country (Resume will be translated to local language)</Label>
          <Select required value={country} onValueChange={setCountry}>
            <SelectTrigger id="country" className="rounded-xl border-transumee-200 focus:ring-transumee-600">
              <SelectValue placeholder="Select target country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usa">United States (English)</SelectItem>
              <SelectItem value="uk">United Kingdom (English)</SelectItem>
              <SelectItem value="canada">Canada (English)</SelectItem>
              <SelectItem value="australia">Australia (English)</SelectItem>
              <SelectItem value="germany">Germany (German)</SelectItem>
              <SelectItem value="france">France (French)</SelectItem>
              <SelectItem value="spain">Spain (Spanish)</SelectItem>
              <SelectItem value="italy">Italy (Italian)</SelectItem>
              <SelectItem value="portugal">Portugal (Portuguese)</SelectItem>
              <SelectItem value="netherlands">Netherlands (Dutch)</SelectItem>
              <SelectItem value="sweden">Sweden (Swedish)</SelectItem>
              <SelectItem value="poland">Poland (Polish)</SelectItem>
              
              {/* Adding Asian countries */}
              <SelectItem value="japan">Japan (Japanese)</SelectItem>
              <SelectItem value="china">China (Chinese)</SelectItem>
              <SelectItem value="korea">South Korea (Korean)</SelectItem>
              <SelectItem value="india">India (English)</SelectItem>
              <SelectItem value="singapore">Singapore (English)</SelectItem>
              <SelectItem value="malaysia">Malaysia (English)</SelectItem>
              <SelectItem value="thailand">Thailand (Thai)</SelectItem>
              <SelectItem value="vietnam">Vietnam (Vietnamese)</SelectItem>
              <SelectItem value="philippines">Philippines (Filipino/English)</SelectItem>
              <SelectItem value="indonesia">Indonesia (Indonesian)</SelectItem>
              
              <SelectItem value="other">Other (English)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-transumee-600 to-purple-500 hover:from-transumee-700 hover:to-purple-600 text-white rounded-full py-4 text-base font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Translate & Upgrade My Resume"}
        </Button>
        
        <p className="text-center text-xs text-transumee-900/70">
          You'll receive your upgraded resume within 1 minute
        </p>
      </form>
    </div>
  );
};

export default FormView;
