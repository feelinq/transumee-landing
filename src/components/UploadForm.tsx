
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UploadForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [country, setCountry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "Your resume has been uploaded. We'll send your translated version shortly.",
      });
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setFile(null);
      setCountry('');
      // Reset the file input
      const fileInput = document.getElementById('cv-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }, 1500);
  };

  return (
    <div id="upload-form" className="flex-1">
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
                accept=".pdf,.doc,.docx"
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
                      <span className="text-xs text-transumee-900/70 mt-1">Supports PDF, DOC up to 10MB</span>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country" className="text-transumee-900">Target Country</Label>
            <Select required value={country} onValueChange={setCountry}>
              <SelectTrigger id="country" className="rounded-xl border-transumee-200 focus:ring-transumee-600">
                <SelectValue placeholder="Select target country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usa">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="france">France</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
                <SelectItem value="other">Other EU Country</SelectItem>
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
    </div>
  );
};

export default UploadForm;
