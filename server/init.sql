-- init.sql (Git)

CREATE TABLE IF NOT EXISTS ads (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2),
    image_url TEXT,
    city TEXT,
    district TEXT,
    category TEXT,
    condition TEXT,
    is_active BOOLEAN DEFAULT true,
    telegram_user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);