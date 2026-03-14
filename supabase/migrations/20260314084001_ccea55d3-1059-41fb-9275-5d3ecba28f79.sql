-- Allow authenticated users to also SELECT yacimientos
CREATE POLICY "Authenticated can view yacimientos"
ON public.yacimientos
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to also SELECT yacimiento_items
CREATE POLICY "Authenticated can view yacimiento items"
ON public.yacimiento_items
FOR SELECT
TO authenticated
USING (true);