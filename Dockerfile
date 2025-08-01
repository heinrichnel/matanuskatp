# ====== Boufase ======
FROM node:20-alpine AS builder

# Stel werk gids in container
WORKDIR /app

# Kopieer package.json en package-lock.json vir caching
COPY package*.json ./

# Installeer dependencies
RUN npm install

# Kopieer al die res van jou projek in container
COPY . .

# Bou die app (Vite sal 'dist' folder maak)
RUN npm run build

# ====== Prod bediener fase ======
FROM nginx:alpine

# Standaard werk gids vir Nginx se statiese lêers
WORKDIR /usr/share/nginx/html

# Verwyder default inhoud van Nginx
RUN rm -rf ./*

# Kopieer geboude lêers vanaf builder image
COPY --from=builder /app/dist .

# (Opsioneel) Voeg jou eie nginx config by
# COPY nginx.conf /etc/nginx/nginx.conf

# Stel poort 80 bloot (Nginx luister hier)
EXPOSE 80

# Begin Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
