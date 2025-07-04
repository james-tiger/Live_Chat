-- Remove all existing rooms except General
DELETE FROM public.room_members WHERE room_id NOT IN (
  SELECT id FROM public.rooms WHERE name = 'General'
);

DELETE FROM public.messages WHERE room_id NOT IN (
  SELECT id FROM public.rooms WHERE name = 'General'
);

DELETE FROM public.typing_indicators WHERE room_id NOT IN (
  SELECT id FROM public.rooms WHERE name = 'General'
);

DELETE FROM public.rooms WHERE name != 'General';

-- Ensure we have exactly one General room
INSERT INTO public.rooms (name, type) 
SELECT 'General', 'public'
WHERE NOT EXISTS (SELECT 1 FROM public.rooms WHERE name = 'General');

-- Remove room creation policies - users shouldn't create new rooms
DROP POLICY IF EXISTS "Authenticated users can create rooms" ON public.rooms;

-- Remove room member insertion policy
DROP POLICY IF EXISTS "Room creators can add members" ON public.room_members;