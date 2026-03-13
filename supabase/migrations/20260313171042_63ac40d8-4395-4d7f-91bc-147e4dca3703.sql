
-- Table for rich content items (images, 3D models, info panels) linked to yacimientos
CREATE TABLE public.yacimiento_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  yacimiento_id uuid REFERENCES public.yacimientos(id) ON DELETE CASCADE NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('imagen', 'modelo_3d', 'panel_info', 'video')),
  titulo text NOT NULL,
  descripcion text,
  archivo_url text,
  thumbnail_url text,
  orden integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.yacimiento_items ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view yacimiento items"
ON public.yacimiento_items FOR SELECT
TO public
USING (true);

-- Public insert
CREATE POLICY "Anyone can submit yacimiento items"
ON public.yacimiento_items FOR INSERT
TO public
WITH CHECK (true);

-- Add a website URL field to yacimientos
ALTER TABLE public.yacimientos ADD COLUMN IF NOT EXISTS website_url text;
