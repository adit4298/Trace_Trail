import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        database="tracetrail",
        user="postgres",
        password="May#!Mon05"  # ← Replace with your actual password
    )
    print("✅ SUCCESS: Connected to TraceTrail database!")
    
    # Test by creating a cursor
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    db_version = cursor.fetchone()
    print(f"✅ PostgreSQL Version: {db_version[0]}")
    
    cursor.execute("SELECT current_database();")
    db_name = cursor.fetchone()
    print(f"✅ Current Database: {db_name[0]}")
    
    cursor.close()
    conn.close()
    print("✅ Connection closed properly.")
    
except Exception as e:
    print(f"❌ ERROR: {e}")