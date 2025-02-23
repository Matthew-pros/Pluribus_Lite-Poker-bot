FROM nvidia/cuda:11.8.0-base
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3.9 \
    python3-pip \
    libgl1 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    ocl-icd-opencl-dev \
    libd3d11

COPY requirements.txt .
RUN pip install -r requirements.txt

WORKDIR /app
COPY . .

CMD ["python", "src/core/auto_player.py"]
