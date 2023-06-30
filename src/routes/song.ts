import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;
app.use(express.json())
app.listen(PORT, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)

// GET /song/:song_id - Traer una cancion por su id y Luego, se incluyen los posts relacionados con ese tema.
app.get('/song/:song_id', async (req, res) => {
  const { song_id } = req.params;

  try {
    const song = await prisma.song.findUnique({
      where: {
        id: parseInt(song_id),
      },
      include: {
        post: true,
      },
    });

    if (!song) {
      return res.status(404).json({ error: 'No se encontró el tema.' });
    }

    res.json(song);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el tema.' });
  }
});
