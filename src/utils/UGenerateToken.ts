import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pokoknya_aman';

export function UGenerateToken(payload: object): string {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
}