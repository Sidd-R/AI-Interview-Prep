from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from werkzeug.security import generate_password_hash, check_password_hash
import json
from flask_cors import CORS
import cv2, base64, io
import numpy as np
from PIL import Image

# Initialize Flask and Flask-SocketIO
app = Flask(__name__)
# CORS(app)
app.config["SECRET_KEY"] = "secret!"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
db = SQLAlchemy(app)
socketio = SocketIO(app, cors_allowed_origins="*")

CORS(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    skills = db.Column(db.String(300), nullable=True)


# Create the database
with app.app_context():
    db.create_all()


# Registration endpoint
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    skills = data.get("skills")

    if User.query.filter_by(name=name).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(
        name=name, password=hashed_password, email=email, skills=json.dumps(skills)
    )
    db.session.add(new_user)
    db.session.commit()

    return (
        jsonify(
            {
                "id": new_user.id,
                "email": new_user.email,
                "name": new_user.name,
                "skills": json.loads(new_user.skills),
            }
        ),
        201,
    )


# Login endpoint
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    # return user profile
    return (
        jsonify(
            {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "skills": json.loads(user.skills),
            }
        ),
        200,
    )


@app.route("/userInfo", methods=["GET"])
def userInfo():
    data = request.get_json()
    id = data.get("id")
    user = User.query.filter_by(id=id).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    return (
        jsonify(
            {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "skills": json.loads(user.skills),
            }
        ),
        200,
    )

@socketio.on("image-tech")
def image_tech(data):
    image = data["image"]
    image = image.split(",")[1]
    # print("Received image")
    # sbuf = io.StringIO()
    # sbuf.write(image)

    # decode and convert into image
    b = io.BytesIO(base64.b64decode(image))
    pimg = Image.open(b)
    
    # save image
    pimg.save("image.jpg")


# Run the server
if __name__ == "__main__":
    socketio.run(app, debug=True)
