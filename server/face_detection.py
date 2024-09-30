import cv2
import mediapipe as mp
import numpy as np

# Initialize MediaPipe Face Mesh
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_face_mesh = mp.solutions.face_mesh

# Initialize drawing specs
drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)
cap = cv2.VideoCapture(0)

def get_face_roi(image, face_landmarks, width, height):
    # Get the bounding box around the face landmarks
    x_min = min([lm.x for lm in face_landmarks.landmark]) * width
    x_max = max([lm.x for lm in face_landmarks.landmark]) * width
    y_min = min([lm.y for lm in face_landmarks.landmark]) * height
    y_max = max([lm.y for lm in face_landmarks.landmark]) * height
    return int(x_min), int(y_min), int(x_max), int(y_max)

# Function to check if the candidate is looking straight ahead
def is_facing_straight(face_landmarks, width, height):
    nose_landmark = face_landmarks.landmark[1]  # Nose tip
    left_eye_landmark = face_landmarks.landmark[33]  # Left eye inner corner
    right_eye_landmark = face_landmarks.landmark[263]  # Right eye inner corner

    # Calculate the horizontal distance between the eyes
    horizontal_eye_distance = abs(left_eye_landmark.x - right_eye_landmark.x) * width

    # Check the horizontal distance of the nose tip from the middle of the eyes
    middle_x = (left_eye_landmark.x + right_eye_landmark.x) / 2
    nose_x = nose_landmark.x

    if abs(middle_x - nose_x) * width < 0.1 * horizontal_eye_distance:
        return True  # Candidate is looking straight ahead
    else:
        return False  # Candidate is looking away

# Function to check if the candidate is looking up or down
def is_looking_up_or_down(face_landmarks, width, height):
    nose_landmark = face_landmarks.landmark[1]  # Nose tip
    left_eye_landmark = face_landmarks.landmark[33]  # Left eye inner corner
    right_eye_landmark = face_landmarks.landmark[263]  # Right eye inner corner

    # Calculate the average vertical position of the eyes
    average_eye_y = (left_eye_landmark.y + right_eye_landmark.y) / 2

    # Check if the nose tip is higher or lower than the eyes
    if nose_landmark.y - 0.05 < average_eye_y:
        return "Looking Up"
    elif nose_landmark.y > average_eye_y + 0.1:
        return "Looking Down"
    else:
        return "Looking Straight"

# Function to check if the eyes are closed
def are_eyes_closed(face_landmarks, width, height):
    left_eye_upper = face_landmarks.landmark[159]  # Upper eyelid (left eye)
    left_eye_lower = face_landmarks.landmark[145]  # Lower eyelid (left eye)
    right_eye_upper = face_landmarks.landmark[386]  # Upper eyelid (right eye)
    right_eye_lower = face_landmarks.landmark[374]  # Lower eyelid (right eye)

    # Calculate the vertical distances between upper and lower eyelids
    left_eye_distance = abs(left_eye_upper.y - left_eye_lower.y) * height
    right_eye_distance = abs(right_eye_upper.y - right_eye_lower.y) * height

    # Threshold to determine if eyes are closed
    eye_closure_threshold = 0.01 * height

    return left_eye_distance < eye_closure_threshold and right_eye_distance < eye_closure_threshold

# Face mesh processing
with mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5) as face_mesh:
    
    while cap.isOpened():
        success, image = cap.read()
        image = cv2.flip(image, 1)
        if not success:
            print("Ignoring empty camera frame.")
            continue

        # Convert the color space and process the image
        image.flags.writeable = False
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(image_rgb)

        # Get image dimensions
        height, width, _ = image.shape

        # Process face landmarks if found
        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                # Draw face mesh
                image.flags.writeable = True
                image = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)
#                 mp_drawing.draw_landmarks(
#                     image=image,
#                     landmark_list=face_landmarks,
#                     connections=mp_face_mesh.FACEMESH_TESSELATION,
#                     landmark_drawing_spec=None,
#                     connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_tesselation_style())

                # Get face ROI and display it in a separate window
                x_min, y_min, x_max, y_max = get_face_roi(image, face_landmarks, width, height)
                face_roi = image[y_min:y_max, x_min:x_max]
                cv2.imshow('Face ROI', face_roi)

                # Check if candidate is facing straight
                if is_facing_straight(face_landmarks, width, height):
                    cv2.putText(image, "Looking Straight", (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                else:
                    cv2.putText(image, "Looking Away", (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

                # Check if candidate is looking up or down
                gaze_direction = is_looking_up_or_down(face_landmarks, width, height)
                cv2.putText(image, gaze_direction, (30, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)

                # Check if eyes are closed
                if are_eyes_closed(face_landmarks, width, height):
                    cv2.putText(image, "Eyes Closed", (30, 110), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                else:
                    cv2.putText(image, "Eyes Open", (30, 110), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Flip the image horizontally for a selfie-view display and show it
        cv2.imshow('MediaPipe Face Mesh', image)
        
        # Break loop with the 'ESC' key
        if cv2.waitKey(5) & 0xFF == 27:
            break

cap.release()
cv2.destroyAllWindows()
