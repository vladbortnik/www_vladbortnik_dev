# Setting Up Nginx Reverse Proxy

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## What is a Reverse Proxy?

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.

## Configuration Example

```nginx
server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.

## Load Balancing

Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.

### Upstream Configuration

```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}
```

## SSL Termination

Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus.

## Conclusion

Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus.
