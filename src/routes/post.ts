import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;
app.use(express.json())
app.listen(PORT, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)

// GET /post/:post_id - Traer una publicación por su id e incluir la cantidad de temas, duración total del disco en segundos y todos los temas.
app.get('/post/:post_id', async (req: Request, res: Response) => {
    const { post_id } = req.params;
  
    try {
      const post = await prisma.post.findUnique({
        where: { id: parseInt(post_id) },
        include: {
          songs: true,
        },
      });
  
      if (!post) {
        return res.status(404).json({ error: 'Publicación no encontrada.' });
      }
  
      const amount_songs = post.songs.length;
      const length_song = post.songs.reduce((total, tema) => total + tema.duration, 0);
  
      res.json({
        post,
        amount_songs,
        length_song,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al obtener la publicación.' });
    }
  });
  
  // POST /new_post - Crear una publicación y sus temas.
  app.post('/new_post', async (req: Request, res: Response) => {
    const { artist_id, type, name, post_date, songs } = req.body;
  
    if (!artist_id || !type || !name || !post_date || !songs) {
      return res.status(400).json({ error: 'Faltan datos para crear la publicacion.' });
    }
  
    try {
      const post = await prisma.post.create({
        data: {
          artist_id,
          type,
          name,
          post_date,
          songs: {
            create: songs.map((song: any) => ({
              index: song.index,
              name: song.name,
              duration: song.duration,
            })),
          },
        },
        include: {
          songs: true,
        },
      });
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al crear la publicación.' });
    }
  });
  
  // DELETE /del_post/:post_id 
  app.delete('/del_post/:post_id', async (req, res) => {
    const { post_id } = req.params;
  
    try {
      // Eliminar los registros de Song relacionados con la publicación
      await prisma.song.deleteMany({
        where: {
          post_id: parseInt(post_id),
        },
      });
      // Eliminar la publicación
      await prisma.post.delete({
        where: { id: parseInt(post_id) },
      });
  
      res.status(204).json({ message: 'El artista ha sido borrado con exito.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al borrar el post.' });
    }
  });
  