# syntax=docker/dockerfile:1.7

# Build-time stage
FROM artifactory.aexp.com/paas-registry/buildpacks/rhel-nodejs-22-builder:22.x.latest AS builder

ARG NEXT_PUBLIC_ENV=e0

WORKDIR /usr/src/app

# install deps
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# copy source and build
COPY . .

ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV}

# Use BuildKit secret mounts so IDAAS values are available during `npm run build`
# without persisting them into an image layer.
RUN --mount=type=secret,id=IDAAS_APP_ID,mode=0444 \
    --mount=type=secret,id=IDAAS_HOST,mode=0444 \
    --mount=type=secret,id=IDAAS_SECRET,mode=0444 \
    set -eu; \
    for secret_name in IDAAS_APP_ID IDAAS_HOST IDAAS_SECRET; do \
        secret_path="/run/secrets/${secret_name}"; \
        if [ -s "${secret_path}" ]; then \
            echo "[build-secrets] ${secret_name}: available"; \
            secret_value="$(cat "${secret_path}")"; \
            export "${secret_name}=${secret_value}"; \
        else \
            echo "[build-secrets] ${secret_name}: NOT available"; \
        fi; \
    done; \
    npm run build

# Run-time stage
FROM artifactory.aexp.com/paas-registry/buildpacks/rhel-nodejs-22-builder:22.x.latest AS runner

ARG APP_UID=1000
ARG APP_GID=1000
ARG NEXT_PUBLIC_ENV=e0

WORKDIR /usr/src/app

USER root

# create deterministic non-root user
RUN set -eux; \
    groupadd -g "${APP_GID}" app || true; \
    useradd -m -u "${APP_UID}" -g app app || true

# copy only what's needed for runtime to keep image small
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/.next .next
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/public public
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/node_modules node_modules
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/package.json .
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/redirects.ts .
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/next.config.ts .
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/src/scripts/server.js src/scripts/server.js
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/src/app/contribute/markdown src/app/contribute/markdown
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/src/app/enterprise-business-architecture/markdown src/app/enterprise-business-architecture/markdown
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/src/app/strategy/markdown src/app/strategy/markdown
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/src/constants src/constants
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/certs certs
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/cache-handler.js cache-handler.js
COPY --from=builder --chown=${APP_UID}:${APP_GID} /usr/src/app/redis-client.js redis-client.js

ENV NODE_ENV=production
ENV npm_config_cache=/tmp/.npm
ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV}
ENV PORT=8080
# Runtime still reads from /opt/epaas/vault/secrets/secrets for token refresh flows.

# switch to non-root user
USER ${APP_UID}:${APP_GID}

# Source environment for non-interactive shells
ENV BASH_ENV=/etc/environment

EXPOSE 8080

CMD ["npm", "start"]
