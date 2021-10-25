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

# Node
RUN curl -sL https://deb.nodesource.com/setup_${NODEJS_MAJOR_VERSION}.x | bash && \
  apt-get install -y nodejs && node -v && npm -v

ARG CMAKE_INSTALL_PREFIX=/usr/local
ARG NUM_THREADS=7

WORKDIR /opt
RUN set -x && \
  wget -O opencv_${OPENCV_VERSION}.zip https://github.com/opencv/opencv/archive/${OPENCV_VERSION}.zip && \
  unzip -q opencv_${OPENCV_VERSION}.zip && \
  rm -rf opencv_${OPENCV_VERSION}.zip && \
  if [ -n "$WITH_CONTRIB" ]; then \
    wget -O opencv_contrib_${OPENCV_VERSION}.zip https://github.com/opencv/opencv_contrib/archive/${OPENCV_VERSION}.zip; \
    unzip -q opencv_contrib_${OPENCV_VERSION}.zip; \
    rm -rf opencv_contrib_${OPENCV_VERSION}.zip; \
  fi && \
  cd opencv-${OPENCV_VERSION} && \
  mkdir -p build && \
  cd build && \
  cmake_flags="-D CMAKE_BUILD_TYPE=RELEASE \
  -D BUILD_EXAMPLES=OFF \
  -D BUILD_DOCS=OFF \
  -D BUILD_TESTS=OFF \
  -D BUILD_PERF_TESTS=OFF \
  -D BUILD_JAVA=OFF \
  -D BUILD_opencv_apps=OFF \
  -D BUILD_opencv_aruco=OFF \
  -D BUILD_opencv_bgsegm=OFF \
  -D BUILD_opencv_bioinspired=OFF \
  -D BUILD_opencv_ccalib=OFF \
  -D BUILD_opencv_datasets=OFF \
  -D BUILD_opencv_dnn_objdetect=OFF \
  -D BUILD_opencv_dpm=OFF \
  -D BUILD_opencv_fuzzy=OFF \
  -D BUILD_opencv_hfs=OFF \
  -D BUILD_opencv_java_bindings_generator=OFF \
  -D BUILD_opencv_js=OFF \
  -D BUILD_opencv_img_hash=OFF \
  -D BUILD_opencv_line_descriptor=OFF \
  -D BUILD_opencv_optflow=OFF \
  -D BUILD_opencv_phase_unwrapping=OFF \
  -D BUILD_opencv_python3=OFF \
  -D BUILD_opencv_python_bindings_generator=OFF \
  -D BUILD_opencv_reg=OFF \
  -D BUILD_opencv_rgbd=OFF \
  -D BUILD_opencv_saliency=OFF \
  -D BUILD_opencv_shape=OFF \
  -D BUILD_opencv_stereo=OFF \
  -D BUILD_opencv_stitching=OFF \
  -D BUILD_opencv_structured_light=OFF \
  -D BUILD_opencv_superres=OFF \
  -D BUILD_opencv_surface_matching=OFF \
  -D BUILD_opencv_ts=OFF \
  -D BUILD_opencv_xobjdetect=OFF \
  -D BUILD_opencv_xphoto=OFF \
  -D CMAKE_INSTALL_PREFIX=/usr/local" && \
  if [ -n "$WITH_CONTRIB" ]; then \
    cmake_flags="$cmake_flags -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib-${OPENCV_VERSION}/modules"; \
  fi && \
  echo $cmake_flags && \
  cmake $cmake_flags .. && \
  make -j${NUM_THREADS} && \
  make install
ENV OpenCV_DIR=${CMAKE_INSTALL_PREFIX}/lib/cmake/opencv4

ENV CPATH=${CMAKE_INSTALL_PREFIX}/include:${CPATH}
ENV C_INCLUDE_PATH=${CMAKE_INSTALL_PREFIX}/include:${C_INCLUDE_PATH}
ENV CPLUS_INCLUDE_PATH=${CMAKE_INSTALL_PREFIX}/include:${CPLUS_INCLUDE_PATH}
ENV LIBRARY_PATH=${CMAKE_INSTALL_PREFIX}/lib:${LIBRARY_PATH}
ENV LD_LIBRARY_PATH=${CMAKE_INSTALL_PREFIX}/lib:${LD_LIBRARY_PATH}

ENV OPENCV4NODEJS_DISABLE_AUTOBUILD=1
ENV OPENCV_INCLUDE_DIR /usr/local/include/opencv4/
ENV OPENCV_LIB_DIR /opt/opencv-${OPENCV_VERSION}/build/lib/