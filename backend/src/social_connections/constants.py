# Supported platforms
SUPPORTED_PLATFORMS = [
    "facebook",
    "instagram",
    "twitter",
    "linkedin",
    "tiktok",
    "snapchat",
]

# Platform risk profiles (for demo purposes)
PLATFORM_RISK_PROFILES = {
    "facebook": {
        "base_risk": 1.0,
        "data_categories": ["profile", "posts", "friends", "photos", "location"],
    },
    "instagram": {
        "base_risk": 0.85,
        "data_categories": ["profile", "posts", "followers", "photos", "stories"],
    },
    "twitter": {
        "base_risk": 0.75,
        "data_categories": ["profile", "tweets", "followers", "likes"],
    },
    "linkedin": {
        "base_risk": 0.50,
        "data_categories": ["profile", "connections", "work_history"],
    },
    "tiktok": {
        "base_risk": 0.90,
        "data_categories": ["profile", "videos", "followers", "location"],
    },
    "snapchat": {
        "base_risk": 0.80,
        "data_categories": ["profile", "snaps", "friends", "location"],
    },
}
