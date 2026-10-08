-- Remove test sellers created during testing.
-- BoatListing and Sale rows cascade; these sellers own no Boat rows (Boat FK is RESTRICT).
DELETE FROM `Seller` WHERE `email` IN ('test@gmail.com', 'admin@example.com');
