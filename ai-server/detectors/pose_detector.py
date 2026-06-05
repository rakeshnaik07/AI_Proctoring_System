from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np

from mediapipe.tasks import python
from mediapipe.tasks.python import vision

MODEL_PATH = str(
    Path(__file__).resolve().parent.parent / "models" / "face_landmarker.task"
)

base_options = python.BaseOptions(
    model_asset_path=MODEL_PATH
)

options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    num_faces=1,
    output_face_blendshapes=False,
    output_facial_transformation_matrixes=True,
)

landmarker = vision.FaceLandmarker.create_from_options(options)


def detect_pose(image):
    """
    Returns head pose direction as a string.
    Possible values: FORWARD, LOOKING_LEFT, LOOKING_RIGHT, LOOKING_DOWN, NO_FACE
    """

    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    mp_image = mp.Image(
        image_format=mp.ImageFormat.SRGB,
        data=np.array(rgb_image)
    )

    result = landmarker.detect(mp_image)

    if not result.face_landmarks or not result.facial_transformation_matrixes:
        return "NO_FACE"

    matrix = result.facial_transformation_matrixes[0]
    rotation = np.array(matrix).reshape(4, 4)[:3, :3]

    sy = np.sqrt(rotation[0, 0] ** 2 + rotation[1, 0] ** 2)
    singular = sy < 1e-6

    if not singular:
        pitch = np.arctan2(rotation[2, 1], rotation[2, 2])
        yaw = np.arctan2(-rotation[2, 0], sy)
    else:
        pitch = np.arctan2(-rotation[1, 2], rotation[1, 1])
        yaw = np.arctan2(-rotation[2, 0], sy)

    yaw_deg = np.degrees(yaw)
    pitch_deg = np.degrees(pitch)

    yaw_threshold = 20
    pitch_threshold = 20

    if yaw_deg < -yaw_threshold:
        return "LOOKING_LEFT"

    if yaw_deg > yaw_threshold:
        return "LOOKING_RIGHT"

    if pitch_deg < -pitch_threshold:
        return "LOOKING_DOWN"

    return "FORWARD"
