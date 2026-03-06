-- Create table for archaeological sites
CREATE TABLE public.yacimientos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  ubicacion TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL,
  fecha_descubrimiento TEXT,
  coordenadas_lat DOUBLE PRECISION,
  coordenadas_lng DOUBLE PRECISION,
  estado TEXT DEFAULT 'pendiente',
  contacto_email TEXT,
  contacto_nombre TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.yacimientos ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Anyone can submit yacimientos" ON public.yacimientos
  FOR INSERT WITH CHECK (true);

-- Anyone can read
CREATE POLICY "Anyone can view yacimientos" ON public.yacimientos
  FOR SELECT USING (true);