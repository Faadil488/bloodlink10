GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

DROP POLICY IF EXISTS "Users can create SOS requests" ON public.blood_requests;
CREATE POLICY "Users can create complete SOS requests"
ON public.blood_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(trim(requester_name)) BETWEEN 2 AND 120
  AND char_length(trim(phone)) BETWEEN 7 AND 20
  AND char_length(trim(district)) BETWEEN 2 AND 80
  AND char_length(trim(hospital)) BETWEEN 2 AND 160
  AND (notes IS NULL OR char_length(notes) <= 1000)
);