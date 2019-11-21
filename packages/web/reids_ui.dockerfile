ARG base="nginx:latest"

FROM ${base} 

COPY --from=mpp_builder:latest /opt/packages/web/dist/mpp /usr/share/nginx/html/
# COPY --from=mpp_builder:latest /opt/packages/web/nginx.conf /etc/nginx/conf.d/default.conf
