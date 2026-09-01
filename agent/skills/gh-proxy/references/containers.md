# Container image acceleration

Prefix a public image reference with `gh-proxy.org/docker/`. Preserve the complete registry path, architecture prefix, tag, or digest.

## Supported registries and shapes

```bash
# Docker Hub official and publisher images
docker pull gh-proxy.org/docker/nginx:latest
docker pull gh-proxy.org/docker/ubuntu:22.04
docker pull gh-proxy.org/docker/cleverest/crproxy
docker pull gh-proxy.org/docker/adguard/adguardhome

# Explicit architecture or docker.io host
docker pull gh-proxy.org/docker/amd64/nginx:latest
docker pull gh-proxy.org/docker/docker.io/adguard/adguardhome

# GCR and GHCR
docker pull gh-proxy.org/docker/gcr.io/kaniko-project/executor:debug
docker pull gh-proxy.org/docker/ghcr.io/openfaas/queue-worker

# Kubernetes registries
docker pull gh-proxy.org/docker/registry.k8s.io/kube-apiserver:v1.30.0
docker pull gh-proxy.org/docker/k8s.gcr.io/etcd:3.5.7-0

# Quay, MCR, Elastic, and NVIDIA NGC
docker pull gh-proxy.org/docker/quay.io/calico/cni
docker pull gh-proxy.org/docker/mcr.microsoft.com/powershell
docker pull gh-proxy.org/docker/docker.elastic.co/elasticsearch/elasticsearch:8.1.0
docker pull gh-proxy.org/docker/nvcr.io/nvidia/cuda:12.1.0-runtime-ubuntu20.04

# AWS ECR Public and GitLab Registry
docker pull gh-proxy.org/docker/public.ecr.aws/nginx/nginx:latest
docker pull gh-proxy.org/docker/registry.gitlab.com/gitlab-org/cli:v1.45.0

# Red Hat, Oracle, SUSE, and openSUSE
docker pull gh-proxy.org/docker/registry.access.redhat.com/ubi8/ubi:latest
docker pull gh-proxy.org/docker/container-registry.oracle.com/os/oraclelinux:8
docker pull gh-proxy.org/docker/registry.suse.com/suse/sle15:latest
docker pull gh-proxy.org/docker/registry.opensuse.org/opensuse/tumbleweed:latest
```

For `ghcr.io/example/app@sha256:...`, retain the entire digest suffix after adding the prefix.

Confirm that an image is anonymously readable before rewriting it. A source-registry manifest inspection that succeeds without logging in is useful evidence:

```bash
docker manifest inspect nvcr.io/nvidia/cuda:12.1.0-runtime-ubuntu20.04 >/dev/null
```

Do not assume every GHCR or NGC image is public; some require authentication, entitlement, or license acceptance.

## Supported consumers

- Docker and Podman pull commands
- Kubernetes workload `image` fields
- Docker Compose service `image` fields
- Dockerfile `FROM` instructions, including multi-stage builds
- CI/CD build, test, and runtime commands
- Podman registry configuration
- containerd registry mirror configuration

For a one-off Podman pull:

```bash
podman pull gh-proxy.org/docker/ghcr.io/alpine/alpine:latest
```

For Kubernetes, Compose, or Dockerfile usage, replace only the image reference. Preserve the rest of the manifest or build stage.

containerd mirror syntax differs by version, packaging, and CRI configuration. The service currently shows legacy `config.toml` mirror entries, but many deployments use per-registry `hosts.toml`. Inspect the installed containerd documentation and `containerd config dump`, preserve the current configuration, validate a manifest pull, and prepare a rollback before restarting the runtime. Do not paste one syntax blindly across versions.

The public service supports public images only. Do not forward registry credentials or private image names. For private images, use direct authenticated access, a trusted local egress proxy, or a private pull-through cache. Confirm before editing persistent Podman or containerd configuration or restarting a runtime. See <https://gh-proxy.com/docker> for current examples and constraints.
