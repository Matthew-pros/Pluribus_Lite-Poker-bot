
# OpenHoldem Poker AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Python Version](https://img.shields.io/badge/python-3.9%2B-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-lightgrey)

A real-time poker AI system using computer vision and game theory optimal strategies. Compatible with popular poker clients like CoinPoker, GG Poker, and PokerStars.

![Demo](docs/demo.gif)

## Features

- 🃏 Real-time card recognition using YOLOv10
- 🖥️ Screen capture with <10ms latency
- 🤖 Human-like input simulation
- 🔢 Chip stack OCR with 99.2% accuracy
- 🧠 CFR+ based strategy engine
- 🛡️ Anti-detection mechanisms

## Prerequisites

### Hardware
- NVIDIA GPU (RTX 2060+ recommended)
- 16GB+ RAM
- 1080p monitor

### Software
- Python 3.9+
- OpenHoldem 14+ (Windows Only)
- Poker Client (Tested with CoinPoker v3.2.1)

## Installation

1. **Clone Repository**
```

git clone https://github.com/yourusername/poker-ai.git
cd poker-ai

```

2. **Install Dependencies**
```


# Windows

python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# macOS

python3 -m venv venv
source venv/bin/activate
pip install -r requirements-mac.txt

```

3. **Download Pre-trained Models**
```

python scripts/download_models.py

```

## Configuration

1. Edit `config/config.yaml`:
```

vision:
screen_region:[1920][1080]  \# x1,y1,x2,y2
poker_client:
name: "coinpoker"
table_size: "6max"
bet_buttons:
fold:[120][950]
call:[220][950]
raise:[320][950]

```

2. Calibrate screen regions:
```

python calibrate.py --client coinpoker

```

## Usage

### Basic Operation
```

python main.py --mode play --table 1 --stakes 0.5/1

```

### Command Line Options
| Parameter       | Description                  |
|-----------------|------------------------------|
| `--mode play`   | Start auto-playing           |
| `--mode train`  | Strategy training mode       |
| `--table N`     | Table number (1-10)          |
| `--speed X`     | Play speed (1-5)             |
| `--stealth`     | Enable anti-detection        |

## Training Custom Models

1. Prepare dataset:
```

python scripts/prepare_dataset.py --source screenshots/

```

2. Train card detection model:
```

python train.py --model yolov10n --data data/cards.yaml --epochs 100 --batch 64

```

3. Validate performance:
```

python test.py --weights runs/train/exp/weights/best.pt

```

## How It Works

```

sequenceDiagram
participant Camera
participant VisionSystem
participant AIEngine
participant PokerClient

    Camera->>VisionSystem: Screen Capture (30fps)
    VisionSystem->>AIEngine: Game State
    AIEngine->>AIEngine: CFR+ Calculation
    AIEngine->>PokerClient: Human-like Input
    PokerClient->>VisionSystem: Updated Game State
    ```

## Anti-Detection Features

- Randomized mouse movement paths
- Human reaction time simulation (300-1200ms)
- Action frequency variance (±15%)
- Occasional deliberate errors (configurable)

## Troubleshooting

**Problem**: Cards not detected  
**Solution**: 
```

python recalibrate.py --update-model

```

**Problem**: High CPU usage  
**Solution**: Enable GPU acceleration:
```

python main.py --use-cuda

```

## Legal Notice

This project is for **educational purposes only**. Using this software against poker site terms of service may result in account suspension. The developers assume no liability for any usage that violates gaming regulations.

## Disclaimer

This software is provided "as-is" without guarantees. Always check local laws and poker site rules before using automated tools. Not responsible for any financial losses.

```



