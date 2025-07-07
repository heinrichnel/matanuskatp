FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

# Install Java 17 (required for Firebase Firestore emulator)
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    openjdk-17-jdk \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME environment variable
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

# Configure Java alternatives to ensure java and javac are in PATH
RUN update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-17-openjdk-amd64/bin/java 1 \
    && update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/java-17-openjdk-amd64/bin/javac 1 \
    && update-alternatives --set java /usr/lib/jvm/java-17-openjdk-amd64/bin/java \
    && update-alternatives --set javac /usr/lib/jvm/java-17-openjdk-amd64/bin/javac

# Verify Java installation
RUN java -version

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"