import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // Surcharge du comportement par défaut :
    // si pas de user => ne jette pas d'erreur, retourne null
    return user ?? null;
  }
}
