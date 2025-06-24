[105 ms] Running Dev Containers CLI:   up --user-data-folder /Users/jereje/Library/Application Support/Cursor/User/globalStorage/ms-vscode-remote.remote-containers/data --container-session-data-folder /tmp/devcontainers-9696a430-48fd-410f-8b2b-48e6e62a91a71750711461328 --workspace-folder /Users/jereje/Repos/WhitePrompt/EraserMCP --workspace-mount-consistency cached --gpu-availability detect --id-label devcontainer.local_folder=/Users/jereje/Repos/WhitePrompt/EraserMCP --id-label devcontainer.config_file=/Users/jereje/Repos/WhitePrompt/EraserMCP/.devcontainer/devcontainer.json --log-level debug --log-format json --config /Users/jereje/Repos/WhitePrompt/EraserMCP/.devcontainer/devcontainer.json --default-user-env-probe loginInteractiveShell --mount type=volume,source=vscode,target=/vscode,external=true --skip-post-create --update-remote-user-uid-default on --mount-workspace-git-root --include-configuration --include-merged-configuration
[118 ms] ProxyResolver#loadSystemCertificates count
[118 ms] ProxyResolver#loadSystemCertificates count filtered
[118 ms] Start: Run: /Applications/Cursor.app/Contents/Frameworks/Cursor Helper (Plugin).app/Contents/MacOS/Cursor Helper (Plugin) /Users/jereje/.cursor/extensions/ms-vscode-remote.remote-containers-0.394.0/dist/spec-node/devContainersSpecCLI.js up --user-data-folder /Users/jereje/Library/Application Support/Cursor/User/globalStorage/ms-vscode-remote.remote-containers/data --container-session-data-folder /tmp/devcontainers-9696a430-48fd-410f-8b2b-48e6e62a91a71750711461328 --workspace-folder /Users/jereje/Repos/WhitePrompt/EraserMCP --workspace-mount-consistency cached --gpu-availability detect --id-label devcontainer.local_folder=/Users/jereje/Repos/WhitePrompt/EraserMCP --id-label devcontainer.config_file=/Users/jereje/Repos/WhitePrompt/EraserMCP/.devcontainer/devcontainer.json --log-level debug --log-format json --config /Users/jereje/Repos/WhitePrompt/EraserMCP/.devcontainer/devcontainer.json --default-user-env-probe loginInteractiveShell --mount type=volume,source=vscode,target=/vscode,external=true --skip-post-create --update-remote-user-uid-default on --mount-workspace-git-root --include-configuration --include-merged-configuration
[229 ms] @devcontainers/cli 0.72.0. Node.js v20.19.0. darwin 24.5.0 arm64.
[229 ms] Start: Run: docker buildx version
[365 ms] github.com/docker/buildx v0.19.2-desktop.1 412cbb151f1be3f8a94dc4eb03cd1b67f261dec5
[365 ms] 
[366 ms] Start: Run: docker -v
[375 ms] Start: Resolving Remote
[377 ms] Start: Run: docker ps -q -a --filter label=devcontainer.local_folder=/Users/jereje/Repos/WhitePrompt/EraserMCP --filter label=devcontainer.config_file=/Users/jereje/Repos/WhitePrompt/EraserMCP/.devcontainer/devcontainer.json
[394 ms] Start: Run: docker inspect --type image node:20-alpine
[416 ms] Resolving Feature dependencies for 'ghcr.io/devcontainers/features/common-utils:2'...
[416 ms] * Processing feature: ghcr.io/devcontainers/features/common-utils:2
[417 ms] Loading 3 extra certificates from /var/folders/dy/vgz2zj1x3f73rpnklq1jwxlh0000gn/T/vsch/certificates-b7642cb3722b25e8bf802d09733fe158e63ee16cad1e694760dda921e9609291.pem.
[793 ms] Start: Run: docker-credential-desktop get
[1523 ms] * Fetching feature: common-utils_0_oci
[2023 ms] Files to omit: ''
[2027 ms] * Fetched feature: common-utils_0_oci version 2.5.3
[2029 ms] Start: Run: docker buildx build --load --build-arg BUILDKIT_INLINE_CACHE=1 -f /var/folders/dy/vgz2zj1x3f73rpnklq1jwxlh0000gn/T/devcontainercli/container-features/0.72.0-1750711462336/Dockerfile-with-features -t vsc-erasermcp-16ae92f8e3060dfd3dd006173d4d3e35bbc0a1e9a542deb04a2fc456ebb5c882 --target dev_containers_target_stage --build-context dev_containers_feature_content_source=/var/folders/dy/vgz2zj1x3f73rpnklq1jwxlh0000gn/T/devcontainercli/container-features/0.72.0-1750711462336 --build-arg _DEV_CONTAINERS_BASE_IMAGE=dev_container_auto_added_stage_label --build-arg _DEV_CONTAINERS_IMAGE_USER=vscode --build-arg _DEV_CONTAINERS_FEATURE_CONTENT_SOURCE=dev_container_feature_content_temp /Users/jereje/Repos/WhitePrompt/EraserMCP/.devcontainer
[+] Building 26.9s (18/18) FINISHED                        docker:desktop-linux
 => [internal] load build definition from Dockerfile-with-features         0.0s
 => => transferring dockerfile: 2.65kB                                     0.0s
 => resolve image config for docker-image://docker.io/docker/dockerfile:1  1.6s
 => CACHED docker-image://docker.io/docker/dockerfile:1.4@sha256:9ba7531b  0.0s
 => => resolve docker.io/docker/dockerfile:1.4@sha256:9ba7531bd80fb0a8586  0.0s
 => [internal] load .dockerignore                                          0.0s
 => => transferring context: 2B                                            0.0s
 => [internal] load metadata for docker.io/library/node:20-alpine          0.0s
 => [context dev_containers_feature_content_source] load .dockerignore     0.0s
 => => transferring dev_containers_feature_content_source: 2B              0.0s
 => [dev_container_auto_added_stage_label 1/5] FROM docker.io/library/nod  0.9s
 => => resolve docker.io/library/node:20-alpine@sha256:674181320f4f94582c  0.9s
 => [context dev_containers_feature_content_source] load from client       0.0s
 => => transferring dev_containers_feature_content_source: 95.23kB         0.0s
 => [dev_container_auto_added_stage_label 2/5] RUN apk add --no-cache git  1.7s
 => [dev_container_auto_added_stage_label 3/5] WORKDIR /workspace          0.0s
 => [dev_container_auto_added_stage_label 4/5] RUN npm install -g typesc  12.0s 
 => [dev_container_auto_added_stage_label 5/5] RUN adduser -D -s /bin/bas  0.1s 
 => [dev_containers_feature_content_normalize 1/2] COPY --from=dev_contai  0.0s 
 => [dev_containers_target_stage 1/4] RUN mkdir -p /tmp/dev-container-fea  0.1s 
 => [dev_containers_feature_content_normalize 2/2] RUN chmod -R 0755 /tmp  0.2s 
 => [dev_containers_target_stage 2/4] COPY --from=dev_containers_feature_  0.0s
 => [dev_containers_target_stage 3/4] RUN echo "_CONTAINER_USER_HOME=$( (  0.1s
 => ERROR [dev_containers_target_stage 4/4] RUN --mount=type=bind,from=d  10.0s
------
 > [dev_containers_target_stage 4/4] RUN --mount=type=bind,from=dev_containers_feature_content_source,source=common-utils_0,target=/tmp/build-features-src/common-utils_0     cp -ar /tmp/build-features-src/common-utils_0 /tmp/dev-container-features  && chmod -R 0755 /tmp/dev-container-features/common-utils_0  && cd /tmp/dev-container-features/common-utils_0  && chmod +x ./devcontainer-features-install.sh  && ./devcontainer-features-install.sh  && rm -rf /tmp/dev-container-features/common-utils_0:
0.132 ===========================================================================
0.132 Feature       : Common Utilities
0.132 Description   : Installs a set of common command line utilities, Oh My Zsh!, and sets up a non-root user.
0.132 Id            : ghcr.io/devcontainers/features/common-utils
0.132 Version       : 2.5.3
0.132 Documentation : https://github.com/devcontainers/features/tree/main/src/common-utils
0.132 Options       :
0.132     INSTALLZSH="false"
0.132     CONFIGUREZSHASDEFAULTSHELL="false"
0.132     INSTALLOHMYZSH="true"
0.132     INSTALLOHMYZSHCONFIG="true"
0.132     UPGRADEPACKAGES="true"
0.132     USERNAME="vscode"
0.132     USERUID="1000"
0.132     USERGID="1000"
0.132     NONFREEPACKAGES="false"
0.132 ===========================================================================
0.137 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/aarch64/APKINDEX.tar.gz
0.573 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/aarch64/APKINDEX.tar.gz
0.954 OK: 27 MiB in 34 packages
0.976 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/aarch64/APKINDEX.tar.gz
1.139 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/aarch64/APKINDEX.tar.gz
1.367 v3.22.0-222-g4386c2e32f5 [https://dl-cdn.alpinelinux.org/alpine/v3.22/main]
1.367 v3.22.0-223-gcc35a32a8ff [https://dl-cdn.alpinelinux.org/alpine/v3.22/community]
1.367 OK: 26150 distinct packages available
1.386 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/aarch64/APKINDEX.tar.gz
1.613 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/aarch64/APKINDEX.tar.gz
1.786 (1/89) Installing bash-completion (2.16.0-r0)
2.070 (2/89) Installing ca-certificates (20241121-r2)
2.104 (3/89) Installing coreutils-env (9.7-r1)
2.126 (4/89) Installing coreutils-fmt (9.7-r1)
2.151 (5/89) Installing coreutils-sha512sum (9.7-r1)
2.172 (6/89) Installing acl-libs (2.3.2-r1)
2.193 (7/89) Installing libattr (2.5.2-r2)
2.236 (8/89) Installing skalibs-libs (2.14.4.0-r0)
2.265 (9/89) Installing utmps-libs (0.1.3.1-r0)
2.287 (10/89) Installing coreutils (9.7-r1)
2.332 (11/89) Installing curl (8.14.1-r0)
2.362 (12/89) Installing git-bash-completion (2.49.0-r0)
2.608 (13/89) Installing libgpg-error (1.55-r0)
2.637 (14/89) Installing libassuan (2.5.7-r0)
2.670 (15/89) Installing pinentry (1.3.1-r0)
2.693 Executing pinentry-1.3.1-r0.post-install
2.700 (16/89) Installing libgcrypt (1.10.3-r1)
2.739 (17/89) Installing gnupg-gpgconf (2.4.7-r0)
2.767 (18/89) Installing gmp (6.3.0-r3)
2.805 (19/89) Installing nettle (3.10.1-r0)
2.844 (20/89) Installing libffi (3.4.8-r0)
2.867 (21/89) Installing libtasn1 (4.20.0-r0)
2.891 (22/89) Installing p11-kit (0.25.5-r2)
2.924 (23/89) Installing gnutls (3.8.8-r0)
2.982 (24/89) Installing libksba (1.6.7-r0)
3.093 (25/89) Installing gdbm (1.24-r0)
3.116 (26/89) Installing libsasl (2.1.28-r8)
3.153 (27/89) Installing libldap (2.6.8-r0)
3.190 (28/89) Installing npth (1.8-r0)
3.209 (29/89) Installing gnupg-dirmngr (2.4.7-r0)
3.251 (30/89) Installing sqlite-libs (3.49.2-r0)
3.303 (31/89) Installing gnupg-keyboxd (2.4.7-r0)
3.330 (32/89) Installing libbz2 (1.0.8-r6)
3.355 (33/89) Installing gpg (2.4.7-r0)
3.397 (34/89) Installing gpg-agent (2.4.7-r0)
3.430 (35/89) Installing gpg-wks-server (2.4.7-r0)
3.458 (36/89) Installing gpgsm (2.4.7-r0)
3.496 (37/89) Installing gpgv (2.4.7-r0)
3.620 (38/89) Installing gnupg-utils (2.4.7-r0)
3.659 (39/89) Installing gnupg-wks-client (2.4.7-r0)
3.682 (40/89) Installing gnupg (2.4.7-r0)
3.682 (41/89) Installing grep (3.12-r0)
3.713 (42/89) Installing htop (3.4.1-r0)
3.746 (43/89) Installing oniguruma (6.9.10-r0)
3.777 (44/89) Installing jq (1.8.0-r0)
3.808 (45/89) Installing krb5-conf (1.0-r2)
3.833 (46/89) Installing libcom_err (1.47.2-r2)
3.856 (47/89) Installing keyutils-libs (1.6.3-r4)
3.882 (48/89) Installing libverto (0.3.2-r2)
3.908 (49/89) Installing krb5-libs (1.21.3-r0)
3.959 (50/89) Installing less (679-r0)
3.986 (51/89) Installing libintl (0.24.1-r0)
4.010 (52/89) Installing lsof (4.99.4-r1)
4.039 (53/89) Installing lttng-ust (2.13.9-r0)
4.297 (54/89) Installing nano (8.4-r0)
4.325 (55/89) Installing ncdu (1.22-r0)
4.571 (56/89) Installing mii-tool (2.10-r3)
4.912 (57/89) Installing net-tools (2.10-r3)
4.949 (58/89) Installing openssh-keygen (10.0_p1-r7)
4.982 (59/89) Installing libedit (20250104.3.1-r1)
5.013 (60/89) Installing openssh-client-common (10.0_p1-r7)
5.067 (61/89) Installing openssh-client-default (10.0_p1-r7)
5.193 (62/89) Installing libproc2 (4.0.4-r3)
5.220 (63/89) Installing procps-ng (4.0.4-r3)
5.256 (64/89) Installing psmisc (23.7-r0)
5.506 (65/89) Installing lz4-libs (1.10.0-r0)
5.534 (66/89) Installing popt (1.19-r4)
5.562 (67/89) Installing libxxhash (0.8.3-r0)
5.588 (68/89) Installing rsync (3.4.1-r0)
5.619 (69/89) Installing sed (4.9-r2)
5.743 (70/89) Installing libmd (1.1.0-r0)
5.763 (71/89) Installing libbsd (0.12.2-r0)
5.785 (72/89) Installing linux-pam (1.7.0-r4)
5.830 (73/89) Installing shadow (4.17.3-r0)
5.872 (74/89) Installing libelf (0.193-r0)
5.900 (75/89) Installing musl-fts (1.2.7-r6)
6.238 (76/89) Installing xz-libs (5.8.1-r0)
6.264 (77/89) Installing libdw (0.193-r0)
6.547 (78/89) Installing strace (6.13-r0)
6.809 (79/89) Installing sudo (1.9.16_p2-r1)
6.859 (80/89) Installing tzdata (2025b-r0)
6.899 (81/89) Installing unzip (6.0-r15)
6.935 (82/89) Installing userspace-rcu (0.15.2-r0)
6.965 (83/89) Installing vim-common (9.1.1415-r0)
7.312 (84/89) Installing xxd (9.1.1415-r0)
7.331 (85/89) Installing vim (9.1.1415-r0)
7.414 (86/89) Installing wget (1.25.0-r1)
7.460 (87/89) Installing which (2.23-r0)
7.813 (88/89) Installing xz (5.8.1-r0)
7.853 (89/89) Installing zip (3.0-r13)
7.891 Executing busybox-1.37.0-r18.trigger
7.895 Executing ca-certificates-20241121-r2.trigger
7.918 OK: 99 MiB in 123 packages
8.657 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/aarch64/APKINDEX.tar.gz
8.923 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/aarch64/APKINDEX.tar.gz
9.095 (1/2) Installing man-pages (6.13-r0)
9.574 (2/2) Installing mandoc (1.14.6-r13)
9.916 Executing busybox-1.37.0-r18.trigger
9.919 OK: 102 MiB in 125 packages
9.945 groupmod: GID '1000' already exists
9.945 ERROR: Feature "Common Utilities" (ghcr.io/devcontainers/features/common-utils) failed to install! Look at the documentation at https://github.com/devcontainers/features/tree/main/src/common-utils for help troubleshooting this error.