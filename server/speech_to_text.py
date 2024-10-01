# Speech to text using google cloud
import io
from google.oauth2 import service_account
from google.cloud import speech

client_file = 'tsec-437208-76acdb179842.json'
credentials = service_account.Credentials.from_service_account_file(client_file)
client = speech.SpeechClient(credentials=credentials)

audio_file = 'answer.wav'

def transcribe_audio(audio_file):
    with io.open(audio_file, 'rb') as f:
        content = f.read()
        audio = speech.RecognitionAudio(content=content)

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
        sample_rate_hertz=48000,
        language_code='en-US',
    )

    response = client.recognize(config=config, audio=audio)

    return response.results[0].alternatives[0].transcript