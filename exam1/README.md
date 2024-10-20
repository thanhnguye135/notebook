## Cách connect các container trong cùng một network

### Step 1: Tạo network

```json
docker create network tulip-net
```

### Step 2: Config connection network

```json
services:
    service_name:
        networks:
            - tulip-net

networks:
    tulip-net:
        external: true
```

### Step 3: Check connection in tulip-net

```json
docker network inspect tulip-net
```
