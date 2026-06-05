from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np

from mediapipe.tasks import python
from mediapipe.tasks.python import vision

MODEL_PATH = str(
    Path(__file__).resolve().parent.parent / "models" / "blaze_face_short_range.tflite"
)

base_options = python.BaseOptions(
    model_asset_path=MODEL_PATH
)

options = vision.FaceDetectorOptions(
    base_options=base_options
)

detector = vision.FaceDetector.create_from_options(
    options
)


def detect_faces(image):
    rgb_image = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )

    mp_image = mp.Image(
        image_format=mp.ImageFormat.SRGB,
        data=np.array(rgb_image)
    )

    result = detector.detect(mp_image)

    return len(result.detections)
