import bcryptjs from 'bcryptjs';

/**
 * Salts and hashes a plaintext password asynchronously.
 * 
 * @param {string} password - The plaintext password to hash.
 * @returns {Promise<string>} The salted and hashed password. 
 */
export async function saltAndHashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcryptjs.hash(password, saltRounds);
  return hashedPassword;
}