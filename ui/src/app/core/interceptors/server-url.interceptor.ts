// ui/src/app/core/interceptors/server-url.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export const serverUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Si on est sur le serveur ET que l'URL est relative (commence par /)
  if (isPlatformServer(platformId) && req.url.startsWith('/api')) {
    const newReq = req.clone({
      // On la transforme en URL absolue pour que le serveur sache où appeler.
      url: `https://www.argandici.com${req.url}`
    });
    return next(newReq);
  }

  // Sinon (si on est dans le navigateur), on ne touche à rien.
  return next(req);
};
