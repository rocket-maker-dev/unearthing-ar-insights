-- Add imagen_url column to yacimientos
ALTER TABLE public.yacimientos ADD COLUMN imagen_url text DEFAULT NULL;

-- Create storage bucket for yacimiento images
INSERT INTO storage.buckets (id, name, public) VALUES ('yacimiento-images', 'yacimiento-images', true);

-- Allow anyone to upload images
CREATE POLICY "Anyone can upload yacimiento images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'yacimiento-images');

-- Allow anyone to view yacimiento images
CREATE POLICY "Anyone can view yacimiento images"
ON storage.objects FOR SELECT
USING (bucket_id = 'yacimiento-images');