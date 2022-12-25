FROM nginx:1.22.1
WORKDIR /usr/share/nginx/html/
COPY dist .
COPY ./nginx.conf /etc/nginx/http.d/default.conf
EXPOSE 80
