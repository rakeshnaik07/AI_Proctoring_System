import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from detectors.face_detector import detect_faces
from detectors.pose_detector import detect_pose

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def decode_image(contents):
    np_array = np.frombuffer(contents, np.uint8)
    return cv2.imdecode(np_array, cv2.IMREAD_COLOR)


def pose_violation_for(direction):
    if direction in ["LOOKING_LEFT", "LOOKING_RIGHT"]:
        return "LOOKING_AWAY"

    if direction == "LOOKING_DOWN":
        return "LOOKING_DOWN"

    return None


def analyze_image(image):
    face_count = detect_faces(image)
    direction = detect_pose(image)
    violations = []

    if face_count == 0:
        violations.append("NO_FACE")
    elif face_count > 1:
        violations.append("MULTIPLE_FACE")

    pose_violation = pose_violation_for(direction)
    if pose_violation:
        violations.append(pose_violation)

    return {
        "success": True,
        "faces": face_count,
        "direction": direction,
        "poseSuspicious": pose_violation is not None,
        "suspicious": len(violations) > 0,
        "violations": violations
    }


@app.get("/")
def home():
    return {
        "message": "AI Proctoring Server Running"
    }


@app.post("/detect-face")
async def detect_face(
    file: UploadFile = File(...)
):
    contents = await file.read()
    image = decode_image(contents)

    if image is None:
        return {
            "success": False,
            "message": "Invalid image"
        }

    face_count = detect_faces(image)

    return {
        "success": True,
        "faces": face_count
    }


@app.post("/detect-pose")
async def detect_pose_endpoint(
    file: UploadFile = File(...)
):
    contents = await file.read()
    image = decode_image(contents)

    if image is None:
        return {
            "success": False,
            "message": "Invalid image"
        }

    direction = detect_pose(image)

    return {
        "success": True,
        "direction": direction,
        "suspicious": direction != "FORWARD" and direction != "NO_FACE"
    }


@app.post("/analyze-frame")
async def analyze_frame(
    file: UploadFile = File(...)
):
    contents = await file.read()
    image = decode_image(contents)

    if image is None:
        return {
            "success": False,
            "message": "Invalid image",
            "faces": 0,
            "direction": "NO_FACE",
            "poseSuspicious": False,
            "suspicious": False,
            "violations": []
        }

    return analyze_image(image)
