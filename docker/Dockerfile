FROM ubuntu:18.04
ENV DEBIAN_FRONTEND noninteractive

ARG OPENCV_VERSION
ARG NODEJS_MAJOR_VERSION
ARG WITH_CONTRIB

# install dependencies via apt
ENV DEBCONF_NOWARNINGS yes
RUN set -x && \
  apt-get update -y -qq && \
  apt-get upgrade -y -qq --no-install-recommends && \
  : "basic dependencies" && \
  apt-get install -y -qq \
    build-essential \
    pkg-config \
    cmake \
    git \
    wget \
    curl \
    tar \
    unzip && \
  : "OpenCV dependencies" && \
  apt-get install -y -qq \
    libjpeg-dev \
    libpng++-dev \
    libtiff-dev \
    libopenexr-dev \
    libwebp-dev \
    ffmpeg \
    libavcodec-dev \
    libavformat-dev \
    libavutil-dev \
    libswscale-dev \
    libavresample-dev && \
  : "remove cache" && \
  apt-get autoremove -y -qq && \
  rm -rf /var/lib/apt/lists/*

ENV CPATH=${CMAKE_INSTALL_PREFIX}/include:${CPATH}
ENV C_INCLUDE_PATH=${CMAKE_INSTALL_PREFIX}/include:${C_INCLUDE_PATH}
ENV CPLUS_INCLUDE_PATH=${CMAKE_INSTALL_PREFIX}/include:${CPLUS_INCLUDE_PATH}
ENV LIBRARY_PATH=${CMAKE_INSTALL_PREFIX}/lib:${LIBRARY_PATH}
ENV LD_LIBRARY_PATH=${CMAKE_INSTALL_PREFIX}/lib:${LD_LIBRARY_PATH}

# Node
RUN curl -sL https://deb.nodesource.com/setup_${NODEJS_MAJOR_VERSION}.x | bash && \
  apt-get install -y nodejs && node -v && npm -v

ARG CMAKE_INSTALL_PREFIX=/usr/local
ARG NUM_THREADS=7

# Eigen
ARG EIGEN3_VERSION=3.3.7
WORKDIR /tmp
RUN set -x && \
  wget -q https://gitlab.com/cantonios/eigen/-/archive/${EIGEN3_VERSION}/eigen-${EIGEN3_VERSION}.tar.bz2 && \
  tar xf eigen-${EIGEN3_VERSION}.tar.bz2 && \
  rm -rf eigen-${EIGEN3_VERSION}.tar.bz2 && \
  cd eigen-${EIGEN3_VERSION} && \
  mkdir -p build && \
  cd build && \
  cmake \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_INSTALL_PREFIX=${CMAKE_INSTALL_PREFIX} \
    .. && \
  make -j${NUM_THREADS} && \
  make install && \
  cd /tmp && \
  rm -rf *
ENV Eigen3_DIR=${CMAKE_INSTALL_PREFIX}/share/eigen3/cmake

# OpenCV
WORKDIR /opt
RUN set -x && \
  wget -q https://github.com/opencv/opencv/archive/${OPENCV_VERSION}.zip && \
  unzip -q ${OPENCV_VERSION}.zip && \
  rm -rf ${OPENCV_VERSION}.zip && \
  if [ -n "$WITH_CONTRIB" ]; then \
    wget -O opencv_contrib_${OPENCV_VERSION}.zip https://github.com/opencv/opencv_contrib/archive/${OPENCV_VERSION}.zip; \
    unzip -q opencv_contrib_${OPENCV_VERSION}.zip; \
    rm -rf opencv_contrib_${OPENCV_VERSION}.zip; \
  fi && \
  cd opencv-${OPENCV_VERSION} && \
  mkdir -p build && \
  cd build && \
  cmake_flags="-DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_INSTALL_PREFIX=${CMAKE_INSTALL_PREFIX} \
    -DBUILD_DOCS=OFF \
    -DBUILD_EXAMPLES=OFF \
    -DBUILD_JASPER=OFF \
    -DBUILD_OPENEXR=OFF \
    -DBUILD_PERF_TESTS=OFF \
    -DBUILD_TESTS=OFF \
    -DBUILD_opencv_apps=OFF \
    -DBUILD_opencv_dnn=OFF \
    -DBUILD_opencv_ml=OFF \
    -DBUILD_opencv_python_bindings_generator=OFF \
    -DENABLE_CXX11=ON \
    -DENABLE_FAST_MATH=ON \
    -DWITH_EIGEN=ON \
    -DWITH_FFMPEG=ON \
    -DWITH_OPENMP=ON \
    -DWITH_TBB=ON \
    -DWITH_V4L=ON \
    -DWITH_QT=OFF \
    -DWITH_OPENGL=ON \
    -DWITH_GSTREAMER=ON \
    -DOPENCV_GENERATE_PKGCONFIG=ON \
    -DOPENCV_ENABLE_NONFREE=ON" && \
  if [ -n "$WITH_CONTRIB" ]; then \
      cmake_flags="$cmake_flags -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib-${OPENCV_VERSION}/modules"; \
  fi && \
  cmake $cmake_flags .. && \
  make -j${NUM_THREADS} && \
  make install
ENV OpenCV_DIR=${CMAKE_INSTALL_PREFIX}/lib/cmake/opencv

ENV OPENCV4NODEJS_DISABLE_AUTOBUILD=1
ENV OPENCV_INCLUDE_DIR=/usr/local/include/
ENV OPENCV_LIB_DIR=/opt/opencv-${OPENCV_VERSION}/build/lib/