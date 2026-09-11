import base64
import hashlib
import hmac
import json
import time
from typing import Optional

SECRET_KEY = "cypher-lifeos-jwt-secret-key-production-ready"
STATIC_USER = {
    "username": "admin",
    "password": "admin123",
    "name": "Cypher Administrator",
    "email": "admin@lifeos.dev",
    "role": "admin"
}

def b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def b64_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4))
    return base64.urlsafe_b64decode(data + padding)

def create_access_token(payload_data: dict, expires_in: int = 86400) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    now = int(time.time())
    payload = {
        **payload_data,
        "iat": now,
        "exp": now + expires_in
    }

    header_b64 = b64_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    payload_b64 = b64_encode(json.dumps(payload, separators=(',', ':')).encode('utf-8'))

    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    signature_b64 = b64_encode(signature)

    return f"{header_b64}.{payload_b64}.{signature_b64}"

def verify_access_token(token: str) -> Optional[dict]:
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None

        header_b64, payload_b64, signature_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_sig = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()

        if not hmac.compare_digest(b64_encode(expected_sig), signature_b64):
            return None

        payload = json.loads(b64_decode(payload_b64).decode('utf-8'))
        if payload.get("exp", 0) < time.time():
            return None

        return payload
    except Exception:
        return None
