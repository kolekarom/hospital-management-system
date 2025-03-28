export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function isOTPExpired(createdAt: Date, expiryMinutes: number = 10): boolean {
  const now = new Date();
  const expiryTime = new Date(createdAt.getTime() + expiryMinutes * 60000);
  return now > expiryTime;
}
