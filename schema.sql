CREATE TABLE IF NOT EXISTS tools (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    icon TEXT,
    category TEXT,
    path TEXT,
    isNew BOOLEAN,
    isOffline BOOLEAN
);

CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY,
    user TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    type TEXT,
    date TEXT,
    status TEXT
);

CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    date TEXT,
    content TEXT,
    color TEXT,
    isActive BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
);
