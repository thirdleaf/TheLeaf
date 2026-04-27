import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";

@Injectable()
export class EncryptionService {
  private readonly algorithm = "aes-256-gcm";
  private readonly key: Buffer;

  constructor(private readonly configService: ConfigService) {
    const hexKey = this.configService.get<string>("ENCRYPTION_KEY");
    if (!hexKey || hexKey.length !== 64) {
      throw new InternalServerErrorException(
        "ENCRYPTION_KEY must be a 32-byte hex string (64 characters)"
      );
    }
    this.key = Buffer.from(hexKey, "hex");
  }

  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(plaintext, "utf8", "base64");
    encrypted += cipher.final("base64");
    
    const authTag = cipher.getAuthTag().toString("base64");
    
    return JSON.stringify({
      iv: iv.toString("base64"),
      at: authTag,
      ct: encrypted,
    });
  }

  decrypt(ciphertext: string): string {
    try {
      const { iv, at, ct } = JSON.parse(ciphertext);
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        Buffer.from(iv, "base64")
      );
      
      decipher.setAuthTag(Buffer.from(at, "base64"));
      
      let decrypted = decipher.update(ct, "base64", "utf8");
      decrypted += decipher.final("utf8");
      
      return decrypted;
    } catch (error) {
       throw new InternalServerErrorException("Failed to decrypt field");
    }
  }
}
