# Smart Caching Strategy for Recipe API

**Last Updated:** November 10, 2025
**Application:** Recipe Hub (recipe.vladbortnik.dev)
**Repository:** https://github.com/vladbortnik/recipe-web-app

---

## Executive Summary

Recipe Hub currently makes expensive API calls to Azure Computer Vision and Spoonacular on every request, resulting in:
- **High costs**: $0.01-0.05 per Azure AI call, Spoonacular rate limits
- **Slow responses**: 2-5 seconds per recipe generation
- **Server load**: All processing happens on 2GB DigitalOcean droplet

This guide presents two smart caching solutions to reduce costs by 50-80% and improve response times by 40-100x.

### Current State Analysis

**Repository Analysis:**
- Flask 3.0+ backend with PostgreSQL 13+
- Azure Computer Vision API for ingredient recognition
- Spoonacular API for recipe recommendations
- **NO caching layer currently implemented**
- Cloudflare proxy already in place

**Pain Points:**
1. Identical ingredient combinations trigger duplicate Azure AI calls
2. Same recipe queries hit Spoonacular repeatedly
3. 2-5 second response times hurt user experience
4. API costs scale linearly with traffic

---

## What is Smart Caching?

Smart caching stores API responses based on request parameters, serving cached results for duplicate queries instead of making expensive external API calls.

### Key Concepts

**Cache Key Strategy:**
- Hash of request parameters (ingredients, preferences, filters)
- Example: `recipe:gen:md5(chicken,tomato,garlic):vegan:italian`

**Time-to-Live (TTL):**
- How long cached data remains valid before expiring
- Balance between freshness and cost savings

**Cache Invalidation:**
- Removing or updating stale cached data
- Automatic (TTL expiration) or manual (admin trigger)

**Hit Rate:**
- Percentage of requests served from cache
- 50-80% hit rate is typical for recipe apps

---

## Implementation Options Comparison

| Feature | Option A: Cloudflare Workers + KV | Option B: Flask + Redis |
|---------|-----------------------------------|------------------------|
| **Deployment Location** | Edge (200+ global datacenters) | Origin server (single location) |
| **Setup Complexity** | Medium (3-5 hours) | Low (1-2 hours) |
| **Response Time (cache hit)** | 10-50ms (global) | 1-10ms (but requires server hit) |
| **Server Load Reduction** | 90%+ (most requests never hit origin) | 0% (all requests hit server) |
| **Storage Limits** | 1GB (free tier), 10GB (paid) | Limited by server RAM (2GB total) |
| **Cost** | Free tier: 100k reads/day, 1k writes/day | Requires RAM on existing server |
| **Consistency** | Eventual (60s propagation) | Immediate |
| **Persistence** | Durable (replicated globally) | Volatile (lost on restart) |
| **Cache Invalidation** | API-based purge | Direct control |
| **Learning Curve** | New technology (Wrangler CLI, KV API) | Familiar (Python decorator) |
| **Best For** | Global traffic, high scale | Quick start, simple setup |

### Recommendation

**Start with Option B (Flask + Redis)** for these reasons:
1. Faster implementation (1-2 hours vs 3-5 hours)
2. Immediate consistency (no propagation delays)
3. Easier debugging and monitoring
4. Natural integration with existing Flask app
5. Full control over caching logic

**Migrate to Option A (Cloudflare Workers)** when:
- Serving global users (Asia, Europe, etc.)
- Traffic exceeds 10k requests/day
- Server resources become constrained
- Need 99.9% uptime with edge redundancy

---

## Option A: Cloudflare Workers + KV Storage

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      User Request                           │
│                 recipe.vladbortnik.dev                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  Cloudflare Worker    │  ◄── Edge Location (Global)
            │  (200+ Datacenters)   │
            └───────────┬───────────┘
                        │
                ┌───────┴───────┐
                │               │
                ▼               ▼
        ┌──────────────┐  ┌──────────────┐
        │  KV Storage  │  │ Origin Server│
        │  (Cache Hit) │  │ (Cache Miss) │
        └──────────────┘  └──────────────┘
             10-50ms          2-5 seconds
```

### Installation & Setup

**Prerequisites:**
- Cloudflare account (free tier works)
- Node.js 18+ installed
- Wrangler CLI

**Step 1: Install Wrangler CLI**

```bash
# Install globally
npm install -g wrangler

# Or use npx (no install needed)
npx wrangler --version
```

**Step 2: Create Worker Project**

```bash
# Create new directory for worker
mkdir recipe-cache-worker
cd recipe-cache-worker

# Initialize new worker
wrangler init

# Follow prompts:
# - Name: recipe-cache-worker
# - Template: TypeScript or JavaScript (choose JavaScript for simplicity)
```

**Step 3: Create KV Namespace**

```bash
# Create production KV namespace
wrangler kv:namespace create "RECIPE_CACHE"

# Create preview namespace for testing
wrangler kv:namespace create "RECIPE_CACHE" --preview

# Output will give you namespace IDs - save these!
```

**Step 4: Configure wrangler.toml**

```toml
name = "recipe-cache-worker"
main = "src/index.js"
compatibility_date = "2025-11-10"

# KV namespace bindings
kv_namespaces = [
  { binding = "RECIPE_CACHE", id = "your_namespace_id_here", preview_id = "your_preview_id_here" }
]

# Route configuration
routes = [
  { pattern = "recipe.vladbortnik.dev/api/*", zone_name = "vladbortnik.dev" }
]
```

### Worker Code Implementation

**File: `src/index.js`**

```javascript
/**
 * Cloudflare Worker for Recipe API Caching
 * Caches Azure AI and Spoonacular API responses at the edge
 */

// Cache TTL configurations (in seconds)
const CACHE_TTL = {
  RECIPE_GENERATION: 86400,    // 24 hours - AI results are deterministic
  SPOONACULAR_SEARCH: 21600,   // 6 hours - recipe database is stable
  SPOONACULAR_DETAILS: 43200,  // 12 hours - individual recipes rarely change
  INGREDIENT_RECOGNITION: 604800 // 7 days - same image = same ingredients
};

/**
 * Main worker entry point
 */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Handle incoming requests with caching logic
 */
async function handleRequest(request) {
  const url = new URL(request.url);

  // Only cache GET requests
  if (request.method !== 'GET') {
    return fetch(request);
  }

  // Generate cache key based on endpoint and parameters
  const cacheKey = await generateCacheKey(url);

  // Check KV storage for cached response
  const cachedResponse = await RECIPE_CACHE.get(cacheKey, { type: 'json' });

  if (cachedResponse) {
    console.log(`Cache HIT: ${cacheKey}`);
    return new Response(JSON.stringify(cachedResponse.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'HIT',
        'X-Cache-Key': cacheKey,
        'X-Cache-Age': Math.floor((Date.now() - cachedResponse.timestamp) / 1000),
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  console.log(`Cache MISS: ${cacheKey}`);

  // Fetch from origin server
  const originResponse = await fetch(request);

  // Only cache successful responses
  if (originResponse.ok) {
    const responseData = await originResponse.clone().json();

    // Store in KV with appropriate TTL
    const ttl = getTTLForEndpoint(url.pathname);
    await RECIPE_CACHE.put(
      cacheKey,
      JSON.stringify({
        data: responseData,
        timestamp: Date.now(),
        url: url.href
      }),
      { expirationTtl: ttl }
    );
  }

  // Add cache status header
  const modifiedResponse = new Response(originResponse.body, originResponse);
  modifiedResponse.headers.set('X-Cache', 'MISS');
  modifiedResponse.headers.set('X-Cache-Key', cacheKey);

  return modifiedResponse;
}

/**
 * Generate cache key from URL and parameters
 */
async function generateCacheKey(url) {
  const endpoint = url.pathname;
  const params = new URLSearchParams(url.search);

  // Sort parameters for consistency
  const sortedParams = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // Generate hash for long parameter strings
  const keyString = `${endpoint}:${sortedParams}`;
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(keyString)
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return `recipe:${hashHex}`;
}

/**
 * Determine TTL based on endpoint
 */
function getTTLForEndpoint(pathname) {
  if (pathname.includes('/api/recipe/generate')) {
    return CACHE_TTL.RECIPE_GENERATION;
  }
  if (pathname.includes('/api/spoonacular/search')) {
    return CACHE_TTL.SPOONACULAR_SEARCH;
  }
  if (pathname.includes('/api/spoonacular/recipe/')) {
    return CACHE_TTL.SPOONACULAR_DETAILS;
  }
  if (pathname.includes('/api/ingredients/recognize')) {
    return CACHE_TTL.INGREDIENT_RECOGNITION;
  }

  // Default TTL for unknown endpoints
  return 3600; // 1 hour
}
```

### Advanced Features: Cache Invalidation

**File: `src/admin.js` (add to worker)**

```javascript
/**
 * Admin endpoint for cache management
 * POST /api/admin/cache/clear?key=recipe:xyz
 * POST /api/admin/cache/clear-all
 */
async function handleAdminRequest(request, url) {
  // Verify admin token from request header
  const adminToken = request.headers.get('X-Admin-Token');
  if (adminToken !== ADMIN_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const action = url.pathname;

  if (action.endsWith('/clear')) {
    const key = url.searchParams.get('key');
    if (!key) {
      return new Response('Missing key parameter', { status: 400 });
    }

    await RECIPE_CACHE.delete(key);
    return new Response(JSON.stringify({ cleared: key }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (action.endsWith('/clear-all')) {
    // Note: KV doesn't support clearing all keys directly
    // You need to track keys separately or iterate through list_keys
    const listResult = await RECIPE_CACHE.list({ prefix: 'recipe:' });
    const deletionPromises = listResult.keys.map(key => RECIPE_CACHE.delete(key.name));
    await Promise.all(deletionPromises);

    return new Response(JSON.stringify({
      cleared: listResult.keys.length,
      message: 'Cache cleared successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Unknown action', { status: 400 });
}
```

### Deployment

```bash
# Test locally
wrangler dev

# Deploy to production
wrangler deploy

# View logs
wrangler tail
```

### Monitoring Cache Performance

```bash
# Check KV storage usage
wrangler kv:key list --namespace-id=your_namespace_id_here --prefix=recipe:

# Get specific cached value
wrangler kv:key get "recipe:abc123" --namespace-id=your_namespace_id_here

# Delete specific key
wrangler kv:key delete "recipe:abc123" --namespace-id=your_namespace_id_here
```

---

## Option B: Flask + Redis (Recommended)

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      User Request                           │
│                 recipe.vladbortnik.dev                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   Cloudflare Proxy    │
            └───────────┬───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │    Nginx (Reverse     │
            │       Proxy)          │
            └───────────┬───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │    Flask App          │
            │  (Gunicorn Worker)    │
            └───────┬───────────────┘
                    │
            ┌───────┴───────┐
            │               │
            ▼               ▼
    ┌──────────────┐  ┌──────────────┐
    │ Redis Cache  │  │  PostgreSQL  │
    │  (1-10ms)    │  │   Database   │
    └──────────────┘  └──────────────┘
```

### Installation & Setup

**Step 1: Install Redis on DigitalOcean Droplet**

```bash
# SSH into your server
ssh root@your-server-ip

# Update package list
sudo apt update

# Install Redis
sudo apt install redis-server -y

# Configure Redis for production
sudo nano /etc/redis/redis.conf
```

**Redis Configuration Changes:**

```conf
# /etc/redis/redis.conf

# Limit memory usage (leave RAM for Flask/PostgreSQL)
maxmemory 512mb
maxmemory-policy allkeys-lru  # Evict least recently used keys

# Disable persistence (cache data doesn't need to survive restarts)
save ""
appendonly no

# Listen only on localhost (security)
bind 127.0.0.1 ::1

# Enable Unix socket for faster communication
unixsocket /var/run/redis/redis.sock
unixsocketperm 770
```

**Step 2: Restart Redis and Enable on Boot**

```bash
# Restart Redis with new configuration
sudo systemctl restart redis-server

# Enable Redis to start on boot
sudo systemctl enable redis-server

# Verify Redis is running
sudo systemctl status redis-server

# Test Redis connection
redis-cli ping
# Should return: PONG
```

**Step 3: Add Redis User to www-data Group**

```bash
# Add www-data user to redis group (for Unix socket access)
sudo usermod -a -G redis www-data

# Restart application server
sudo systemctl restart recipe-app  # Adjust service name as needed
```

### Flask Application Integration

**Step 1: Install Python Dependencies**

```bash
# Navigate to your Flask app directory
cd /var/www/recipe.vladbortnik.dev

# Activate virtual environment
source venv/bin/activate

# Install Flask-Caching and Redis client
pip install Flask-Caching redis

# Freeze requirements
pip freeze > requirements.txt
```

**Step 2: Update Flask Configuration**

**File: `config.py`**

```python
import os
from datetime import timedelta

class Config:
    # Existing configuration...
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

    # Redis Cache Configuration
    CACHE_TYPE = 'redis'
    CACHE_REDIS_HOST = 'localhost'
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 0
    CACHE_REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    CACHE_DEFAULT_TIMEOUT = 3600  # 1 hour default

    # Alternative: Use Unix socket for better performance
    # CACHE_REDIS_URL = 'unix:///var/run/redis/redis.sock'

    # Cache key prefix to avoid conflicts
    CACHE_KEY_PREFIX = 'recipe_hub_'

class ProductionConfig(Config):
    DEBUG = False
    CACHE_DEFAULT_TIMEOUT = 21600  # 6 hours in production

class DevelopmentConfig(Config):
    DEBUG = True
    CACHE_DEFAULT_TIMEOUT = 300  # 5 minutes in development
```

**Step 3: Initialize Cache in Flask App**

**File: `app/__init__.py`**

```python
from flask import Flask
from flask_caching import Cache
from config import Config

# Initialize cache
cache = Cache()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    cache.init_app(app)

    # Register blueprints
    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
```

### Implementing Cached Endpoints

**File: `app/api/routes.py`**

```python
from flask import Blueprint, request, jsonify
from app import cache
import hashlib
import json

bp = Blueprint('api', __name__)

def make_cache_key(*args, **kwargs):
    """
    Generate cache key from request arguments
    Ensures consistent keys for identical requests
    """
    # Get all request arguments
    request_data = {
        'args': dict(request.args),
        'json': request.get_json(silent=True) or {},
        'endpoint': request.endpoint
    }

    # Sort and serialize for consistency
    key_string = json.dumps(request_data, sort_keys=True)

    # Hash for shorter keys
    key_hash = hashlib.md5(key_string.encode()).hexdigest()

    return f"endpoint:{request.endpoint}:{key_hash}"


@bp.route('/recipe/generate', methods=['POST'])
@cache.cached(timeout=86400, make_cache_key=make_cache_key)  # 24 hours
def generate_recipe():
    """
    Generate recipe from ingredients using Azure AI
    Cached for 24 hours (deterministic results)
    """
    data = request.get_json()
    ingredients = data.get('ingredients', [])
    dietary_prefs = data.get('dietary', [])
    cuisine = data.get('cuisine', 'any')

    # Sort ingredients for cache consistency
    ingredients = sorted([i.lower().strip() for i in ingredients])

    try:
        # Call Azure AI API (expensive, 2-5 seconds)
        recipe_result = call_azure_ai_api(ingredients, dietary_prefs, cuisine)

        return jsonify({
            'success': True,
            'recipe': recipe_result,
            'cached': False,  # First request
            'source': 'azure_ai'
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/spoonacular/search', methods=['GET'])
@cache.cached(timeout=21600, query_string=True)  # 6 hours
def search_recipes():
    """
    Search Spoonacular API for recipes
    Cached for 6 hours (database is stable)
    """
    query = request.args.get('query', '')
    cuisine = request.args.get('cuisine', '')
    diet = request.args.get('diet', '')
    number = request.args.get('number', 10, type=int)

    try:
        # Call Spoonacular API (costs money, rate limited)
        results = call_spoonacular_search(
            query=query,
            cuisine=cuisine,
            diet=diet,
            number=number
        )

        return jsonify({
            'success': True,
            'results': results,
            'cached': False,
            'source': 'spoonacular'
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/spoonacular/recipe/<int:recipe_id>', methods=['GET'])
@cache.cached(timeout=43200)  # 12 hours
def get_recipe_details(recipe_id):
    """
    Get detailed recipe information from Spoonacular
    Cached for 12 hours (individual recipes rarely change)
    """
    try:
        recipe = call_spoonacular_recipe_details(recipe_id)

        return jsonify({
            'success': True,
            'recipe': recipe,
            'cached': False,
            'source': 'spoonacular'
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/ingredients/recognize', methods=['POST'])
@cache.cached(timeout=604800, make_cache_key=make_cache_key)  # 7 days
def recognize_ingredients():
    """
    Identify ingredients from uploaded image using Azure Vision
    Cached for 7 days (same image = same result)
    """
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image provided'}), 400

    image = request.files['image']

    # For caching, we need to hash the image content
    # Note: This reads the entire image into memory
    image_data = image.read()
    image_hash = hashlib.sha256(image_data).hexdigest()

    # Check cache manually with image hash as key
    cache_key = f"ingredient_recognition:{image_hash}"
    cached_result = cache.get(cache_key)

    if cached_result:
        return jsonify({
            'success': True,
            'ingredients': cached_result,
            'cached': True,
            'source': 'cache'
        }), 200

    try:
        # Call Azure Computer Vision API (expensive)
        ingredients = call_azure_vision_api(image_data)

        # Cache the result
        cache.set(cache_key, ingredients, timeout=604800)

        return jsonify({
            'success': True,
            'ingredients': ingredients,
            'cached': False,
            'source': 'azure_vision'
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
```

### Advanced Caching: Custom Decorator

**File: `app/utils/cache_utils.py`**

```python
from functools import wraps
from flask import request, jsonify
from app import cache
import hashlib
import json

def smart_cache(timeout=3600, key_func=None, unless=None):
    """
    Smart caching decorator with custom logic

    Args:
        timeout: Cache TTL in seconds
        key_func: Custom function to generate cache key
        unless: Function that returns True to skip caching
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check if caching should be skipped
            if unless and unless():
                return f(*args, **kwargs)

            # Generate cache key
            if key_func:
                cache_key = key_func()
            else:
                cache_key = _default_cache_key(f.__name__)

            # Try to get from cache
            cached_response = cache.get(cache_key)
            if cached_response:
                # Add cache metadata
                if isinstance(cached_response, dict):
                    cached_response['_cached'] = True
                    cached_response['_cache_key'] = cache_key
                return jsonify(cached_response)

            # Execute function
            response = f(*args, **kwargs)

            # Cache successful responses
            if response.status_code == 200:
                cache.set(cache_key, response.get_json(), timeout=timeout)

            return response

        return decorated_function
    return decorator


def _default_cache_key(func_name):
    """Generate default cache key from request"""
    request_data = {
        'func': func_name,
        'args': dict(request.args),
        'json': request.get_json(silent=True) or {},
        'path': request.path
    }
    key_string = json.dumps(request_data, sort_keys=True)
    key_hash = hashlib.md5(key_string.encode()).hexdigest()
    return f"{func_name}:{key_hash}"


def cache_key_with_user():
    """Generate cache key that includes user ID"""
    from flask_login import current_user
    user_id = current_user.id if current_user.is_authenticated else 'anonymous'

    request_data = {
        'user': user_id,
        'args': dict(request.args),
        'json': request.get_json(silent=True) or {},
        'path': request.path
    }
    key_string = json.dumps(request_data, sort_keys=True)
    return hashlib.md5(key_string.encode()).hexdigest()


def skip_cache_if_authenticated():
    """Skip caching for authenticated users"""
    from flask_login import current_user
    return current_user.is_authenticated
```

**Usage Example:**

```python
from app.utils.cache_utils import smart_cache, cache_key_with_user, skip_cache_if_authenticated

@bp.route('/user/recommendations', methods=['GET'])
@smart_cache(
    timeout=1800,  # 30 minutes
    key_func=cache_key_with_user,
    unless=skip_cache_if_authenticated
)
def get_user_recommendations():
    """Personalized recommendations with user-specific caching"""
    # Implementation...
    pass
```

### Cache Invalidation API

**File: `app/api/admin.py`**

```python
from flask import Blueprint, request, jsonify
from app import cache
from app.decorators import admin_required  # Your existing auth decorator

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/cache/clear', methods=['POST'])
@admin_required
def clear_cache():
    """
    Clear specific cache entries or entire cache

    POST /api/admin/cache/clear
    {
        "pattern": "recipe:*",  // Redis key pattern (optional)
        "key": "specific_key"   // Specific key to clear (optional)
    }
    """
    data = request.get_json()

    if 'key' in data:
        # Clear specific key
        result = cache.delete(data['key'])
        return jsonify({
            'success': True,
            'message': f"Cleared cache key: {data['key']}",
            'result': result
        }), 200

    if 'pattern' in data:
        # Clear keys matching pattern
        # Note: Requires direct Redis access
        import redis
        r = redis.from_url(current_app.config['CACHE_REDIS_URL'])
        keys = r.keys(data['pattern'])

        if keys:
            r.delete(*keys)
            return jsonify({
                'success': True,
                'message': f"Cleared {len(keys)} keys matching pattern",
                'count': len(keys)
            }), 200
        else:
            return jsonify({
                'success': True,
                'message': 'No keys found matching pattern',
                'count': 0
            }), 200

    # Clear entire cache
    cache.clear()
    return jsonify({
        'success': True,
        'message': 'Entire cache cleared'
    }), 200


@admin_bp.route('/cache/stats', methods=['GET'])
@admin_required
def cache_stats():
    """
    Get cache statistics

    GET /api/admin/cache/stats
    """
    import redis
    r = redis.from_url(current_app.config['CACHE_REDIS_URL'])

    # Get Redis info
    info = r.info('stats')
    memory = r.info('memory')

    # Get key counts by prefix
    recipe_keys = len(r.keys('recipe_hub_endpoint:recipe:*'))
    spoonacular_keys = len(r.keys('recipe_hub_endpoint:spoonacular:*'))
    ingredient_keys = len(r.keys('recipe_hub_ingredient_recognition:*'))

    return jsonify({
        'success': True,
        'stats': {
            'total_keys': r.dbsize(),
            'memory_used_mb': round(memory['used_memory'] / 1024 / 1024, 2),
            'memory_peak_mb': round(memory['used_memory_peak'] / 1024 / 1024, 2),
            'hit_rate': calculate_hit_rate(info),
            'keys_by_type': {
                'recipe_generation': recipe_keys,
                'spoonacular': spoonacular_keys,
                'ingredient_recognition': ingredient_keys
            }
        }
    }), 200


def calculate_hit_rate(stats):
    """Calculate cache hit rate percentage"""
    hits = stats.get('keyspace_hits', 0)
    misses = stats.get('keyspace_misses', 0)
    total = hits + misses

    if total == 0:
        return 0.0

    return round((hits / total) * 100, 2)
```

### Environment Variables

**Add to `.env` file:**

```bash
# Redis Configuration
REDIS_URL=redis://localhost:6379/0
# Or use Unix socket for better performance:
# REDIS_URL=unix:///var/run/redis/redis.sock

# Cache Configuration
CACHE_DEFAULT_TIMEOUT=21600  # 6 hours
```

### Restart Application

```bash
# Restart Gunicorn/Flask application
sudo systemctl restart recipe-app

# Check logs
sudo journalctl -u recipe-app -f

# Verify Redis connectivity from Flask
redis-cli monitor
# Then make a request to your app and watch Redis commands
```

---

## Cache TTL Recommendations

### TTL Strategy Matrix

| Endpoint | Data Type | TTL | Reasoning |
|----------|-----------|-----|-----------|
| `/api/recipe/generate` | Azure AI Recipe Generation | **24 hours** | Deterministic results (same ingredients = same output) |
| `/api/spoonacular/search` | Recipe Search Results | **6 hours** | Database updates infrequently, search results stable |
| `/api/spoonacular/recipe/<id>` | Individual Recipe Details | **12 hours** | Recipe content rarely changes |
| `/api/ingredients/recognize` | Image Recognition | **7 days** | Same image always produces same ingredients |
| `/api/user/favorites` | User Preferences | **30 minutes** | User-specific, changes moderately |
| `/api/nutrition/calculate` | Nutrition Data | **24 hours** | Calculation is deterministic |

### Dynamic TTL Based on Popularity

```python
def get_dynamic_ttl(cache_key, base_ttl=3600):
    """
    Adjust TTL based on access frequency
    Popular items stay cached longer
    """
    access_count = cache.get(f"{cache_key}:count") or 0

    # Increase TTL for popular items
    if access_count > 100:
        return base_ttl * 4  # 4x longer
    elif access_count > 50:
        return base_ttl * 2  # 2x longer
    else:
        return base_ttl  # Normal TTL
```

---

## Cache Key Strategies

### 1. Simple Query String Caching

```python
@cache.cached(timeout=3600, query_string=True)
def search_recipes():
    # Automatically creates key from query parameters
    # ?query=chicken&cuisine=italian -> unique key
    pass
```

### 2. Custom Hash-Based Keys

```python
import hashlib
import json

def make_ingredient_cache_key():
    """Create cache key from sorted ingredients list"""
    data = request.get_json()
    ingredients = sorted([i.lower().strip() for i in data.get('ingredients', [])])
    dietary = sorted(data.get('dietary', []))

    key_data = {
        'ingredients': ingredients,
        'dietary': dietary,
        'cuisine': data.get('cuisine', 'any')
    }

    key_string = json.dumps(key_data, sort_keys=True)
    key_hash = hashlib.md5(key_string.encode()).hexdigest()

    return f"recipe:gen:{key_hash}"
```

### 3. User-Specific Caching

```python
def make_user_cache_key():
    """Include user ID in cache key for personalized data"""
    from flask_login import current_user
    user_id = current_user.id if current_user.is_authenticated else 'anonymous'

    data = request.get_json()
    key_data = {
        'user': user_id,
        'data': data
    }

    key_string = json.dumps(key_data, sort_keys=True)
    return hashlib.md5(key_string.encode()).hexdigest()
```

### 4. Image-Based Caching

```python
def make_image_cache_key(image_data):
    """Create cache key from image content hash"""
    image_hash = hashlib.sha256(image_data).hexdigest()
    return f"image:recognition:{image_hash}"
```

### 5. Versioned Cache Keys

```python
CACHE_VERSION = 'v2'  # Increment when API response format changes

def make_versioned_cache_key():
    """Include version in cache key to invalidate on schema changes"""
    base_key = make_cache_key()
    return f"{CACHE_VERSION}:{base_key}"
```

---

## Cost Savings Analysis

### Current State (No Caching)

**Assumptions:**
- 1,000 recipe generation requests/day
- 500 Spoonacular API calls/day
- 200 ingredient recognition requests/day

**Monthly Costs:**
- Azure AI (recipe generation): 1,000 req/day × $0.03/req × 30 days = **$900/month**
- Spoonacular API: 500 calls/day × $0.002/call × 30 days = **$30/month**
- Azure Vision (ingredients): 200 req/day × $0.01/req × 30 days = **$60/month**

**Total: $990/month**

### With Caching (60% Hit Rate)

**Cache Hit Scenarios:**
- 60% of requests served from cache (no API call)
- 40% of requests miss cache (call external API)

**Monthly Costs:**
- Azure AI: 400 req/day × $0.03/req × 30 days = **$360/month** (save $540)
- Spoonacular: 200 calls/day × $0.002/call × 30 days = **$12/month** (save $18)
- Azure Vision: 80 req/day × $0.01/req × 30 days = **$24/month** (save $36)

**Total: $396/month**

**Savings: $594/month (60% reduction)**

### With Caching (80% Hit Rate - Realistic After Warm-Up)

**Monthly Costs:**
- Azure AI: 200 req/day × $0.03/req × 30 days = **$180/month** (save $720)
- Spoonacular: 100 calls/day × $0.002/call × 30 days = **$6/month** (save $24)
- Azure Vision: 40 req/day × $0.01/req × 30 days = **$12/month** (save $48)

**Total: $198/month**

**Savings: $792/month (80% reduction)**

### Annual Savings Projection

| Scenario | Monthly Cost | Annual Cost | Annual Savings |
|----------|-------------|-------------|----------------|
| No caching | $990 | $11,880 | - |
| 60% hit rate | $396 | $4,752 | **$7,128** |
| 80% hit rate | $198 | $2,376 | **$9,504** |

### Redis Costs

**Option B (Flask + Redis):**
- Redis RAM usage: ~100-200MB (well within 512MB limit)
- Server RAM cost: $0 (using existing 2GB droplet)
- **Total additional cost: $0/month**

**Option A (Cloudflare Workers + KV):**
- Free tier: 100,000 reads/day, 1,000 writes/day
- Estimated usage: 2,000 reads/day, 400 writes/day (well within free tier)
- **Total additional cost: $0/month** (free tier sufficient)

**ROI: Infinite** (savings with $0 additional infrastructure cost)

---

## Performance Improvements

### Response Time Comparison

| Scenario | Response Time | Improvement |
|----------|--------------|-------------|
| **Without Caching** | | |
| Azure AI recipe generation | 2,000-5,000ms | Baseline |
| Spoonacular search | 500-1,500ms | Baseline |
| Ingredient recognition | 1,000-3,000ms | Baseline |
| **With Redis Cache (Option B)** | | |
| Cache hit (local) | 1-10ms | **200-5000x faster** |
| Cache miss + API call | 2,001-5,010ms | +1-10ms overhead |
| **With Cloudflare Workers (Option A)** | | |
| Cache hit (edge) | 10-50ms | **40-500x faster** |
| Cache miss + API call | 2,010-5,050ms | +10-50ms overhead |

### User Experience Impact

**Before Caching:**
- User submits ingredients
- Waits 2-5 seconds for response
- High bounce rate on slow connections

**After Caching (60% hit rate):**
- 60% of users: instant response (< 50ms)
- 40% of users: same 2-5 second wait
- **Average response time: 0.8-2 seconds** (60% improvement)

**After Caching (80% hit rate):**
- 80% of users: instant response
- 20% of users: same 2-5 second wait
- **Average response time: 0.4-1 second** (75% improvement)

### Server Load Reduction

**Without Caching:**
- All 1,700 daily requests hit Flask app
- CPU usage: 40-60% average
- Network egress: ~500MB/day

**With Redis Cache (80% hit rate):**
- 340 requests require external API calls
- CPU usage: 15-25% average (60% reduction)
- Network egress: ~100MB/day (80% reduction)

**With Cloudflare Workers (80% hit rate):**
- Only 340 requests reach origin server
- CPU usage: 10-20% average (75% reduction)
- Network egress: ~80MB/day (84% reduction)
- **Bonus:** 1,360 requests served from edge (never hit origin)

---

## Cache Invalidation Strategies

### 1. Time-Based Expiration (TTL)

**Automatic expiration - no manual intervention needed**

```python
# Redis automatically deletes expired keys
@cache.cached(timeout=86400)  # 24 hours
def generate_recipe():
    pass
```

### 2. Manual Invalidation via Admin API

**Clear specific cache entries**

```bash
# Clear specific cache key
curl -X POST https://recipe.vladbortnik.dev/api/admin/cache/clear \
  -H "X-Admin-Token: your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"key": "recipe_hub_endpoint:recipe:abc123"}'

# Clear all recipe generation cache
curl -X POST https://recipe.vladbortnik.dev/api/admin/cache/clear \
  -H "X-Admin-Token: your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"pattern": "recipe_hub_endpoint:recipe:*"}'

# Clear entire cache
curl -X POST https://recipe.vladbortnik.dev/api/admin/cache/clear \
  -H "X-Admin-Token: your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 3. Event-Driven Invalidation

**Invalidate cache when underlying data changes**

```python
from app import cache

def update_recipe(recipe_id):
    """Update recipe and invalidate related cache"""
    # Update database
    recipe = Recipe.query.get(recipe_id)
    recipe.update(...)
    db.session.commit()

    # Invalidate cache
    cache.delete(f"recipe:{recipe_id}")
    cache.delete_many(
        f"recipe_search:*:{recipe.cuisine}:*",
        f"user:{recipe.user_id}:favorites"
    )
```

### 4. Versioned Cache Keys

**Change cache key format to invalidate all old entries**

```python
# In config.py
CACHE_VERSION = 'v2'  # Increment to invalidate all cache

# In cache key generation
def make_cache_key():
    from flask import current_app
    version = current_app.config['CACHE_VERSION']
    # ... generate base key ...
    return f"{version}:{base_key}"
```

### 5. Conditional Caching

**Skip cache for certain conditions**

```python
def should_skip_cache():
    """Skip cache for admin users or specific query params"""
    from flask_login import current_user

    # Skip for admin users
    if current_user.is_authenticated and current_user.is_admin:
        return True

    # Skip if force_refresh parameter is present
    if request.args.get('force_refresh'):
        return True

    return False

@cache.cached(timeout=3600, unless=should_skip_cache)
def get_data():
    pass
```

### 6. Cache Warming

**Pre-populate cache with popular queries**

```python
def warm_cache():
    """Pre-load cache with popular ingredient combinations"""
    popular_combos = [
        ['chicken', 'rice', 'broccoli'],
        ['pasta', 'tomato', 'basil'],
        ['beef', 'potato', 'carrot']
    ]

    for ingredients in popular_combos:
        # Make request to populate cache
        with app.test_request_context(
            '/api/recipe/generate',
            json={'ingredients': ingredients}
        ):
            generate_recipe()
```

### 7. Gradual Expiration (Cache Stampede Prevention)

**Add jitter to TTL to prevent mass expiration**

```python
import random

def get_jittered_ttl(base_ttl):
    """Add ±10% randomness to prevent cache stampede"""
    jitter = random.uniform(-0.1, 0.1)
    return int(base_ttl * (1 + jitter))

@cache.cached(timeout=get_jittered_ttl(3600))
def expensive_operation():
    pass
```

---

## Testing Commands

### Test Redis Installation

```bash
# Check Redis is running
sudo systemctl status redis-server

# Test connection
redis-cli ping
# Expected output: PONG

# Check memory usage
redis-cli info memory | grep used_memory_human

# Monitor real-time commands
redis-cli monitor

# Check number of keys
redis-cli dbsize

# Get all keys (use with caution in production)
redis-cli keys "recipe_hub_*"

# Get specific key value
redis-cli get "recipe_hub_endpoint:recipe:abc123"

# Check key TTL
redis-cli ttl "recipe_hub_endpoint:recipe:abc123"

# Delete specific key
redis-cli del "recipe_hub_endpoint:recipe:abc123"

# Flush entire cache (DANGEROUS - use only in development)
redis-cli flushdb
```

### Test Flask Cache Integration

**Step 1: Test cache endpoint works**

```bash
# Make request to recipe generation endpoint
curl -X POST https://recipe.vladbortnik.dev/api/recipe/generate \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["chicken", "rice", "broccoli"],
    "dietary": ["gluten-free"],
    "cuisine": "asian"
  }'

# Check response headers for cache status
curl -I -X POST https://recipe.vladbortnik.dev/api/recipe/generate \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["chicken", "rice", "broccoli"],
    "dietary": ["gluten-free"],
    "cuisine": "asian"
  }'
```

**Step 2: Verify cache hit on second request**

```bash
# Monitor Redis while making request
# Terminal 1:
redis-cli monitor

# Terminal 2: Make same request again
curl -X POST https://recipe.vladbortnik.dev/api/recipe/generate \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["chicken", "rice", "broccoli"],
    "dietary": ["gluten-free"],
    "cuisine": "asian"
  }'

# Should see Redis GET command in monitor
# Response should be instant (< 50ms)
```

**Step 3: Measure response time difference**

```bash
# First request (cache miss) - should be slow
time curl -X POST https://recipe.vladbortnik.dev/api/recipe/generate \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["salmon", "lemon", "asparagus"],
    "dietary": [],
    "cuisine": "any"
  }'
# Expected: 2-5 seconds

# Second request (cache hit) - should be fast
time curl -X POST https://recipe.vladbortnik.dev/api/recipe/generate \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["salmon", "lemon", "asparagus"],
    "dietary": [],
    "cuisine": "any"
  }'
# Expected: < 0.1 seconds (100ms)
```

### Test Cache Invalidation

```bash
# Get cache stats before
curl https://recipe.vladbortnik.dev/api/admin/cache/stats \
  -H "X-Admin-Token: your-secret-token"

# Clear specific pattern
curl -X POST https://recipe.vladbortnik.dev/api/admin/cache/clear \
  -H "X-Admin-Token: your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"pattern": "recipe_hub_endpoint:recipe:*"}'

# Verify cache was cleared
curl https://recipe.vladbortnik.dev/api/admin/cache/stats \
  -H "X-Admin-Token: your-secret-token"
```

### Load Testing

```bash
# Install Apache Bench (if not installed)
sudo apt install apache2-utils

# Test cache performance with 100 requests, 10 concurrent
ab -n 100 -c 10 -p recipe_request.json -T "application/json" \
  https://recipe.vladbortnik.dev/api/recipe/generate

# recipe_request.json content:
{
  "ingredients": ["chicken", "rice", "broccoli"],
  "dietary": [],
  "cuisine": "any"
}

# Compare results:
# First run: Mix of cache misses and hits
# Second run: All cache hits (should be 40-100x faster)
```

### Monitor Cache Hit Rate

```bash
# Watch cache statistics in real-time
watch -n 1 'redis-cli info stats | grep keyspace'

# Or using custom script
while true; do
  redis-cli info stats | grep -E "keyspace_hits|keyspace_misses"
  sleep 2
done

# Calculate hit rate
redis-cli info stats | awk '/keyspace_hits/{hits=$2} /keyspace_misses/{misses=$2} END{print "Hit rate:", (hits/(hits+misses))*100"%"}'
```

### Test Cloudflare Workers (Option A)

```bash
# Test worker locally
cd recipe-cache-worker
wrangler dev

# Make request to local worker
curl http://localhost:8787/api/recipe/generate \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "rice"]}'

# Check cache headers
curl -I http://localhost:8787/api/recipe/generate \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "rice"]}'
# Look for X-Cache: HIT or MISS

# Deploy and test production
wrangler deploy
curl -I https://recipe.vladbortnik.dev/api/recipe/generate \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "rice"]}'

# View worker logs
wrangler tail
```

---

## Implementation Checklist

### Option B: Flask + Redis (Recommended for Quick Start)

- [ ] **Install Redis on server**
  - [ ] `sudo apt install redis-server`
  - [ ] Configure `/etc/redis/redis.conf` (maxmemory, bind, socket)
  - [ ] Restart: `sudo systemctl restart redis-server`
  - [ ] Verify: `redis-cli ping`

- [ ] **Update Flask application**
  - [ ] Install: `pip install Flask-Caching redis`
  - [ ] Add Redis config to `config.py`
  - [ ] Initialize cache in `app/__init__.py`
  - [ ] Add `@cache.cached()` decorators to endpoints

- [ ] **Implement cache key strategies**
  - [ ] Create `make_cache_key()` function
  - [ ] Add hash-based keys for POST requests
  - [ ] Implement user-specific caching if needed

- [ ] **Set appropriate TTLs**
  - [ ] Recipe generation: 24 hours
  - [ ] Spoonacular search: 6 hours
  - [ ] Ingredient recognition: 7 days

- [ ] **Add cache admin endpoints**
  - [ ] `/api/admin/cache/clear` - Manual invalidation
  - [ ] `/api/admin/cache/stats` - Monitoring

- [ ] **Test thoroughly**
  - [ ] Verify cache misses call external APIs
  - [ ] Verify cache hits return instantly
  - [ ] Monitor Redis memory usage
  - [ ] Check cache hit rate after 24 hours

- [ ] **Deploy to production**
  - [ ] Update requirements.txt
  - [ ] Set `REDIS_URL` in `.env`
  - [ ] Restart application: `sudo systemctl restart recipe-app`
  - [ ] Monitor logs: `sudo journalctl -u recipe-app -f`

### Option A: Cloudflare Workers (For Global Scale)

- [ ] **Setup Cloudflare Worker**
  - [ ] Install: `npm install -g wrangler`
  - [ ] Create project: `wrangler init`
  - [ ] Create KV namespace: `wrangler kv:namespace create RECIPE_CACHE`
  - [ ] Configure `wrangler.toml`

- [ ] **Implement worker logic**
  - [ ] Create `src/index.js` with cache logic
  - [ ] Implement cache key generation
  - [ ] Add TTL logic per endpoint type
  - [ ] Add cache headers (X-Cache, X-Cache-Key)

- [ ] **Test locally**
  - [ ] Run: `wrangler dev`
  - [ ] Test cache misses forward to origin
  - [ ] Test cache hits return from KV
  - [ ] Verify response times

- [ ] **Deploy to production**
  - [ ] Deploy: `wrangler deploy`
  - [ ] Configure route: `recipe.vladbortnik.dev/api/*`
  - [ ] Test live endpoint
  - [ ] Monitor: `wrangler tail`

- [ ] **Monitor and optimize**
  - [ ] Check KV storage usage
  - [ ] Monitor cache hit rate
  - [ ] Adjust TTLs based on usage patterns

---

## Monitoring & Maintenance

### Daily Checks

```bash
# Check Redis memory usage
redis-cli info memory | grep used_memory_human

# Check cache hit rate
redis-cli info stats | grep keyspace

# Check number of cached keys
redis-cli dbsize
```

### Weekly Maintenance

```bash
# Review cache statistics via admin API
curl https://recipe.vladbortnik.dev/api/admin/cache/stats \
  -H "X-Admin-Token: your-secret-token"

# Check for memory pressure
free -m
redis-cli info memory | grep maxmemory

# Review application logs for cache-related errors
sudo journalctl -u recipe-app --since "7 days ago" | grep -i cache
```

### Monthly Review

- Analyze cache hit rate trends
- Review API cost savings (compare with previous month)
- Check for cache key patterns that could be optimized
- Consider adjusting TTLs based on usage data
- Review Redis memory usage growth

### Alerts to Set Up

```bash
# Alert if Redis memory usage exceeds 400MB (out of 512MB limit)
# Alert if cache hit rate drops below 40%
# Alert if Redis service stops
# Alert if API costs increase despite caching
```

---

## Troubleshooting

### Issue: Cache not working (all requests miss)

**Diagnosis:**
```bash
# Check Redis is running
sudo systemctl status redis-server

# Check Flask can connect to Redis
redis-cli monitor
# Then make a request to your app - should see Redis commands

# Check Flask logs for Redis connection errors
sudo journalctl -u recipe-app -f | grep -i redis
```

**Solutions:**
- Verify `REDIS_URL` in `.env` is correct
- Check Redis is bound to correct interface (localhost or Unix socket)
- Verify Flask-Caching is initialized: `cache.init_app(app)`
- Check decorator syntax: `@cache.cached(timeout=3600)`

### Issue: High memory usage

**Diagnosis:**
```bash
# Check Redis memory usage
redis-cli info memory | grep used_memory_human

# Check number of keys
redis-cli dbsize

# Find large keys
redis-cli --bigkeys
```

**Solutions:**
- Reduce `maxmemory` in `/etc/redis/redis.conf`
- Decrease TTL values (shorter cache lifetime)
- Implement more aggressive `maxmemory-policy` (e.g., `volatile-lru`)
- Clear cache: `redis-cli flushdb` (development only)

### Issue: Stale data being served

**Diagnosis:**
```bash
# Check TTL of specific key
redis-cli ttl "recipe_hub_endpoint:recipe:abc123"

# Get cached value
redis-cli get "recipe_hub_endpoint:recipe:abc123"
```

**Solutions:**
- Manually invalidate cache: `redis-cli del "key"`
- Reduce TTL for that endpoint type
- Implement event-driven cache invalidation
- Add `force_refresh` query parameter bypass

### Issue: Cache stampede (many requests during expiration)

**Symptoms:**
- Sudden spike in external API calls
- Multiple identical requests to Azure AI/Spoonacular simultaneously

**Solutions:**
- Implement jittered TTL (±10% randomness)
- Use cache locking mechanism
- Pre-warm cache before expiration (background job)

```python
import random

def get_jittered_ttl(base_ttl):
    jitter = random.uniform(-0.1, 0.1)
    return int(base_ttl * (1 + jitter))
```

### Issue: Cloudflare Worker not caching

**Diagnosis:**
```bash
# Check worker logs
wrangler tail

# Test cache headers
curl -I https://recipe.vladbortnik.dev/api/recipe/generate

# Check KV namespace
wrangler kv:key list --namespace-id=your_id
```

**Solutions:**
- Verify route is configured correctly in `wrangler.toml`
- Check KV namespace binding
- Ensure requests are GET or cached POST endpoints
- Verify cache key generation logic

---

## Next Steps

### Immediate Actions (Week 1)

1. **Implement Option B (Flask + Redis)**
   - Fastest path to cost savings
   - Low complexity, immediate results
   - Follow checklist above

2. **Monitor Initial Performance**
   - Track cache hit rate daily
   - Monitor API cost reduction
   - Check server resource usage

3. **Adjust TTLs Based on Data**
   - Start conservative (shorter TTLs)
   - Increase after confirming data freshness is acceptable
   - Monitor user feedback

### Medium-Term (Month 2-3)

1. **Optimize Cache Keys**
   - Analyze which keys hit most frequently
   - Implement cache warming for popular queries
   - Add user-specific caching where needed

2. **Add Advanced Features**
   - Implement cache statistics dashboard
   - Add automatic cache warming
   - Set up alerting for cache issues

3. **Consider Hybrid Approach**
   - Keep Redis for application-level caching
   - Add Cloudflare Workers for hot paths (recipe generation)
   - Best of both worlds

### Long-Term (Month 4+)

1. **Scale with Cloudflare Workers**
   - Migrate high-traffic endpoints to edge caching
   - Leverage global CDN for international users
   - Reduce origin server load by 80%+

2. **Advanced Optimization**
   - Implement machine learning for cache prediction
   - Pre-warm cache based on trending ingredients
   - A/B test different TTL strategies

3. **Cost Analysis**
   - Calculate exact ROI from caching
   - Identify further optimization opportunities
   - Consider upgrading infrastructure with savings

---

## Conclusion

Smart caching can reduce Recipe API costs by **50-80%** and improve response times by **40-100x** with minimal infrastructure investment.

**Recommended Path:**
1. Start with **Flask + Redis** (this guide, Option B)
2. Monitor for 2-4 weeks
3. Migrate to **Cloudflare Workers** if serving global traffic or need edge caching

**Expected Results After Implementation:**
- API costs: $990/month → $198-396/month (**$600-800/month savings**)
- Response times: 2-5 seconds → < 50ms for cache hits (**40-100x faster**)
- Server load: 40-60% CPU → 15-25% CPU (**60% reduction**)
- User experience: Dramatically improved (instant responses)

**Time Investment:**
- Option B setup: 1-2 hours
- Option A setup: 3-5 hours
- Monitoring/optimization: 30 minutes/week

**ROI: Infinite** (no additional infrastructure costs, massive savings)

---

## Resources

### Documentation
- [Flask-Caching](https://flask-caching.readthedocs.io/)
- [Redis Documentation](https://redis.io/docs/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare KV](https://developers.cloudflare.com/kv/)

### Tools
- [Redis CLI Commands](https://redis.io/commands/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Apache Bench (ab)](https://httpd.apache.org/docs/2.4/programs/ab.html)

### Related Guides
- [04_ANALYTICS_STRATEGY_ALL_PROJECTS.md](/Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/04_ANALYTICS_STRATEGY_ALL_PROJECTS.md)
- [05_API_RATE_LIMITING_GUIDE.md](/Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/05_API_RATE_LIMITING_GUIDE.md)

---

**Document Version:** 1.0
**Last Updated:** November 10, 2025
**Author:** Claude Code (Anthropic)
**Maintained by:** Vlad Bortnik
