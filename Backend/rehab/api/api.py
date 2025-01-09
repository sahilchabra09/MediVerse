from ninja import Router,Schema
from ninja import File
from ninja.files import UploadedFile
import PyPDF2
from PIL import Image
import pytesseract
import os
from ninja.errors import HttpError
from django.conf import settings
from pydantic import BaseModel
from datetime import datetime
from twilio.rest import Client
from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import authenticate
from django.http import JsonResponse
from ninja.security import HttpBearer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
import google.generativeai as genai
from pydantic import BaseModel
from typing import List,Optional
from datetime import datetime
import random
from dotenv import load_dotenv

load_dotenv()

router = Router(auth=None)

# Feature 4 : Routine Generation
class GoalSchema(Schema):
    goal: str

HEALTH_KEYWORDS = [
    "exercise", "fitness", "nutrition", "diet", "yoga", "workout", "meditation", "wellness", "health",
    "hydration", "mental health", "sleep", "stretching", "cardio", "strength", "aerobics", "HIIT", "recovery",
    "mindfulness", "self-care", "immune", "balance", "endurance", "flexibility", "detox", "calisthenics",
    "weight loss", "muscle gain", "stress relief", "cholesterol", "blood pressure", "heart health",
    "diabetes management", "healthy habits", "physical therapy", "injury prevention", "posture", "core stability"
]


@router.post("/routine")
def routine_feature(request, data: GoalSchema):
    goal = data.goal.lower()

    # Check if the goal contains any health-related keywords
    if not any(keyword in goal for keyword in HEALTH_KEYWORDS):
        raise HttpError(status_code=400, detail="Only health-related topics are supported for routine generation.")

    # If it's a health-related topic, proceed with generating the plan
    query = f"generate me a 10 days plan for {goal} in md format without any extra description"
    response = talk_to_gemini(query)

    return {"routine": response}



# Feature 1: File upload and summarization start
@router.post("/upload", tags=["files"],auth=None)
def upload_and_summarize(request, file: UploadedFile = File(...)):
    # Save file to a temporary location
    save_path = os.path.join(settings.MEDIA_ROOT, file.name)
    with open(save_path, "wb") as f:
        for chunk in file.chunks():
            f.write(chunk)

    # Extract text from the file
    text = extract_text(save_path)

    summary = summarize_text(text)

    return {"summary": summary}


def extract_text(file_path):
    if file_path.endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    elif file_path.endswith('.jpg') or file_path.endswith(".jpeg") or file_path.endswith('.png'):
        return extract_text_from_image(file_path)
    else:
        return "Unsupported file format"


def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)  # Use PdfReader
        for page_num in range(len(reader.pages)):  # Use len(reader.pages)
            page = reader.pages[page_num]
            text += page.extract_text()
    return text

def extract_text_from_image(file_path):
    img = Image.open(file_path)
    text = pytesseract.image_to_string(img)
    print(text)
    return text

def summarize_text(text):
    query = f"summarize this for me {text}"
    res = talk_to_gemini(query)
    return res

# Feature 1 end

# Feature 2: Doctor call start
class DoctorCallRequest(Schema):
    meeting_id: str

@router.post('/doctorCall', tags=["doctorCall"])
def doctorCall(request, data: DoctorCallRequest):
    meeting_id = data.meeting_id
    moderatorURL = f'https://meet.jit.si/{meeting_id}#config.prejoinPageEnabled=false&userInfo.displayName=Moderator';
    send_sms('+917009023965', f'Click this link to join the meeting as a moderator: {moderatorURL}')
    return {"message": "Doctor called successfully"}

def send_sms(to, message):
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    try:
        message = client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to
        )
        return message.sid
    except Exception as e:
        return str(e)
# Feature 2 end

def talk_to_gemini(query):
    # Get the API key from environment variables
    api_key = os.getenv("GOOGLE_GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Google Gemini API key is not set. Please ensure it's set in your .env file.")

    # Configure the genai library with the correct API key
    genai.configure(api_key=api_key)

    # Initialize the model
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(query)
    return response.text