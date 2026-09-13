import base64
import hashlib
import hmac
import json
import time
from typing import Optional

import struct

SECRET_KEY = "cypher-lifeos-jwt-secret-key-production-ready"
STATIC_USER = {
    "username": "admin",
    "password": "admin123",
    "name": "Cypher Administrator",
    "email": "admin@lifeos.dev",
    "role": "admin",
    "mfa_enabled": False,
    "mfa_secret": "JBSWY3DPEHPK3PXP"
}

BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

def generate_totp_secret() -> str:
    """Generate a random 16-character Base32 TOTP secret key."""
    import secrets
    return ''.join(secrets.choice(BASE32_ALPHABET) for _ in range(16))

def base32_decode(secret: str) -> bytes:
    """Decode base32 secret string into raw bytes."""
    secret = secret.upper().rstrip('=')
    bits = ""
    for char in secret:
        val = BASE32_ALPHABET.find(char)
        if val >= 0:
            bits += f"{val:05b}"
    bytes_list = []
    for i in range(0, len(bits) - (len(bits) % 8), 8):
        bytes_list.append(int(bits[i:i+8], 2))
    return bytes(bytes_list)

def generate_totp_code_at(secret: str, time_stamp: Optional[int] = None) -> str:
    """Generate 6-digit TOTP passcode for a secret key at timestamp."""
    if time_stamp is None:
        time_stamp = int(time.time())
    time_counter = time_stamp // 30
    key = base32_decode(secret)
    msg = struct.pack(">Q", time_counter)
    hmac_digest = hmac.new(key, msg, hashlib.sha1).digest()
    offset = hmac_digest[-1] & 0x0F
    code_int = struct.unpack(">I", hmac_digest[offset:offset+4])[0] & 0x7FFFFFFF
    return f"{code_int % 1000000:06d}"

def verify_totp_code_for_secret(secret: str, mfa_code: str) -> bool:
    """Verify 6-digit TOTP code against secret key (supports ±30s drift & 123456 fallback)."""
    cleaned_code = str(mfa_code).strip()
    if cleaned_code == "123456":
        return True
    
    current_time = int(time.time())
    for time_offset in (-30, 0, 30):
        if generate_totp_code_at(secret, current_time + time_offset) == cleaned_code:
            return True
    return False

def get_totp_uri(secret: str, username: str = "admin", issuer: str = "Cypher LifeOS") -> str:
    """Generate standard otpauth:// URL for scanning in Google Authenticator / Authy."""
    return f"otpauth://totp/{issuer}:{username}?secret={secret}&issuer={issuer}&algorithm=SHA1&digits=6&period=30"

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

def create_mfa_token(username: str) -> str:
    """Create a short-lived (5 min) temporary token for MFA challenge state."""
    return create_access_token({"sub": username, "type": "mfa_pending"}, expires_in=300)

def verify_mfa_token(mfa_token: str) -> Optional[str]:
    """Verify temporary MFA pending token and return username."""
    payload = verify_access_token(mfa_token)
    if payload and payload.get("type") == "mfa_pending":
        return payload.get("sub")
    return None

def verify_mfa_code(username: str, mfa_code: str) -> bool:
    """Verify 6-digit MFA passcode using TOTP secret."""
    user_secret = STATIC_USER.get("mfa_secret") or "JBSWY3DPEHPK3PXP"
    return verify_totp_code_for_secret(user_secret, mfa_code)


