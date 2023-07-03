import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// GET /artists - Traer todos los artistas disponibles.
router.get('/', async (req: Request, res: Response) => {
    try {
      const artists = await prisma.artists.findMany();
      res.json(artists);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al obtener los artistas.' });
    }
  });
  
// GET /artists/:artist_id - Traer un artista por su id e incluir todas sus publicaciones ordenadas por fecha de publicacion.
  router.get('/:artist_id', async (req: Request, res: Response) => {
    
    try {
      const { artist_id } = req.params;
      const artist = await prisma.artists.findUnique({
        where: { id: parseInt(artist_id) },
        include: { post: {
          orderBy: { post_date: 'asc' },
          include: { songs: true } }}, 
      });
  
      if (!artist) {
        return res.status(404).json({ error: 'Artista no encontrado.' });
      }
      res.json(artist);
      console.log(res.json(artist))
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al obtener el artista.' });
    }
  });

  // POST /new_artist - Crear un nuevo artista.
  router.post('/new_artist', async (req: Request, res: Response) => {
    
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Falta el nombre del artista.' });
      }
      const new_artist = await prisma.artists.create({
        data: req.body,
      });
      console.log(req.body)
      res.json(new_artist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al crear el artista.' });
    }
  });
  
  // PUT /upd_artists/:artist_id - Actualizar los datos de un artista.
  router.put('/upd_artist/:artist_id', async (req: Request, res: Response) => {
    const { artist_id } = req.params;
    const { name } = req.body;
  
    try {
      const upd_artist = await prisma.artists.update({
        where: { id: parseInt(artist_id) },
        data: { name },
      });
  
      res.json(upd_artist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al actualizar el artista.' });
    }
  });
  
  // DELETE /del_artists/:artist_id - Borrar un artista por su id.
  router.delete('/del_artist/:artist_id', async (req: Request, res: Response) => {
    try {
      const { artist_id } = req.params;
      const deleted_artist = await prisma.artists.delete({
        where: { id: parseInt(artist_id) },
      });
  
      if (!deleted_artist) {
        return res.status(404).json({ error: 'Artista no encontrado.' });
      }
  
      res.sendStatus(204).json({ message: 'El artista ha sido borrado con exito.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al borrar el artista.' });
    }
  });
  
  module.exports = router;