import express from 'express';
import type { Router } from 'express';

const baseUrl = '/api/v1';

export const createServer = () => {
  const app = express();

  const setRoute = (url: string, route: Router) => {
    console.log(`${baseUrl}/${url}`);
    app.use(`${baseUrl}/${url}`, route);
  };

  return { app, setRoute };
};
